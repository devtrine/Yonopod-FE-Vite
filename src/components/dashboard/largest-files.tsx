'use client';

import { FileGrid } from "../files/file-grid";
import type { FileItem } from "../files/file-table";
import type { FileMenuActions } from "../files/file-actions-menu";

export function LargestFiles({
  items,
  onItemClick,
  menuActions,
  onToggleStar,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
  menuActions?: FileMenuActions;
  onToggleStar?: (item: FileItem) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f172a]">Largest File</h2>
      </div>
      <FileGrid
        items={items}
        onItemClick={onItemClick}
        menuActions={menuActions}
        onToggleStar={onToggleStar}
      />
    </div>
  );
}
