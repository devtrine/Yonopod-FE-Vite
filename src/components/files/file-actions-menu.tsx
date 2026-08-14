"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { FileContextMenu } from "./file-context-menu";
import type { FileItem } from "./file-table";

export type FileMenuActions = {
  onDownload?: (item: FileItem) => void;
  onFavorite?: (item: FileItem) => void;
  onRename?: (item: FileItem) => void;
  onShare?: (item: FileItem) => void;
  onCopyLink?: (item: FileItem) => void;
  onRestore?: (item: FileItem) => void;
  onRevoke?: (item: FileItem) => void;
  onDeletePermanent?: (item: FileItem) => void;
  onTags?: (item: FileItem) => void;
  onRemoveFromTag?: (item: FileItem) => void;
  onDelete?: (item: FileItem) => void;
};

const MENU_WIDTH = 192;
const MENU_HEIGHT = 320;

export function FileActionsMenu({
  item,
  triggerClassName = "",
  portalTarget,
  onDownload,
  onFavorite,
  onRename,
  onShare,
  onCopyLink,
  onRestore,
  onRevoke,
  onDeletePermanent,
  onTags,
  onRemoveFromTag,
  onDelete,
}: {
  item: FileItem;
  triggerClassName?: string;
  /** Renders the dropdown into this container instead of document.body (e.g. inside a <dialog>). */
  portalTarget?: RefObject<HTMLElement | null>;
} & FileMenuActions) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      let top = rect.bottom + 6;
      if (top + MENU_HEIGHT > window.innerHeight) {
        top = Math.max(8, rect.top - MENU_HEIGHT - 6);
      }
      const left = Math.max(
        8,
        Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)
      );
      setPos({ top, left });
    };

    updatePos();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleScroll = () => setOpen(false);
    const handleResize = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const closeThen = (fn?: (item: FileItem) => void) => fn ? (i: FileItem) => {
    setOpen(false);
    fn(i);
  } : undefined;

  return (
    <div className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={`More options for ${item.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "w-7 h-7 flex items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors",
          open ? "opacity-100" : triggerClassName,
        ].join(" ")}
      >
        <MoreHorizontal size={16} />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: MENU_WIDTH,
              zIndex: 1000,
            }}
          >
            <FileContextMenu
              item={item}
              onDownload={closeThen(onDownload)}
              onFavorite={closeThen(onFavorite)}
              onRename={closeThen(onRename)}
              onShare={closeThen(onShare)}
              onCopyLink={closeThen(onCopyLink)}
              onRestore={closeThen(onRestore)}
              onRevoke={closeThen(onRevoke)}
              onDeletePermanent={closeThen(onDeletePermanent)}
              onTags={closeThen(onTags)}
              onRemoveFromTag={closeThen(onRemoveFromTag)}
              onDelete={closeThen(onDelete)}
            />
          </div>,
          portalTarget?.current ?? document.body
        )}
    </div>
  );
}
