"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const maxWidth =
    size === "sm"
      ? "24rem"
      : size === "lg"
      ? "42rem"
      : size === "xl"
      ? "52rem"
      : "32rem";

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto w-full backdrop:bg-black/40 backdrop:backdrop-blur-sm bg-transparent p-0 rounded-xl overflow-visible outline-none"
      style={{ maxWidth }}
    >
      <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full overflow-hidden">
        {/* Header */}
        {(title || icon) && (
          <div className="flex items-start gap-3 px-6 pt-6 pb-4">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#eff1fb] flex items-center justify-center text-[#1c3fc4]">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-base font-semibold text-[#0f172a]">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-[#64748b] mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e2e8f0]">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
