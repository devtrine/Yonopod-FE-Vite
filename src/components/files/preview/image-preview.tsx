"use client";

import { useState, memo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, AlertCircle } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  fileName: string;
  extension?: string;
  onError?: () => void;
}

export const ImagePreview = memo(function ImagePreview({ src, fileName, onError }: ImagePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none p-4 md:p-12">
      {/* Buffer / Image Loader */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <p className="text-xs text-white/60">Buffering image…</p>
        </div>
      )}

      {/* Error Fallback */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl">
          <AlertCircle size={36} className="text-red-400 mb-3" />
          <h4 className="text-base font-semibold text-white">Failed to load image</h4>
          <p className="text-xs text-white/60 mt-1">
            The image could not be displayed or the format is corrupted.
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center overflow-auto">
          <img
            src={src}
            alt={fileName}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
              onError?.();
            }}
            style={{ transform: `scale(${scale})` }}
            className={`max-w-full max-h-[82vh] object-contain transition-all duration-200 rounded shadow-2xl drop-shadow-2xl ${
              loading ? "opacity-0 scale-95" : "opacity-100"
            }`}
          />
        </div>
      )}

      {/* Floating Zoom Toolbar */}
      {!loading && !error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 shadow-xl transition-all">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs text-white/80 font-mono px-1.5 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          {scale !== 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors ml-1 border-l border-white/15 pl-1"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});
