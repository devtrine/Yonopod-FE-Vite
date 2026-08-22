"use client";

import { Download, Loader2 } from "lucide-react";
import { FileTypeIcon } from "../file-type-icon";
import { Button } from "../../ui/button";
import { formatFileSize, formatDate } from "@/lib/formatters";
import type { FileItem } from "../file-table";
import type { FileDetail } from "@/types/file";

interface DefaultPreviewProps {
  item: FileItem;
  file?: FileDetail | null;
  onDownload: () => void;
  disabled?: boolean;
  isDownloading?: boolean;
}

export function DefaultPreview({
  item,
  file,
  onDownload,
  disabled = false,
  isDownloading = false,
}: DefaultPreviewProps) {
  const extension = file?.extension || item.extension || "";
  const fullName = extension && !item.name.endsWith(`.${extension}`)
    ? `${item.name}.${extension}`
    : item.name;

  const fileSize = file?.size ?? (typeof item.size === "number" ? item.size : null);
  const lastModified = file?.updated_at || file?.created_at || item.lastModified;

  return (
    <div
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-lg w-full bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* File Icon */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-inner">
        <FileTypeIcon name={fullName} isFolder={false} size={56} />
      </div>

      {/* File Title & Info */}
      <h3
        className="text-lg sm:text-xl font-semibold text-white truncate max-w-full px-4 mb-1.5"
        title={fullName}
      >
        {fullName}
      </h3>
      
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-white/60 mb-8 font-mono">
        <span>{extension ? `.${extension.toUpperCase()} File` : "Document"}</span>
        {fileSize !== null && <span>• {formatFileSize(Number(fileSize))}</span>}
        {lastModified && <span>• Modified {formatDate(lastModified)}</span>}
      </div>

      <p className="text-xs text-white/50 mb-6 max-w-xs leading-relaxed">
        No interactive preview is available for this file format. You can download the file to view it on your device.
      </p>

      {/* Prominent Download Button */}
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        disabled={disabled || isDownloading}
        className="w-full sm:w-auto min-w-[200px] h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        {isDownloading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Downloading…
          </>
        ) : (
          <>
            <Download size={18} />
            Download File
          </>
        )}
      </Button>
    </div>
  );
}
