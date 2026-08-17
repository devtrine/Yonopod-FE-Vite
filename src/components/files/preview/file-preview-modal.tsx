"use client";

import { useEffect, useMemo, useCallback } from "react";
import { usePreviewStore } from "@/stores/preview-store";
import { useUIStore } from "@/stores/ui-store";
import { useFile, useCheckFileStatus } from "@/hooks/use-files";
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

  const activeItem: FileItem | undefined = useMemo(() => {
    if (!previewFileId) return undefined;
    return activeFiles.find(
      (f) => !f.isFolder && String(f.id) === String(previewFileId)
    );
  }, [previewFileId, activeFiles]);

  const fileId = activeItem?.id;
  const { data: file, isPending: filePending, isError: fileError } = useFile(fileId);

  const checkStatusUrl = file?.url?.check_status ?? null;
  const downloadUrl = file?.url?.download ?? null;

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

  if (!previewFileId || !activeItem) return null;

  const effectiveExtension = file?.extension || activeItem.extension || "";
  const previewGroup = getPreviewGroup(effectiveExtension);

  const handleDownload = () => {
    openDownloadDialog(activeItem.id, activeItem.name);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={closePreview}
    >
      {/* Top Header */}
      <PreviewHeader
        fileName={activeItem.name}
        extension={effectiveExtension}
        onDownload={handleDownload}
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
        {filePending || statusChecking ? (
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
        ) : !downloadUrl ? (
          <PreviewStatus
            state="unready"
            onRetry={() => refetchStatus()}
            isChecking={statusChecking}
          />
        ) : (
          <>
            {previewGroup === "image" && (
              <ImagePreview
                src={downloadUrl}
                fileName={activeItem.name}
                extension={effectiveExtension}
              />
            )}

            {previewGroup === "audio" && (
              <AudioPreview
                src={downloadUrl}
                fileName={activeItem.name}
                extension={effectiveExtension}
              />
            )}

            {previewGroup === "video" && (
              <VideoPreview
                src={downloadUrl}
                fileName={activeItem.name}
                extension={effectiveExtension}
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
    </div>
  );
}
