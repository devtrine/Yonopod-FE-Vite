"use client";

import { FilePreviewModal } from "./preview/file-preview-modal";
import type { FileItem } from "./file-table";
import { useEffect } from "react";
import { previewStore } from "@/stores/preview-store";

export { FilePreviewModal };

/**
 * Backward compatibility wrapper for FilePreview.
 * Directly activates preview in previewStore or renders the FilePreviewModal.
 */
export function FilePreview({
  item,
}: {
  item: FileItem | null;
  onClose?: () => void;
}) {
  useEffect(() => {
    if (item && !item.isFolder) {
      previewStore.openPreview(item.id);
    }
  }, [item]);

  return <FilePreviewModal />;
}

export default FilePreview;
