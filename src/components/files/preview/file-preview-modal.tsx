"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { usePreviewStore } from "@/stores/preview-store";
import { useFile, useCheckFileStatus } from "@/hooks/use-files";
import {
  useFavoriteMaps,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/use-favorites";
import { getErrorMessage } from "@/lib/api/client";
import { toast } from "@/components/ui/toaster";
import {
  getCachedDownloadUrl,
  setCachedDownloadUrl,
  removeCachedDownloadUrl,
} from "@/lib/file-preview-cache";
import { PreviewHeader } from "./preview-header";
import { PreviewNav } from "./preview-nav";
import { PreviewStatus } from "./preview-status";
import { ImagePreview } from "./image-preview";
import { AudioPreview } from "./audio-preview";
import { VideoPreview } from "./video-preview";
import { DefaultPreview } from "./default-preview";
import type { FileItem } from "../file-table";

// Extension groups
const PHOTO_EXTENSIONS = new Set([
  "webp",
  "png",
  "jpeg",
  "jpg",
  "svg",
  "gif",
  "bmp",
  "avif",
  "ico",
]);

const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "ogg",
  "aac",
  "flac",
  "m4a",
  "wma",
  "opus",
  "aiff",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "webm",
  "mkv",
  "mov",
  "avi",
  "m4v",
  "ogv",
  "3gp",
  "flv",
]);

type PreviewGroup = "image" | "audio" | "video" | "default";

function getPreviewGroup(extension?: string): PreviewGroup {
  if (!extension) return "default";
  const ext = extension.toLowerCase().replace(/^\./, "");
  if (PHOTO_EXTENSIONS.has(ext)) return "image";
  if (AUDIO_EXTENSIONS.has(ext)) return "audio";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  return "default";
}

