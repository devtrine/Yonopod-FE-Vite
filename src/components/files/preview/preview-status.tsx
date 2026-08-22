"use client";

import { Loader2, RefreshCw, Clock } from "lucide-react";
import { Button } from "../../ui/button";

interface PreviewStatusProps {
  state: "loading" | "unready" | "error";
  onRetry?: () => void;
  isChecking?: boolean;
  message?: string;
}

export function PreviewStatus({
  state,
  onRetry,
  isChecking = false,
  message,
}: PreviewStatusProps) {
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 text-center max-w-sm">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white font-medium text-base">
            {message || "Loading file preview…"}
          </p>
          <p className="text-white/60 text-xs">
            Verifying upload status and streaming readiness
          </p>
        </div>
      </div>
    );
  }

  if (state === "unready") {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-5 text-center max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Clock size={32} className="animate-pulse" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold text-white">
            Your file is processed. Please back in minutes
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            This file is currently being processed or uploaded. Once complete, you will be able to view and download it.
          </p>
        </div>

        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            disabled={isChecking}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
            {isChecking ? "Checking Status…" : "Check Again"}
          </Button>
        )}
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-center max-w-sm bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
        <RefreshCw size={28} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-white">Preview unavailable</h4>
        <p className="text-xs text-white/70">
          {message || "Unable to check file status. Please try again or download."}
        </p>
      </div>
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          disabled={isChecking}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs px-4 py-2 rounded-lg"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
