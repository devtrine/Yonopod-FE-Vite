"use client";

import { Star } from "lucide-react";
import { FileCard } from "../files/file-card";
import type { FileItem } from "../files/file-table";

export function FavoriteFiles({
  items,
  onItemClick,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white text-center">
        <Star size={24} className="mx-auto text-[#94a3b8] mb-2" />
        <p className="text-sm font-medium text-[#0f172a]">No favorite files</p>
        <p className="text-xs text-[#64748b]">
          Star files to access them quickly here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <FileCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
