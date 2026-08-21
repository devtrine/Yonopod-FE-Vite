"use client";

import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePreviewStore } from "@/stores/preview-store";
import { useUIStore } from "@/stores/ui-store";
import { useFile, useCheckFileStatus } from "@/hooks/use-files";
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
  const { openDownloadDialog } = useUIStore();
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fileId = previewFileId ?? undefined;
  const { data: file, isPending: filePending, isError: fileError } = useFile(fileId);

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
    queryClient.invalidateQueries({ queryKey: ["files", fileId] });
  }, [fileId, queryClient]);

  const checkStatusUrl = file?.url?.check_status ?? null;
  const effectiveDownloadUrl = cachedUrl || file?.url?.download || null;

  const {
    data: checkStatus,
    isFetching: statusChecking,
    refetch: refetchStatus,
  } = useCheckFileStatus(fileId, checkStatusUrl);

  const isReady = checkStatus?.isUploaded === true;
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

  const handleDownload = () => {
    if (fileId && fileName) {
      openDownloadDialog(fileId, fileName);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closePreview();
    }
  };

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
        onDownload={handleDownload}
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
              />
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
