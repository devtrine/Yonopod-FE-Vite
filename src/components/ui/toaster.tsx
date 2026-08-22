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
  success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={18} className="text-red-400 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
  info: <Info size={18} className="text-blue-400 shrink-0" />,
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(t.id), 4000);
    return () => clearTimeout(timer);
  }, [t.id, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl bg-[#202124]/95 text-white border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md text-sm animate-in slide-in-from-bottom-3 sm:slide-in-from-left-4 fade-in duration-200 min-h-[44px]"
    >
      {ICONS[t.type]}
      <span className="flex-1 text-xs sm:text-sm text-neutral-100 font-medium leading-tight">
        {t.message}
      </span>
      <button
        onClick={() => onDismiss(t.id)}
        className="flex-shrink-0 text-neutral-400 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalAddToast = ({ type, message }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, message }]);
    };
    return () => {
      globalAddToast = null;
    };
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9999] flex flex-col gap-2 w-auto max-w-[calc(100vw-2.5rem)] sm:max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
