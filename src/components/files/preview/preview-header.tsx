"use client";

import { Download, X } from "lucide-react";
import { FileTypeIcon } from "../file-type-icon";
import { Button } from "../../ui/button";

interface PreviewHeaderProps {
  fileName: string;
  extension?: string;
  onDownload: () => void;
  onClose: () => void;
  downloadDisabled?: boolean;
}

export function PreviewHeader({
  fileName,
  extension,
  onDownload,
  onClose,
  downloadDisabled = false,
}: PreviewHeaderProps) {
  const fullName = extension && !fileName.endsWith(`.${extension}`)
    ? `${fileName}.${extension}`
    : fileName;

  return (
    <header className="absolute top-0 inset-x-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
      {/* File Info */}
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
          <FileTypeIcon name={fullName} isFolder={false} size={20} />
        </div>
        <div className="min-w-0">
          <h2
            className="text-sm md:text-base font-medium text-white truncate max-w-[280px] sm:max-w-md md:max-w-xl drop-shadow-sm"
            title={fullName}
          >
            {fullName}
          </h2>
          {extension && (
            <span className="text-[11px] uppercase tracking-wider text-white/60 font-mono">
              .{extension}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          onClick={onDownload}
          disabled={downloadDisabled}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all shadow-sm flex items-center gap-2 text-xs md:text-sm h-9 px-3.5 rounded-lg disabled:opacity-50"
          title="Download file"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Download</span>
        </Button>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10"
          aria-label="Close preview (Esc)"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
