"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  createdAt: number;
}

type AddToastPayload = Omit<ToastMessage, "id" | "createdAt">;

let globalAddToast: ((payload: AddToastPayload) => void) | null = null;
const recentToastMap = new Map<string, number>();

/**
 * Trigger a toast notification.
 * Automatically deduplicates identical messages within 1.5s.
 */
export function toast(type: ToastType, message: string, title?: string) {
  let finalTitle = title;
  let finalMessage = message;

  // If no explicit title, extract from "Title: Message" pattern if present
  if (!finalTitle && message && message.includes(": ")) {
    const colonIdx = message.indexOf(": ");
    const candidateTitle = message.slice(0, colonIdx).trim();
    const candidateMsg = message.slice(colonIdx + 2).trim();
    if (candidateTitle.length > 0 && candidateTitle.length <= 35 && candidateMsg.length > 0) {
      finalTitle = candidateTitle;
      finalMessage = candidateMsg;
    }
  }

  // Deduplication check
  const dedupeKey = `${type}:${finalTitle || ""}:${finalMessage}`;
  const now = Date.now();
  const lastTime = recentToastMap.get(dedupeKey) || 0;
  if (now - lastTime < 1500) {
    return; // Ignore duplicate
  }
  recentToastMap.set(dedupeKey, now);

  if (globalAddToast) {
    globalAddToast({ type, message: finalMessage, title: finalTitle });
  }
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={18} className="text-rose-400 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
  info: <Info size={18} className="text-[#818cf8] shrink-0" />,
};

const BORDER_ACCENT: Record<ToastType, string> = {
  success: "border-emerald-500/30",
  error: "border-rose-500/30",
  warning: "border-amber-500/30",
  info: "border-[#3730a3]/50",
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = (id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    globalAddToast = ({ type, message, title }) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4.5 seconds
      const timer = setTimeout(() => {
        dismiss(id);
      }, 4500);
      timeoutsRef.current.set(id, timer);
    };

    return () => {
      globalAddToast = null;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  // Show up to the last 3 items in the stacked card deck
  const visibleToasts = toasts.slice(-3);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9999] pointer-events-none select-none"
    >
      <div className="relative w-[340px] sm:w-[390px] h-[66px]">
        {visibleToasts.map((t) => {
          const originalIndex = toasts.indexOf(t);
          const stackIndex = toasts.length - 1 - originalIndex; // 0 = front card, 1 = behind, 2 = furthest
          const isTop = stackIndex === 0;

          // ReactBits-style stacked card deck:
          // Negative translateY pushes the background cards upwards so their rounded top borders peek out cleanly
          const translateY = -stackIndex * 9;
          const scale = 1 - stackIndex * 0.045;
          const opacity = isTop ? 1 : stackIndex === 1 ? 0.78 : 0.45;
          const zIndex = 30 - stackIndex * 10;

          return (
            <div
              key={t.id}
              style={{
                transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                transformOrigin: "bottom center",
                opacity,
                zIndex,
                pointerEvents: isTop ? "auto" : "none",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className={`absolute inset-x-0 bottom-0 flex items-start gap-3 p-3.5 rounded-2xl bg-[#0b0e26]/95 border ${
                isTop ? BORDER_ACCENT[t.type] : "border-[#1e204a]"
              } shadow-[0_12px_32px_-4px_rgba(0,0,0,0.65),0_0_0_1px_rgba(15,10,107,0.4)] backdrop-blur-md text-white`}
            >
              {/* Type Icon */}
              <div className="mt-0.5">{ICONS[t.type]}</div>

              {/* Text Body */}
              <div className="flex-1 min-w-0 pr-1">
                {t.title ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {t.title}
                    </span>
                    <span className="text-xs text-[#cbd5e1] font-normal leading-relaxed line-clamp-1">
                      {t.message}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-[#e2e8f0] font-medium leading-relaxed line-clamp-2">
                    {t.message}
                  </div>
                )}
              </div>

              {/* Right action controls (only on front card) */}
              {isTop && (
                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  {toasts.length > 1 && (
                    <span
                      title={`${toasts.length} notifications in stack`}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0F0A6B] text-[#c7d2fe] border border-indigo-400/40 tracking-tight"
                    >
                      +{toasts.length - 1}
                    </span>
                  )}
                  <button
                    onClick={() => dismiss(t.id)}
                    className="text-[#94a3b8] hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors cursor-pointer"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Toaster;
