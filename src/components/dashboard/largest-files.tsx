'use client';

import { FileGrid } from "../files/file-grid";
import type { FileItem } from "../files/file-table";

export function LargestFiles({
  items,
  onItemClick,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f172a]">Largest File</h2>
      </div>
      <FileGrid items={items} onItemClick={onItemClick} />
    </div>
  );
}
