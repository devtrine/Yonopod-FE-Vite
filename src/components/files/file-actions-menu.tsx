"use client";

import { useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { FileContextMenu } from "./file-context-menu";
import type { FileItem } from "./file-table";
import { useDropdownPosition } from "../../hooks/use-dropdown-position";

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
  const { pos, triggerRef, menuRef } = useDropdownPosition({
    open,
    setOpen,
    menuWidth: MENU_WIDTH,
    estimatedMenuHeight: 240,
    viewportPadding: 12,
  });

  const closeThen = (fn?: (item: FileItem) => void) =>
    fn
      ? (i: FileItem) => {
        setOpen(false);
        fn(i);
      }
      : undefined;

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
              top: pos.top !== undefined ? `${pos.top}px` : undefined,
              bottom: pos.bottom !== undefined ? `${pos.bottom}px` : undefined,
              left: `${pos.left}px`,
              width: MENU_WIDTH,
              maxHeight: `${pos.maxHeight}px`,
              overflowY: "auto",
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
