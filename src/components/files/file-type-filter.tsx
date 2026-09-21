"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const FILTER_OPTIONS = [
  { id: "", label: "All Files" },
  { id: "pdf", label: "PDF" },
  { id: "doc", label: "DOC" },
  { id: "docx", label: "DOCX" },
  { id: "xls", label: "XLS" },
  { id: "xlsx", label: "XLSX" },
  { id: "csv", label: "CSV" },
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
  { id: "jpeg", label: "JPEG" },
  { id: "gif", label: "GIF" },
  { id: "webp", label: "WEBP" },
  { id: "mp4", label: "MP4" },
  { id: "mov", label: "MOV" },
  { id: "zip", label: "ZIP" },
  { id: "rar", label: "RAR" },
];

export function FileTypeFilter({
  value,
  onChange,
  align = "left",
}: {
  value: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedAlign, setComputedAlign] = useState<"left" | "right">(align);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const menuWidth = 180;
      if (rect.left + menuWidth > window.innerWidth - 16) {
        setComputedAlign("right");
      } else if (rect.right - menuWidth < 16) {
        setComputedAlign("left");
      } else {
        setComputedAlign(align);
      }
    }
  }, [isOpen, align]);

  const selected =
    FILTER_OPTIONS.find((o) => o.id === value) ?? FILTER_OPTIONS[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F0A6B]",
          value
            ? "border-[#0F0A6B] bg-[#0F0A6B] text-white font-medium"
            : "border-[#e2e8f0] bg-white text-[#374151] hover:bg-[#f8fafc]",
        ].join(" ")}
      >
        <span>{selected.label}</span>
        <ChevronDown size={14} className={value ? "text-white" : "text-[#64748b]"} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            computedAlign === "right" ? "right-0" : "left-0"
          } mt-1 max-h-80 overflow-y-auto rounded-lg bg-[#FDFEFF] shadow-lg border border-[#e2e8f0] py-1 z-30 animate-in fade-in zoom-in-95 duration-100`}
        >
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.id || "all"}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#0f172a] hover:bg-[#f1f5f9] flex items-center justify-between gap-6"
            >
              <span>{option.label}</span>
              {value === option.id && <Check size={14} className="text-[#0F0A6B]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
