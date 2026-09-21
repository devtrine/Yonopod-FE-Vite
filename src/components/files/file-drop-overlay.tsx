"use client";

import { Upload } from "lucide-react";

export function FileDropOverlay({
  isDragging,
  folderName = "My Drive",
}: {
  isDragging: boolean;
  folderName?: string;
}) {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-6 bg-[#0F0A6B]/20 backdrop-blur-xs transition-all duration-200">
      <div className="w-full h-full max-w-4xl max-h-[80vh] border-3 border-dashed border-[#0F0A6B] rounded-3xl flex flex-col items-center justify-center p-8 bg-white/90 shadow-2xl gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-20 h-20 rounded-3xl bg-[#0F0A6B]/10 flex items-center justify-center text-[#0F0A6B] shadow-inner animate-bounce">
          <Upload size={40} className="stroke-[2.2]" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#0f172a]">
            Drop files to upload
          </h3>
          <p className="text-sm text-[#64748b] mt-1.5 font-medium">
            Release your files to start uploading directly to{" "}
            <span className="text-[#0F0A6B] font-semibold">{folderName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
