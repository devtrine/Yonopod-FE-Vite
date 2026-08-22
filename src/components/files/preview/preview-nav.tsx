"use client";

import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewNavProps {
  onPrev: () => void;
  onNext: () => void;
  hasMultiple: boolean;
}

export const PreviewNav = memo(function PreviewNav({ onPrev, onNext, hasMultiple }: PreviewNavProps) {
  if (!hasMultiple) return null;

  return (
    <>
      {/* Previous Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg hover:scale-105 active:scale-95"
        aria-label="Previous file (Left Arrow)"
        title="Previous file (Left Arrow)"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg hover:scale-105 active:scale-95"
        aria-label="Next file (Right Arrow)"
        title="Next file (Right Arrow)"
      >
        <ChevronRight size={24} />
      </button>
    </>
  );
});
