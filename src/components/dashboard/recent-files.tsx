'use client'

import { FileGrid } from "../files/file-grid";
import type { FileItem } from "../files/file-table";
import type { FileMenuActions } from "../files/file-actions-menu";

export function RecentFiles({
  items,
  onItemClick,
  onViewAll,
  menuActions,
  onToggleStar,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
  onViewAll?: () => void;
  menuActions?: FileMenuActions;
  onToggleStar?: (item: FileItem) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f172a]">Recent</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-[#0F0A6B] hover:underline focus:outline-none cursor-pointer"
          >
            View All
          </button>
        )}
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
