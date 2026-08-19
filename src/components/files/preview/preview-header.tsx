"use client";

import { ArrowLeft, Download, X, Star, Loader2 } from "lucide-react";
import { FileTypeIcon } from "../file-type-icon";
import { Button } from "../../ui/button";
import { formatFileSize, formatDate } from "@/lib/formatters";

interface PreviewHeaderProps {
  fileName: string;
  extension?: string;
  fileSize?: number | null;
  lastModified?: string | null;
  isStarred?: boolean;
  onToggleStar?: () => void;
  isStarPending?: boolean;
  onDownload: () => void;
  onClose: () => void;
  downloadDisabled?: boolean;
  isDownloading?: boolean;
}

export function PreviewHeader({
  fileName,
  extension,
  fileSize,
  lastModified,
  isStarred,
  onToggleStar,
  isStarPending = false,
  onDownload,
  onClose,
  downloadDisabled = false,
  isDownloading = false,
}: PreviewHeaderProps) {
  const fullName = extension && !fileName.endsWith(`.${extension}`)
    ? `${fileName}.${extension}`
    : fileName;

  return (
    <header
      className="absolute top-0 inset-x-0 z-30 h-16 sm:h-18 px-3 sm:px-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Section: Back button, File Icon, File Info, Star & Metadata in one unified place */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-4">
        {/* Google Drive Back Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors shrink-0"
          aria-label="Back to files (Esc)"
          title="Back (Esc)"
        >
          <ArrowLeft size={20} />
        </button>

        {/* File Type Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FileTypeIcon name={fullName} isFolder={false} size={18} />
        </div>

        {/* File Details & Star & Metadata */}
        <div className="min-w-0 flex flex-col justify-center">
          {/* File Name & Star Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <h2
              className="text-sm sm:text-base font-semibold text-white truncate max-w-[160px] xs:max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-xl drop-shadow-sm"
              title={fullName}
            >
              {fullName}
            </h2>

            {onToggleStar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
                disabled={isStarPending}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 shrink-0"
                title={isStarred ? "Remove from starred" : "Add to starred"}
                aria-label={isStarred ? "Remove from starred" : "Add to starred"}
              >
                {isStarPending ? (
                  <Loader2 size={15} className="animate-spin text-amber-400" />
                ) : (
                  <Star
                    size={16}
                    className={
                      isStarred
                        ? "fill-amber-400 text-amber-400 drop-shadow"
                        : "text-white/60 hover:text-amber-400 transition-colors"
                    }
                  />
                )}
              </button>
            )}
          </div>

          {/* Metadata Subtitle: Extension, File Size, Last Modified */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-white/70 font-mono flex-wrap">
            {extension && (
              <span className="uppercase tracking-wider font-semibold text-white/80">
                .{extension}
              </span>
            )}
            {fileSize !== null && fileSize !== undefined && (
              <>
                <span className="text-white/40">•</span>
                <span>{formatFileSize(Number(fileSize))}</span>
              </>
            )}
            {lastModified && (
              <>
                <span className="text-white/40">•</span>
                <span className="truncate">Modified {formatDate(lastModified)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          disabled={downloadDisabled || isDownloading}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all shadow-sm flex items-center gap-2 text-xs md:text-sm h-9 px-3.5 rounded-lg disabled:opacity-50"
          title={isDownloading ? "Downloading file…" : "Download file"}
        >
          {isDownloading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Download size={15} />
          )}
          <span className="hidden sm:inline">{isDownloading ? "Downloading…" : "Download"}</span>
        </Button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-9 h-9 rounded-full hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 hidden sm:flex"
          aria-label="Close preview (Esc)"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
