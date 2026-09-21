import { useState } from "react";
import { createPortal } from "react-dom";
import { Folder as FolderIcon, MoreHorizontal, Lock, Unlock, Edit2, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSoftDeleteFolder } from "../../hooks/use-folders";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "../../hooks/use-favorites";
import { useUIStore } from "../../stores/ui-store";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import { getFolderFormattedSize, type Folder } from "../../types/folder";
import { useDropdownPosition } from "../../hooks/use-dropdown-position";

import { useQueryClient } from "@tanstack/react-query";
import * as fileService from "../../services/file.service";

export function FolderCard({
  folder,
  onClick,
}: {
  folder: Folder;
  onClick?: (folder: Folder) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteFolder = useSoftDeleteFolder();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { folderMap } = useFavoriteMaps();
  const { openRenameModal, openLockModal, openUploadModal } = useUIStore();

  const [isDragOver, setIsDragOver] = useState(false);

  const favorite = folderMap.get(folder.id);
  const isFavorite = Boolean(favorite);

  const [menuOpen, setMenuOpen] = useState(false);
  const { pos, triggerRef, menuRef } = useDropdownPosition({
    open: menuOpen,
    setOpen: setMenuOpen,
    menuWidth: 192,
    estimatedMenuHeight: 180,
    viewportPadding: 12,
  });

  const handleCardClick = () => {
    if (onClick) {
      onClick(folder);
    } else {
      navigate(`/folders/${folder.id}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types || []);
    if (types.includes("Files") || types.includes("application/yonopod-file-id")) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const types = Array.from(e.dataTransfer.types || []);

    // Drop file dari desktop OS
    if (types.includes("Files") && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      openUploadModal(folder.id, files);
      return;
    }

    // Drop file internal Yonopod (Move)
    if (types.includes("application/yonopod-file-id")) {
      const fileId = e.dataTransfer.getData("application/yonopod-file-id");
      const fileName = e.dataTransfer.getData("application/yonopod-file-name") || "file";
      if (!fileId) return;

      try {
        await fileService.updateFile(fileId, { folder_id: folder.id });
        queryClient.invalidateQueries({ queryKey: ["files"] });
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        queryClient.invalidateQueries({ queryKey: ["recent"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
        toast("success", `Moved "${fileName}" to ${folder.name}`);
      } catch (err) {
        toast("error", getErrorMessage(err));
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    deleteFolder.mutate(folder.id, {
      onSuccess: () => toast("success", "Folder moved to trash"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  // Handler toggle Favorite
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);

    if (favorite) {
      // Jika sudah favorit -> panggil removeFavorite dengan favorite.id
      removeFavorite.mutate(favorite.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
      // Jika belum favorit -> panggil addFavorite dengan payload { folder_id }
      addFavorite.mutate(
        { folder_id: folder.id },
        {
          onSuccess: () => toast("success", "Added to favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    openRenameModal(folder.id, folder.name, true);
  };

  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    openLockModal(folder.id, folder.name, folder.is_locked);
  };

  const isFavoritePending = addFavorite.isPending || removeFavorite.isPending;

  return (
    <div
      onClick={handleCardClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "group relative flex flex-col p-3.5 sm:p-5 border transition-all cursor-pointer",
        isDragOver
          ? "border-2 border-[#0F0A6B] bg-[#0F0A6B]/5 shadow-md scale-[1.02]"
          : "border-[#e2e8f0] bg-[#FDFEFF] hover:border-[#cbd5e1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
      ].join(" ")}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-10 pointer-events-none rounded-sm border-2 border-dashed border-[#0F0A6B] bg-[#0F0A6B]/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#0F0A6B] bg-white px-2.5 py-1 rounded-full shadow-sm">
            Drop to move / upload here
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2.5 sm:mb-4">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[#0F0A6B]/10 text-[#0F0A6B]">
          <FolderIcon size={22} className="fill-[#0F0A6B]/20 sm:w-6 sm:h-6" />
          {folder.is_locked && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-[#f59e0b] shadow-xs">
              <Lock size={11} />
            </div>
          )}
        </div>

        {/* Action / More Menu */}
        <div className="flex items-center gap-1">
          {/* Tampilkan indikator bintang jika folder ini favorit */}
          {isFavorite && (
            <button
              type="button"
              onClick={handleFavorite}
              disabled={isFavoritePending}
              title="Remove from favorites"
              className="p-1 text-[#f59e0b] hover:scale-110 transition-transform disabled:opacity-50"
            >
              <Star size={16} className="fill-[#f59e0b]" />
            </button>
          )}

          <button
            ref={triggerRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Folder options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-all -mr-1 -mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen &&
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
                  width: 192,
                  maxHeight: `${pos.maxHeight}px`,
                  overflowY: "auto",
                  zIndex: 1000,
                }}
                className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e2e8f0] py-1.5 text-sm animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Menu Favorite */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleFavorite}
                  disabled={isFavoritePending}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors disabled:opacity-50"
                >
                  <Star
                    size={15}
                    className={
                      isFavorite
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-[#94a3b8]"
                    }
                  />
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleRename}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
                >
                  <Edit2 size={15} className="text-[#94a3b8]" />
                  Rename
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLockToggle}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
                >
                  {folder.is_locked ? (
                    <>
                      <Unlock size={15} className="text-[#94a3b8]" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock size={15} className="text-[#94a3b8]" />
                      Lock
                    </>
                  )}
                </button>

                <div className="border-t border-[#f1f5f9] my-1 pt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleDelete}
                    disabled={deleteFolder.isPending}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[#ef4444] hover:bg-[#fef2f2] transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deleteFolder.isPending ? "Moving…" : "Move to Trash"}
                  </button>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>

      <div className="mt-auto">
        <h3
          className="text-sm font-semibold text-[#0f172a] mb-1 truncate"
          title={folder.name}
        >
          {folder.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <span>
            {new Date(folder.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {getFolderFormattedSize(folder) && (
            <>
              <span>•</span>
              <span className="font-medium text-[#475569]">
                {getFolderFormattedSize(folder)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}