import { useState, useRef, useEffect } from "react";
import { Folder as FolderIcon, MoreHorizontal, Lock, Unlock, Edit2, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSoftDeleteFolder } from "../../hooks/use-folders";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "../../hooks/use-favorites";
import { useUIStore } from "../../stores/ui-store";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import type { Folder } from "../../types/folder";

export function FolderCard({
  folder,
  onClick,
}: {
  folder: Folder;
  onClick?: (folder: Folder) => void;
}) {
  const navigate = useNavigate();
  const deleteFolder = useSoftDeleteFolder();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { folderMap } = useFavoriteMaps();
  const { openRenameModal, openLockModal } = useUIStore();

  const favorite = folderMap.get(folder.id);
  const isFavorite = Boolean(favorite);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(folder);
    } else {
      navigate(`/folders/${folder.id}`);
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
      className="group relative flex flex-col p-5 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-[#eff1fb] text-[#1c3fc4]">
          <FolderIcon size={24} className="fill-[#eff1fb]" />
          {folder.is_locked && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-[#f59e0b] shadow-xs">
              <Lock size={11} />
            </div>
          )}
        </div>

        {/* Action / More Menu */}
        <div className="flex items-center gap-1" ref={menuRef}>
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Folder options"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-all -mr-1 -mt-1 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-9 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e2e8f0] py-1.5 z-50 text-sm"
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
            </div>
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
        <p className="text-xs text-[#64748b] truncate">
          {new Date(folder.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}