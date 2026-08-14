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
}: {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedOption = options.find((o) => o.id === value) || options[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#374151] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]"
      >
        {selectedOption.label}
        <ChevronDown size={14} className="text-[#64748b]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white shadow-lg border border-[#e2e8f0] py-1 z-10">
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
              {value === option.id && <Check size={14} className="text-[#1c3fc4]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
