'use client'

import { FileGrid } from "../files/file-grid";
import type { FileItem } from "../files/file-table";

export function RecentFiles({ items }: { items: FileItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f172a]">Quick Access</h2>
        <button className="text-sm font-medium text-[#1c3fc4] hover:underline focus:outline-none">
          View All
        </button>
      </div>
      <FileGrid items={items} />
    </div>
  );
}
