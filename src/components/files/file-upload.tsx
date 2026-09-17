"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useUIStore } from "../../stores/ui-store";

export function FileUploadButton({
  folderId = null,
  className,
  children,
}: {
  folderId?: string | null;
  className?: string;
  children?: React.ReactNode;
}) {
  const { openUploadModal } = useUIStore();

  return (
    <button
      type="button"
      onClick={() => openUploadModal(folderId)}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F0A6B] text-white text-sm font-medium hover:bg-[#161282] active:bg-[#0a0749] transition-colors shadow-sm"
      }
    >
      <Upload size={16} />
      {children || "Upload Files"}
    </button>
  );
}
