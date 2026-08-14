"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { SearchPanel } from "./search-panel";

export function GlobalSearch({ placeholder = "Search in Drive..." }: { placeholder?: string }) {
  const [open, setOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Fake Input trigger */}
      <div className="relative flex-1 max-w-[540px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full h-9 pl-9 pr-4 flex items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-[#94a3b8] hover:border-[#cbd5e1] hover:bg-white transition-all text-left"
        >
          <Search
            size={16}
            className="absolute left-3 text-[#94a3b8] pointer-events-none"
            aria-hidden="true"
          />
          {placeholder}
        </button>
      </div>

      {/* Full Overlay Search Panel */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6 bg-[#0f172a]/40 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header / Close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-lg font-semibold text-[#0f172a]">Global Search</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content (Search Panel) */}
            <div className="p-6 overflow-y-auto">
              <SearchPanel hideTitle onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
