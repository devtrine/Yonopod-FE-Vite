"use client";

import { X } from "lucide-react";
import type { Tag } from "../../types/tags";

const FALLBACK_COLOR = "#3b82f6";
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function tagColorHex(color: string | null | undefined): string {
  return color && HEX_PATTERN.test(color) ? color : FALLBACK_COLOR;
}

export function tagSoftBackground(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
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

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap max-w-full",
        className,
      ].join(" ")}
      style={{ backgroundColor: tagSoftBackground(hex), color: hex }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <span className="truncate">{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