export function FilePreviewModal() {
  const {
    previewFileId,
    activeFiles,
    closePreview,
    nextFile,
    prevFile,
  } = usePreviewStore();
  const queryClient = useQueryClient();

  const [isDownloading, setIsDownloading] = useState(false);

  const activeItem: FileItem | undefined = useMemo(() => {
    if (!previewFileId) return undefined;
    return activeFiles.find(
      (f) => !f.isFolder && String(f.id) === String(previewFileId)
    );
  }, [previewFileId, activeFiles]);

  const fileId = activeItem?.id || (previewFileId ? String(previewFileId) : undefined);
  const { data: file, isPending: filePending, isError: fileError } = useFile(fileId);

  // Favorite / Star state & mutations
  const { fileMap, isSuccess: isFavoritesLoaded } = useFavoriteMaps();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const favoriteRecord = fileId ? fileMap.get(fileId) : undefined;
  const isStarred = isFavoritesLoaded
    ? Boolean(favoriteRecord)
    : Boolean(favoriteRecord || file?.is_favorite || activeItem?.isStarred);
  const isStarPending = addFavorite.isPending || removeFavorite.isPending;

  const handleToggleStar = useCallback(() => {
    if (!fileId || isStarPending) return;

    if (favoriteRecord) {
      removeFavorite.mutate(favoriteRecord.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
      addFavorite.mutate(
        { file_id: fileId },
        {
          onSuccess: () => toast("success", "Added to favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  }, [fileId, isStarPending, favoriteRecord, removeFavorite, addFavorite]);

  // Cached download URL state
  const [cachedUrl, setCachedUrl] = useState<string | null>(() => getCachedDownloadUrl(fileId));

  // Sync cached URL when active fileId changes
  useEffect(() => {
    setCachedUrl(getCachedDownloadUrl(fileId));
  }, [fileId]);

  // When useFile returns download URL and there's NO valid cache, save to cache
  useEffect(() => {
    if (!fileId || !file?.url?.download) return;
    const existingCache = getCachedDownloadUrl(fileId);
    if (!existingCache) {
      setCachedDownloadUrl(fileId, file.url.download);
      setCachedUrl(file.url.download);
    }
  }, [fileId, file?.url?.download]);

  // Auto-evict cache on media load error and refetch fresh URL from API
  const handleMediaError = useCallback(() => {
    if (!fileId) return;
    removeCachedDownloadUrl(fileId);
    setCachedUrl(null);
    queryClient.invalidateQueries({ queryKey: ["files", fileId], exact: true });
  }, [fileId, queryClient]);

  const checkStatusUrl = file?.url?.check_status ?? null;
  const effectiveDownloadUrl = cachedUrl || file?.url?.download || null;

  const {
    data: checkStatus,
    isFetching: statusChecking,
    refetch: refetchStatus,
  } = useCheckFileStatus(fileId, checkStatusUrl);

  const isStatusCheckingInitial = Boolean(checkStatusUrl) && checkStatus === undefined && statusChecking;
  const isReady = checkStatus ? checkStatus.isUploaded === true : Boolean(effectiveDownloadUrl);
  const isFilesList = activeFiles.filter((f) => !f.isFolder);
  const hasMultiple = isFilesList.length > 1;

  // Refetch status direct on mount / file change
  useEffect(() => {
    if (checkStatusUrl) {
      refetchStatus();
    }
  }, [checkStatusUrl, refetchStatus]);

  // Keyboard navigation & shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePreview();
      } else if (e.key === "ArrowLeft") {
        prevFile();
      } else if (e.key === "ArrowRight") {
        nextFile();
      }
    },
    [closePreview, prevFile, nextFile]
  );

  useEffect(() => {
    if (!previewFileId) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewFileId, handleKeyDown]);

  if (!previewFileId || (!activeItem && !file && !filePending)) return null;

  const fileName = activeItem?.name || file?.name || "File";
  const effectiveExtension = file?.extension || activeItem?.extension || "";
  const previewGroup = getPreviewGroup(effectiveExtension);

  const lastModified = file?.updated_at || file?.created_at || activeItem?.lastModified || null;
  const fileSize = file?.size ?? (typeof activeItem?.size === "number" ? activeItem.size : null);

  const handleDownload = async () => {
    if (!effectiveDownloadUrl) {
      toast("error", "This file is not available for download yet.");
      return;
    }

    const fullName = effectiveExtension && !fileName.endsWith(`.${effectiveExtension}`)
      ? `${fileName}.${effectiveExtension}`
      : fileName;

    try {
      setIsDownloading(true);

      const response = await axios.get<Blob>(effectiveDownloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fullName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      toast("success", `Downloaded ${fullName}`);
    } catch {
      // Fallback direct anchor download if blob streaming fails
      try {
        const link = document.createElement("a");
        link.href = effectiveDownloadUrl;
        link.download = fullName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast("success", `Downloaded ${fullName}`);
      } catch (err) {
        toast("error", getErrorMessage(err));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={closePreview}
    >
      {/* Top Header */}
      <PreviewHeader
        fileName={fileName}
        extension={effectiveExtension}
        fileSize={fileSize}
        lastModified={lastModified}
        isStarred={isStarred}
        onToggleStar={handleToggleStar}
        isStarPending={isStarPending}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        onClose={closePreview}
      />

      {/* Floating Prev/Next Navigation */}
      <PreviewNav
        onPrev={prevFile}
        onNext={nextFile}
        hasMultiple={hasMultiple}
      />

      {/* Main Preview Reading Canvas */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center p-4 pt-16 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {filePending || isStatusCheckingInitial ? (
          <PreviewStatus state="loading" message="Loading file preview…" />
        ) : fileError ? (
          <PreviewStatus
            state="error"
            message="Failed to load file information. Please try again."
            onRetry={() => refetchStatus()}
          />
        ) : !isReady ? (
          <PreviewStatus
            state="unready"
            onRetry={() => refetchStatus()}
            isChecking={statusChecking}
          />
        ) : !effectiveDownloadUrl ? (
          <PreviewStatus
            state="unready"
            onRetry={() => refetchStatus()}
            isChecking={statusChecking}
          />
        ) : (
          <>
            {previewGroup === "image" && (
              <ImagePreview
                src={effectiveDownloadUrl}
                fileName={fileName}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "audio" && (
              <AudioPreview
                src={effectiveDownloadUrl}
                fileName={fileName}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "video" && (
              <VideoPreview
                src={effectiveDownloadUrl}
                fileName={fileName}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "default" && (
              <DefaultPreview
                item={
                  activeItem || {
                    id: fileId!,
                    name: fileName,
                    isFolder: false,
                    isStarred: isStarred,
                    extension: effectiveExtension,
                  }
                }
                file={file}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
