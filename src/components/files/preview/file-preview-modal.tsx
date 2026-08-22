"use client";

import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { usePreviewStore } from "@/stores/preview-store";
import { useFile, useCheckFileStatus } from "@/hooks/use-files";
import {
  useFavoriteMaps,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/use-favorites";
import { getErrorMessage, removeApiCacheByPattern } from "@/lib/api/client";
import { toast } from "@/components/ui/toaster";
import {
  getCachedDownloadUrl,
  setCachedDownloadUrl,
  removeCachedDownloadUrl,
  isUrlExpired,
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fileId = previewFileId ?? undefined;
  const { data: file, isPending: filePending, isError: fileError } = useFile(fileId);

  const [isDownloading, setIsDownloading] = useState(false);

  const activeItem: FileItem | undefined = useMemo(() => {
    if (!previewFileId) return undefined;
    const found = activeFiles.find(
      (f) => !f.isFolder && String(f.id) === String(previewFileId)
    );
    if (found) return found;
    if (file) {
      return {
        id: String(file.id),
        name: file.name,
        extension: file.extension,
        isFolder: false,
        tags: file.tags || [],
        isStarred: file.is_favorite,
      };
    }
    return undefined;
  }, [previewFileId, activeFiles, file]);

  // Favorite / Star state & mutations
  const { fileMap } = useFavoriteMaps();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const favoriteRecord = fileId ? fileMap.get(fileId) : undefined;
  const lastKnownFavoriteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (favoriteRecord?.id) {
      lastKnownFavoriteIdRef.current = favoriteRecord.id;
    }
  }, [favoriteRecord]);

  // Local optimistic state for Star / Unstar
  const [optimisticStarred, setOptimisticStarred] = useState<boolean | null>(null);

  // Reset optimistic state when active fileId changes
  useEffect(() => {
    setOptimisticStarred(null);
  }, [fileId]);

  const serverStarred = Boolean(
    favoriteRecord || file?.is_favorite || activeItem?.isStarred
  );
  const isStarred = optimisticStarred !== null ? optimisticStarred : serverStarred;
  const isStarPending = addFavorite.isPending || removeFavorite.isPending;

  // Optimistic Star / Unstar handler
  const handleToggleStar = useCallback(async () => {
    if (!fileId || isStarPending) return;

    const previousStarred = isStarred;
    const nextStarred = !previousStarred;

    // 1. Optimistic update immediately
    setOptimisticStarred(nextStarred);

    if (nextStarred) {
      try {
        const res = await addFavorite.mutateAsync({ file_id: fileId });
        if (res?.id) {
          lastKnownFavoriteIdRef.current = res.id;
        }
        toast("success", "Added to favorites");
      } catch (err) {
        // Rollback on failure
        setOptimisticStarred(previousStarred);
        toast("error", getErrorMessage(err));
      }
    } else {
      const favId = lastKnownFavoriteIdRef.current || favoriteRecord?.id;
      if (favId) {
        try {
          await removeFavorite.mutateAsync(favId);
          lastKnownFavoriteIdRef.current = null;
          toast("success", "Removed from favorites");
        } catch (err) {
          // Rollback on failure
          setOptimisticStarred(previousStarred);
          toast("error", getErrorMessage(err));
        }
      } else {
        // Search cache for favorite ID if lookup map was not ready
        try {
          const favData =
            queryClient.getQueryData<{ data?: Array<{ id: string; file_id?: string; file?: { id: string } }> }>(["favorites", { limit: 100 }]) ||
            queryClient.getQueryData<{ data?: Array<{ id: string; file_id?: string; file?: { id: string } }> }>(["favorites", {}]);
          const match = favData?.data?.find(
            (f) => String(f.file_id) === String(fileId) || String(f.file?.id) === String(fileId)
          );
          if (match?.id) {
            await removeFavorite.mutateAsync(match.id);
            lastKnownFavoriteIdRef.current = null;
            toast("success", "Removed from favorites");
          } else {
            setOptimisticStarred(previousStarred);
            toast("error", "Unable to remove favorite record");
          }
        } catch (err) {
          setOptimisticStarred(previousStarred);
          toast("error", getErrorMessage(err));
        }
      }
    }
  }, [fileId, isStarPending, isStarred, favoriteRecord, addFavorite, removeFavorite, queryClient]);

  // Cached download URL state
  const [cachedUrl, setCachedUrl] = useState<string | null>(() => getCachedDownloadUrl(fileId));

  // Sync cached URL when active fileId changes
  useEffect(() => {
    setCachedUrl(getCachedDownloadUrl(fileId));
  }, [fileId]);

  // When useFile returns download URL and there's NO valid cache, save to cache if not expired
  useEffect(() => {
    if (!fileId || !file?.url?.download) return;
    if (isUrlExpired(file.url.download)) {
      // Server returned expired URL or cache was stale -> invalidate and fetch fresh
      removeCachedDownloadUrl(fileId);
      removeApiCacheByPattern(`/files/${fileId}`);
      return;
    }
    const existingCache = getCachedDownloadUrl(fileId);
    if (!existingCache) {
      setCachedDownloadUrl(fileId, file.url.download);
      setCachedUrl(file.url.download);
    }
  }, [fileId, file?.url?.download]);

  // Retry tracker to prevent infinite reload loops
  const mediaRetryCountRef = useRef(0);

  useEffect(() => {
    mediaRetryCountRef.current = 0;
  }, [fileId]);

  // Auto-evict cache on media load error and refetch fresh URL from API
  const handleMediaError = useCallback(() => {
    if (!fileId) return;
    removeCachedDownloadUrl(fileId);
    setCachedUrl(null);
    removeApiCacheByPattern(`/files/${fileId}`);

    if (mediaRetryCountRef.current < 2) {
      mediaRetryCountRef.current += 1;
      queryClient.invalidateQueries({ queryKey: ["files", fileId] });
    }
  }, [fileId, queryClient]);

  const checkStatusUrl = file?.url?.check_status ?? null;
  const validCachedUrl = cachedUrl && !isUrlExpired(cachedUrl) ? cachedUrl : null;
  const validServerUrl = file?.url?.download && !isUrlExpired(file.url.download) ? file.url.download : null;
  const effectiveDownloadUrl = validCachedUrl || validServerUrl || null;

  const {
    data: checkStatus,
    isFetching: statusChecking,
    refetch: refetchStatus,
  } = useCheckFileStatus(fileId, checkStatusUrl);

  const isReady = checkStatus?.isUploaded === true || Boolean(effectiveDownloadUrl);
  const isFilesList = activeFiles.filter((f) => !f.isFolder);
  const hasMultiple = isFilesList.length > 1;

  // Refetch status direct on mount / file change
  useEffect(() => {
    if (checkStatusUrl) {
      refetchStatus();
    }
  }, [checkStatusUrl, refetchStatus]);

  // Native dialog showModal/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (previewFileId) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [previewFileId]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      closePreview();
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleClose);
    };
  }, [closePreview]);
    
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

  if (!previewFileId) return null;

  const effectiveExtension = file?.extension || activeItem?.extension || "";
  const previewGroup = getPreviewGroup(effectiveExtension);
  const fileName = activeItem?.name || file?.name || "";

  const lastModified = file?.updated_at || file?.created_at || activeItem.lastModified || null;
  const fileSize = file?.size ?? (typeof activeItem.size === "number" ? activeItem.size : null);

  const handleDownload = async () => {
    if (!effectiveDownloadUrl) {
      toast("error", "This file is not available for download yet.");
      return;
    }

    const fullName = effectiveExtension && !activeItem.name.endsWith(`.${effectiveExtension}`)
      ? `${activeItem.name}.${effectiveExtension}`
      : activeItem.name;

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

  // Determine non-flashing loading state
  const isInitialLoading = (filePending && !file && !cachedUrl) || (statusChecking && !checkStatus && !effectiveDownloadUrl);

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 m-0 p-0 max-w-none max-h-none w-screen h-screen bg-black/90 backdrop-blur-md border-0 outline-none overflow-hidden z-50 flex items-center justify-center backdrop:bg-black/90 backdrop:backdrop-blur-md animate-in fade-in duration-200"
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
        downloadDisabled={!fileId || filePending}
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
        {filePending || statusChecking || (!activeItem && !fileError) ? (
          <PreviewStatus state="loading" message="Loading file preview…" />
        ) : fileError || !activeItem ? (
          <PreviewStatus
            state="error"
            message="Failed to load file information. Please try again."
            onRetry={() => refetchStatus()}
          />
        ) : !isReady || !effectiveDownloadUrl ? (
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
                fileName={activeItem.name}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "audio" && (
              <AudioPreview
                src={effectiveDownloadUrl}
                fileName={activeItem.name}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "video" && (
              <VideoPreview
                src={effectiveDownloadUrl}
                fileName={activeItem.name}
                extension={effectiveExtension}
                onError={handleMediaError}
              />
            )}

            {previewGroup === "default" && (
              <DefaultPreview
                item={activeItem}
                file={file}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            )}
          </>
        )}
      </div>
    </dialog>
  );
}

