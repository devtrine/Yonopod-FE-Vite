"use client";

import { LayoutList, LayoutGrid } from "lucide-react";

export function FileActions({
  viewMode,
  onViewModeChange,
}: {
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border border-[#e2e8f0] bg-white">
      <button
        onClick={() => onViewModeChange("list")}
        aria-label="List view"
        className={[
          "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
          viewMode === "list"
            ? "bg-[#eff1fb] text-[#1c3fc4]"
            : "text-[#64748b] hover:bg-[#f1f5f9]",
        ].join(" ")}
      >
        <LayoutList size={16} />
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view"
        className={[
          "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
          viewMode === "grid"
            ? "bg-[#eff1fb] text-[#1c3fc4]"
            : "text-[#64748b] hover:bg-[#f1f5f9]",
        ].join(" ")}
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  );
}
