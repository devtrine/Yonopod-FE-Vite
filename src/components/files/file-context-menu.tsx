import { Download, Star, Trash2, Share2, Edit2, RotateCcw, Link2, X, Tag as TagIcon } from "lucide-react";
import type { FileItem } from "./file-table";

export interface FileContextMenuProps {
  item: FileItem;
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
}

export function FileContextMenu({
  item,
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
}: FileContextMenuProps) {
  const hasPrimaryActions = onDownload || onFavorite || onRename || onShare || onCopyLink || onRestore || onTags;
  const hasDestructiveActions = onDeletePermanent || onRevoke || onDelete || onRemoveFromTag;

  return (
    <div
      role="menu"
      className="w-48 bg-white rounded-xl shadow-lg border border-[#e2e8f0] py-1.5 z-50 text-sm"
    >
      {/* Action Normal (My Drive / General) */}
      {onDownload && !item.isFolder && (
        <button
          type="button"
          onClick={() => onDownload(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <Download size={15} className="text-[#94a3b8]" />
          Download
        </button>
      )}
      {onFavorite && (
        <button
          type="button"
          onClick={() => onFavorite(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <Star size={15} className="text-[#94a3b8]" />
          {item.isStarred ? "Remove Favorite" : "Favorite"}
        </button>
      )}
      {onRename && (
        <button
          type="button"
          onClick={() => onRename(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <Edit2 size={15} className="text-[#94a3b8]" />
          Rename
        </button>
      )}
      {onShare && (
        <button
          type="button"
          onClick={() => onShare(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <Share2 size={15} className="text-[#94a3b8]" />
          Share
        </button>
      )}
      {onCopyLink && (
        <button
          type="button"
          onClick={() => onCopyLink(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <Link2 size={15} className="text-[#94a3b8]" />
          Copy Link
        </button>
      )}
      {onTags && !item.isFolder && (
        <button
          type="button"
          onClick={() => onTags(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <TagIcon size={15} className="text-[#94a3b8]" />
          Tags
        </button>
      )}

      {/* Restore (Khusus Trash) */}
      {onRestore && (
        <button
          type="button"
          onClick={() => onRestore(item)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc]"
        >
          <RotateCcw size={15} className="text-[#94a3b8]" />
          Restore
        </button>
      )}

      {/* Action Berbahaya / Destruktif */}
      {hasDestructiveActions && (
        <div className={hasPrimaryActions ? "border-t border-[#f1f5f9] my-1 pt-1" : ""}>
          {onRevoke && (
            <button
              type="button"
              onClick={() => onRevoke(item)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#ef4444] hover:bg-[#fef2f2]"
            >
              <X size={15} />
              Revoke Access
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#ef4444] hover:bg-[#fef2f2]"
            >
              <Trash2 size={15} />
              Move to Trash
            </button>
          )}
          {onDeletePermanent && (
            <button
              type="button"
              onClick={() => onDeletePermanent(item)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#ef4444] hover:bg-[#fef2f2]"
            >
              <Trash2 size={15} />
              Delete Permanently
            </button>
          )}
          {onRemoveFromTag && (
            <button
              type="button"
              onClick={() => onRemoveFromTag(item)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#ef4444] hover:bg-[#fef2f2]"
            >
              <X size={15} />
              Remove from Tag
            </button>
          )}
        </div>
      )}
    </div>
  );
}