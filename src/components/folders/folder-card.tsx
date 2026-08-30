import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Lock, Unlock, Edit2, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSoftDeleteFolder } from "../../hooks/use-folders";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "../../hooks/use-favorites";
import { useUIStore } from "../../stores/ui-store";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import { FileTypeIcon } from "../files/file-type-icon";
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
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const handleCardClick = () => {
    if (onClick) onClick(folder);
    else navigate(`/folders/${folder.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    deleteFolder.mutate(folder.id, {
      onSuccess: () => toast("success", "Folder moved to trash"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (favorite) {
      removeFavorite.mutate(favorite.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
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
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen(true);
      }}
      title={folder.name}
      className="group relative flex flex-col items-center justify-start w-[92px] p-1.5 rounded-lg transition-colors cursor-pointer select-none hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/30 focus:bg-blue-500/20 focus:ring-1 focus:ring-blue-500/50"
    >
      {/* Favorite badge */}
      {isFavorite && (
        <div className="absolute top-1 right-1 z-10">
          <Star size={12} className="fill-amber-400 text-amber-400" />
        </div>
      )}

      {/* Action menu trigger */}
      <div
        className="absolute top-1 left-1 z-20 flex items-center gap-1"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          aria-label="Folder options"
          className="w-5 h-5 bg-white/90 dark:bg-neutral-800/90 shadow-xs text-neutral-600 hover:text-neutral-900 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={12} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute left-0 top-6 w-44 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 py-1 z-50 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleFavorite}
              disabled={isFavoritePending}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Star
                size={13}
                className={isFavorite ? "fill-amber-400 text-amber-400" : "text-neutral-400"}
              />
              {isFavorite ? "Remove favorite" : "Add to favorites"}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleRename}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Edit2 size={13} className="text-neutral-400" />
              Rename
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleLockToggle}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {folder.is_locked ? (
                <>
                  <Unlock size={13} className="text-neutral-400" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock size={13} className="text-neutral-400" />
                  Lock
                </>
              )}
            </button>

            <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

            <button
              type="button"
              role="menuitem"
              onClick={handleDelete}
              disabled={deleteFolder.isPending}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 size={13} />
              {deleteFolder.isPending ? "Moving…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Folder Icon */}
      <div className="relative w-[54px] h-[54px] flex items-center justify-center flex-shrink-0 mt-1">
        <FileTypeIcon name={folder.name} isFolder={true} size={50} />
        {folder.is_locked && (
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-amber-500 shadow-xs">
            <Lock size={9} />
          </div>
        )}
      </div>

      {/* Folder Name Centered under Icon */}
      <p
        className="w-full text-center text-[11px] leading-tight font-medium text-neutral-800 dark:text-neutral-200 mt-1.5 px-0.5 line-clamp-2 break-words"
        style={{
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {folder.name}
      </p>
    </div>
  );
}