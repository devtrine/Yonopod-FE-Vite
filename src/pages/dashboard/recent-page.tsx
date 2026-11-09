import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { FileGrid } from "@/components/files/file-grid";
import { FileActions } from "@/components/files/file-actions";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useRecentFiles, useSoftDeleteFile } from "@/hooks/use-files";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { usePreviewStore } from "@/stores/preview-store";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { File as ApiFile } from "@/types/file";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function fileToFileItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    extension: file.extension,
    isFolder: false,
    lastModified: file.updated_at
      ? new Date(file.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : file.created_at
      ? new Date(file.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    rawDate: file.updated_at || file.created_at,
    owner: "me",
    tags: file.tags || [],
    location: file.folder?.name ?? "My Drive",
    isStarred: Boolean(file.is_favorite),
  };
}

const ITEMS_PER_PAGE = 25;

export function RecentPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const [tagFileId, setTagFileId] = useState<string | null>(null);

  const { data, isPending, isError } = useRecentFiles({
    limit: ITEMS_PER_PAGE,
  });

  const deleteFile = useSoftDeleteFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();
  const { openRenameModal, openDownloadDialog, openMoveModal } = useUIStore();
  const { setActiveFiles, openPreview } = usePreviewStore();

  const items: FileItem[] = useMemo(() => {
    return (data?.data ?? []).map((file) => {
      const item = fileToFileItem(file);
      return {
        ...item,
        isStarred: fileMap.has(item.id) || item.isStarred,
      };
    });
  }, [data?.data, fileMap]);

  useEffect(() => {
    setActiveFiles(items, !isPending);
  }, [items, isPending, setActiveFiles]);

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    openDownloadDialog(item.id, item.name);
  };

  const handleFavorite = (item: FileItem) => {
    const fileId = item.id;
    const favorite = fileMap.get(fileId);
    if (favorite) {
      removeFavorite.mutate(favorite.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
      addFavorite.mutate(
        { file_id: fileId },
        {
          onSuccess: () => toast("success", "Added to favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const handleRename = (item: FileItem) => {
    openRenameModal(item.id, item.name, false);
  };

  const handleDeleteRequest = (item: FileItem) => {
    setFileToDelete({ id: item.id, name: item.name });
  };

  const handleTags = (item: FileItem) => {
    setTagFileId(item.id);
  };

  const handleRowClick = (item: FileItem) => {
    if (item.isFolder) {
      const folderId = item.id.replace("folder-", "");
      navigate(`/folders/${folderId}`);
    } else {
      setActiveFiles(items, false);
      openPreview(item.id);
    }
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    deleteFile.mutate(fileToDelete.id, {
      onSuccess: () => {
        toast("success", "File moved to trash");
        setFileToDelete(null);
      },
      onError: (err) => {
        toast("error", getErrorMessage(err));
        setFileToDelete(null);
      },
    });
  };

  const handleMove = (item: FileItem) => {
    openMoveModal(item.id, item.name);
  };

  const fileMenuActions: FileMenuActions = {
    onDownload: handleDownload,
    onFavorite: handleFavorite,
    onRename: handleRename,
    onMove: handleMove,
    onTags: handleTags,
    onDelete: handleDeleteRequest,
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">Recent</h1>
              <p className="text-sm text-[#64748b] mt-1">
                Recently uploaded and modified files
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FileActions viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </header>

          <section className="flex flex-col gap-4">
            {isPending ? (
              viewMode === "list" ? (
                <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-[#f1f5f9] animate-pulse" />
                  ))}
                </div>
              )
            ) : isError ? (
              <div className="py-8 text-center bg-white rounded-xl border border-[#e2e8f0] p-6">
                <p className="text-sm text-red-600">
                  Failed to load recent files. Please try again.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0] p-8">
                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
                  <Clock size={24} />
                </div>
                <h3 className="text-base font-semibold text-[#0f172a] mb-1">No recent files yet</h3>
                <p className="text-sm text-[#64748b]">
                  Files you upload or edit will appear here.
                </p>
              </div>
            ) : (
              <>
                {viewMode === "list" ? (
                  <FileTable
                    files={items}
                    columns={["name", "starred", "location", "lastModified", "owner"]}
                    onToggleStar={handleFavorite}
                    onRowClick={handleRowClick}
                    menuActions={fileMenuActions}
                  />
                ) : (
                  <FileGrid
                    items={items}
                    onItemClick={handleRowClick}
                    onToggleStar={handleFavorite}
                    menuActions={fileMenuActions}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        title="Move file to trash?"
        description={`"${fileToDelete?.name ?? ""}" will be moved to trash. You can restore it later.`}
        confirmLabel="Move to Trash"
        isPending={deleteFile.isPending}
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
export default RecentPage;
