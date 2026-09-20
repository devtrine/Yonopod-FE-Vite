"use client";

import { ChevronDown } from "lucide-react";

export function FileFilter({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F0A6B]",
        isActive
          ? "border-[#0F0A6B] bg-[#0F0A6B] text-white font-medium"
          : "border-[#e2e8f0] bg-white text-[#374151] hover:bg-[#f8fafc]",
      ].join(" ")}
    >
      {label}
      <ChevronDown
        size={14}
        className={isActive ? "text-white" : "text-[#64748b]"}
      />
    </button>
  );
}
