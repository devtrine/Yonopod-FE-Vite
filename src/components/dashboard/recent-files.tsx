'use client'

import { FileGrid } from "../files/file-grid";
import type { FileItem } from "../files/file-table";

export function RecentFiles({
  items,
  onItemClick,
  onViewAll,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
  onViewAll?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f172a]">Quick Access</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-[#1c3fc4] hover:underline focus:outline-none cursor-pointer"
          >
            View All
          </button>
        )}
      </div>
      <FileGrid items={items} onItemClick={onItemClick} />
    </div>
  );
}
