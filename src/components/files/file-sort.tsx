"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type SortOption = {
  id: string;
  label: string;
};

export function FileSort({
  options,
  value,
  onChange,
  align = "left",
}: {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedAlign, setComputedAlign] = useState<"left" | "right">(align);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const menuWidth = 192; // w-48
      if (rect.left + menuWidth > window.innerWidth - 16) {
        setComputedAlign("right");
      } else if (rect.right - menuWidth < 16) {
        setComputedAlign("left");
      } else {
        setComputedAlign(align);
      }
    }
  }, [isOpen, align]);

  const selectedOption = options.find((o) => o.id === value) || options[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#374151] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0F0A6B]"
      >
        {selectedOption.label}
        <ChevronDown size={14} className="text-[#64748b]" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            computedAlign === "right" ? "right-0" : "left-0"
          } mt-1 w-48 rounded-lg bg-[#FDFEFF] shadow-lg border border-[#e2e8f0] py-1 z-30 animate-in fade-in zoom-in-95 duration-100`}
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#0f172a] hover:bg-[#f1f5f9] flex items-center justify-between"
            >
              {option.label}
              {value === option.id && <Check size={14} className="text-[#0F0A6B]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
