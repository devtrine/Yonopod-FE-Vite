import { useMemo, useState, useEffect } from "react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useRecent, useClearRecentHistory } from "@/hooks/use-recent";
import { useSoftDeleteFile } from "@/hooks/use-files";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { usePreviewStore } from "@/stores/preview-store";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import { Trash2 } from "lucide-react";
import type { RecentFile } from "@/types/recent";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function recentToFileItem(recent: RecentFile): FileItem {
  return {
    id: String(recent.file.id),
    name: recent.file.name,
    extension: recent.file.extension,
    isFolder: false,
    lastModified: new Date(recent.accessed_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    owner: "me",
    tags: recent.file.tags || [],
    location: recent.file.folder?.name ?? "My Drive",
  };
}

const ITEMS_PER_PAGE = 20;

export function RecentPage() {
  const [page, setPage] = useState(1);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const [tagFileId, setTagFileId] = useState<string | null>(null);
  const { data, isPending, isError } = useRecent({ page, limit: ITEMS_PER_PAGE });
  const clearHistory = useClearRecentHistory();
  const deleteFile = useSoftDeleteFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();
  const { openRenameModal, openDownloadDialog } = useUIStore();
  const { setActiveFiles, openPreview } = usePreviewStore();

  const items: FileItem[] = (data?.data ?? []).map(recentToFileItem);
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? 0;

  useEffect(() => {
    setActiveFiles(items, !isPending);
  }, [data, isPending, setActiveFiles]);

  const recentByFileId = useMemo(() => {
    const map = new Map<string, RecentFile>();
    for (const r of data?.data ?? []) map.set(String(r.file.id), r);
    return map;
  }, [data]);

  const handleClear = () => {
    clearHistory.mutate(undefined, {
      onSuccess: () => toast("success", "Recent history cleared"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    const recent = recentByFileId.get(item.id);
    if (!recent) return;
    openDownloadDialog(recent.file.id, recent.file.name);
  };

  const handleFavorite = (item: FileItem) => {
    const recent = recentByFileId.get(item.id);
    if (!recent) return;
    const fileId = recent.file.id;
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
    const recent = recentByFileId.get(item.id);
    if (!recent) return;
    openRenameModal(recent.file.id, recent.file.name, false);
  };

  const handleDeleteRequest = (item: FileItem) => {
    const recent = recentByFileId.get(item.id);
    if (!recent) return;
    setFileToDelete({ id: recent.file.id, name: recent.file.name });
  };

  const handleTags = (item: FileItem) => {
    const recent = recentByFileId.get(item.id);
    if (!recent) return;
    setTagFileId(recent.file.id);
  };

  const handleRowClick = (item: FileItem) => {
    openPreview(item.id);
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

  const fileMenuActions = {
    onDownload: handleDownload,
    onFavorite: handleFavorite,
    onRename: handleRename,
    onTags: handleTags,
    onDelete: handleDeleteRequest,
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#0f172a]">Recent</h1>
            {items.length > 0 && (
              <button
                onClick={handleClear}
                disabled={clearHistory.isPending}
                className="flex items-center gap-2 text-sm text-[#ef4444] hover:text-[#dc2626] font-medium disabled:opacity-50"
              >
                <Trash2 size={16} />
                Clear History
              </button>
            )}
          </header>

          <section className="flex flex-col gap-4">
            {isPending ? (
              <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600">
                  Failed to load recent files. Please try again.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#64748b]">
                  No recently accessed files yet.
                </p>
              </div>
            ) : (
              <>
                <FileTable
                  files={items}
                  columns={["name", "location", "lastModified", "owner"]}
                  onRowClick={handleRowClick}
                  menuActions={fileMenuActions}
                />
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={total}
                      itemsPerPage={ITEMS_PER_PAGE}
                      itemLabel="files"
                    />
                  </div>
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
