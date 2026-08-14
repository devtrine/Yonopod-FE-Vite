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
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]",
        isActive
          ? "border-[#1c3fc4] bg-[#eff1fb] text-[#1c3fc4] font-medium"
          : "border-[#e2e8f0] bg-white text-[#374151] hover:bg-[#f8fafc]",
      ].join(" ")}
    >
      {label}
      <ChevronDown
        size={14}
        className={isActive ? "text-[#1c3fc4]" : "text-[#64748b]"}
      />
    </button>
  );
}
