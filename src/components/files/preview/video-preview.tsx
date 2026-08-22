"use client";

import { useState, useMemo, useEffect, memo } from "react";
import { Loader2 } from "lucide-react";

interface VideoPreviewProps {
  src: string;
  fileName: string;
  extension?: string;
  onError?: () => void;
}

function getMimeType(extension?: string): string {
  const ext = (extension || "").toLowerCase();
  switch (ext) {
    case "webm":
      return "video/webm";
    case "ogg":
    case "ogv":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    case "mkv":
      return "video/x-matroska";
    case "avi":
      return "video/x-msvideo";
    case "mp4":
    case "m4v":
    default:
      return "video/mp4";
  }
}

export const VideoPreview = memo(function VideoPreview({ src, fileName, extension, onError }: VideoPreviewProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "VIDEO_PLAYER_ERROR") {
        onError?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onError]);

  const playerUrl = useMemo(() => {
    const mime = getMimeType(extension);
    const params = new URLSearchParams({
      src,
      type: mime,
      title: fileName,
    });
    return `/video-player.html?${params.toString()}`;
  }, [src, fileName, extension]);

  return (
    <div className="relative w-full h-full max-w-5xl max-h-[82vh] flex items-center justify-center p-2 sm:p-4">
      {/* Buffer / Loading Spinner for iframe initialization */}
      {!iframeLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 mb-3">
            <Loader2 size={28} className="text-blue-400 animate-spin" />
          </div>
          <p className="text-xs text-white/60">Initializing Video Player…</p>
        </div>
      )}

      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black aspect-video flex items-center justify-center">
        <iframe
          src={playerUrl}
          title={fileName}
          onLoad={() => setIframeLoaded(true)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className={`w-full h-full border-0 transition-opacity duration-300 ${
            iframeLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
});
