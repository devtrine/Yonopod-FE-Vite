import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useFavorites, useRemoveFavorite } from "@/hooks/use-favorites";
import { useSoftDeleteFile } from "@/hooks/use-files";
import { useSoftDeleteFolder } from "@/hooks/use-folders";
import { useUIStore } from "@/stores/ui-store";
import { usePreviewStore } from "@/stores/preview-store";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { Favorite } from "@/types/favorites";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function favoriteToFileItem(fav: Favorite): FileItem {
  if (fav.file) {
    return {
      id: String(fav.file.id),
      name: fav.file.name,
      extension: fav.file.extension,
      isFolder: false,
      lastModified: fav.file.updated_at
        ? new Date(fav.file.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date(fav.file.created_at || fav.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      owner: "me",
      tags: fav.file.tags || [],
      isStarred: true,
    };
  }
  if (fav.folder) {
    return {
      id: `folder-${fav.folder.id}`,
      name: fav.folder.name,
      isFolder: true,
      lastModified: new Date(fav.folder.created_at || fav.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      owner: "me",
      tags: [],
      isStarred: true,
    };
  }
  return {
    id: String(fav.id),
    name: "Unknown",
    isFolder: false,
    isStarred: true,
  };
}

type PendingDelete = { kind: "file" | "folder"; id: string; name: string };

export function FavoritesPage() {
  const navigate = useNavigate();
  const { data, isPending, isError } = useFavorites({ limit: 50 });
  const removeFavorite = useRemoveFavorite();
  const deleteFile = useSoftDeleteFile();
  const deleteFolder = useSoftDeleteFolder();
  const { openRenameModal, openDownloadDialog } = useUIStore();
  const { setActiveFiles, openPreview } = usePreviewStore();

  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [tagFileId, setTagFileId] = useState<string | null>(null);

  const favoriteByEntityId = useMemo(() => {
    const map = new Map<string, Favorite>();
    for (const fav of data?.data ?? []) {
      if (fav.file) map.set(String(fav.file.id), fav);
      if (fav.folder) map.set(`folder-${fav.folder.id}`, fav);
    }
    return map;
  }, [data]);

  const favorites: FileItem[] = (data?.data ?? []).map(favoriteToFileItem);

  useEffect(() => {
    setActiveFiles(favorites, !isPending);
  }, [data, isPending, setActiveFiles]);

  const handleUnfavorite = (item: FileItem) => {
    const fav = favoriteByEntityId.get(item.id);
    if (!fav) return;
    removeFavorite.mutate(fav.id, {
      onSuccess: () => toast("success", "Removed from favorites"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    if (item.isFolder) return;
    const fav = favoriteByEntityId.get(item.id);
    if (!fav?.file) return;
    openDownloadDialog(fav.file.id, fav.file.name);
  };

  const handleRename = (item: FileItem) => {
    const fav = favoriteByEntityId.get(item.id);
    if (!fav) return;
    if (fav.file) openRenameModal(fav.file.id, fav.file.name, false);
    else if (fav.folder) openRenameModal(fav.folder.id, fav.folder.name, true);
  };

  const handleDeleteRequest = (item: FileItem) => {
    const fav = favoriteByEntityId.get(item.id);
    if (!fav) return;
    if (fav.file) setPendingDelete({ kind: "file", id: fav.file.id, name: fav.file.name });
    else if (fav.folder) setPendingDelete({ kind: "folder", id: fav.folder.id, name: fav.folder.name });
  };

  const handleTags = (item: FileItem) => {
    if (item.isFolder) return;
    const fav = favoriteByEntityId.get(item.id);
    if (!fav?.file) return;
    setTagFileId(fav.file.id);
  };

  const handleRowClick = (item: FileItem) => {
    if (item.isFolder) {
      navigate(`/folders/${item.id.replace("folder-", "")}`);
    } else {
      openPreview(item.id);
    }
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const op =
      pendingDelete.kind === "file"
        ? deleteFile.mutateAsync(pendingDelete.id)
        : deleteFolder.mutateAsync(pendingDelete.id);

    op.then(() => {
      toast("success", pendingDelete.kind === "file" ? "File moved to trash" : "Folder moved to trash");
      setPendingDelete(null);
    }).catch((err) => {
      toast("error", getErrorMessage(err));
      setPendingDelete(null);
    });
  };

  const fileMenuActions = {
    onDownload: handleDownload,
    onFavorite: handleUnfavorite,
    onRename: handleRename,
    onTags: handleTags,
    onDelete: handleDeleteRequest,
  };

  const isDeleting = deleteFile.isPending || deleteFolder.isPending;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#0f172a]">Favorites</h1>
          </header>

          <section className="flex flex-col gap-4">
            {isPending ? (
              <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600">
                  Failed to load favorites. Please try again.
                </p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#64748b]">
                  No favorites yet. Star a file or folder to add it here.
                </p>
              </div>
            ) : (
              <FileTable
                files={favorites}
                columns={["name", "starred", "lastModified", "owner"]}
                onToggleStar={handleUnfavorite}
                onRowClick={handleRowClick}
                menuActions={fileMenuActions}
              />
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Move to trash?"
        description={`"${pendingDelete?.name ?? ""}" will be moved to trash. You can restore it later.`}
        confirmLabel="Move to Trash"
        isPending={isDeleting}
        onConfirm={confirmDelete}
      />

      {/* Tags Modal */}
      <TagPickerModal
        open={tagFileId !== null}
        fileId={tagFileId ?? ""}
        onClose={() => setTagFileId(null)}
      />
    </div>
  );
}
export default FavoritesPage;
