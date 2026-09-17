"use client";

import { X } from "lucide-react";
import type { Tag } from "../../types/tags";

const FALLBACK_COLOR = "#000000";
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function tagColorHex(color: string | null | undefined): string {
  return color && HEX_PATTERN.test(color) ? color : FALLBACK_COLOR;
}

export function tagSoftBackground(_hex?: string): string {
  return "#B3EEF6";
}

export function TagChip({
  tag,
  onRemove,
  className = "",
}: {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
}) {
  const hex = tagColorHex(tag.color);
  const dotColor = hex === "#3b82f6" || hex === "#0F0A6B" ? "#000000" : hex;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap max-w-full bg-[#B3EEF6] text-black border border-[#9ee4ee]/50",
        className,
      ].join(" ")}
    >
      <span
        className="w-1 h-1 flex-shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span className="truncate text-black">{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-black/60 hover:text-black transition-colors flex-shrink-0"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
