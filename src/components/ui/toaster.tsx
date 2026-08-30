"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

let globalAddToast: ((toast: Omit<ToastMessage, "id">) => void) | null = null;

export function toast(type: ToastType, message: string) {
  if (globalAddToast) {
    globalAddToast({ type, message });
  }
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={16} className="text-red-400 shrink-0" />,
  warning: <AlertCircle size={16} className="text-amber-400 shrink-0" />,
  info: <Info size={16} className="text-blue-400 shrink-0" />,
};

interface ToastItemProps {
  toast: ToastMessage;
  index: number;
  total: number;
  onDismiss: (id: string) => void;
}

function StackedToastItem({
  toast: t,
  index,
  total,
  onDismiss,
}: ToastItemProps) {
  const frontIndex = total - 1 - index; // 0 = newest / front-most

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(t.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [t.id, onDismiss]);

  // Hide items deeper than 3 in stack
  if (frontIndex > 2) {
    return null;
  }

  // ReactBits fixed stacked offsets (no hover expansion)
  const translateY = -frontIndex * 9;
  const scale = 1 - frontIndex * 0.05;
  const opacity = 1 - frontIndex * 0.18;
  const zIndex = 30 - frontIndex;

  return (
    <div
      role="status"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "bottom center",
        zIndex,
        opacity,
      }}
      className="absolute bottom-0 right-0 left-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#121118]/95 text-white border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.55)] backdrop-blur-lg select-none">
        {ICONS[t.type]}
        <p className="flex-1 text-xs sm:text-sm font-medium text-neutral-100 leading-snug truncate">
          {t.message}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(t.id);
          }}
          className="flex-shrink-0 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalAddToast = ({ type, message }) => {
      const id = Math.random().toString(36).slice(2) + Date.now();
      setToasts((prev) => {
        // Keep max 5 active in memory
        const next = [...prev, { id, type, message }];
        return next.slice(-5);
      });
    };
    return () => {
      globalAddToast = null;
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 z-[9999] w-[340px] sm:w-[380px] h-[52px] pointer-events-none"
    >
      {toasts.map((t, idx) => (
        <StackedToastItem
          key={t.id}
          toast={t}
          index={idx}
          total={toasts.length}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}
