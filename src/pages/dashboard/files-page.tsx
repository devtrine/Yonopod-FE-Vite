import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Upload, Folder as FolderIcon, FileText, Star, Trash2, X } from "lucide-react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { FileGrid } from "@/components/files/file-grid";
import { FileSort } from "@/components/files/file-sort";
import { FileActions } from "@/components/files/file-actions";
import { FileTypeFilter } from "@/components/files/file-type-filter";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { FolderCard } from "@/components/folders/folder-card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Button } from "@/components/ui/button";
import { useFiles, useSoftDeleteFile } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { usePreviewStore } from "@/stores/preview-store";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { File as ApiFile } from "@/types/file";
import type { Folder } from "@/types/folder";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function fileToFileItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    lastModified: file.updated_at
      ? new Date(file.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : new Date(file.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    owner: "me",
    extension: file.extension,
    tags: file.tags || [],
    isStarred: file.is_favorite,
  };
}

const sortOptions = [
  { id: "created_at", label: "Last Modified" },
  { id: "name", label: "Name" },
];

export function FilesPage() {
  const navigate = useNavigate();
  const { openCreateFolderModal, openUploadModal, openRenameModal, openDownloadDialog } = useUIStore();
  const { setActiveFiles, openPreview } = usePreviewStore();

  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortBy, setSortBy] = useState("created_at");
  const [typeFilter, setTypeFilter] = useState("");
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [tagFileId, setTagFileId] = useState<string | null>(null);

  const { data: filesData, isPending: filesLoading } = useFiles({
    sort_by: sortBy as "name" | "created_at",
    order: "DESC",
    limit: 50,
    extension: typeFilter || undefined,
  });
  const { data: foldersData, isPending: foldersLoading } = useFolders({ limit: 50 });

  const deleteFile = useSoftDeleteFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();

  const files: FileItem[] = (filesData?.data ?? []).map(fileToFileItem);
  const folders: Folder[] = foldersData?.data ?? [];

  const isLoading = filesLoading || foldersLoading;

  // Register files in active list store for in-memory preview validation & hash sync
  useEffect(() => {
    setActiveFiles(files, !filesLoading);
  }, [filesData, filesLoading, setActiveFiles]);

  const handleItemClick = (item: FileItem) => {
    if (item.isFolder) {
      const folderId = item.id.replace("folder-", "");
      navigate(`/folders/${folderId}`);
    } else {
      openPreview(item.id);
    }
  };

  const handleToggleStar = (item: FileItem) => {
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
    if (item.isFolder) return;
    openRenameModal(item.id, item.name, false);
  };

  const handleDeleteRequest = (item: FileItem) => {
    if (item.isFolder) return;
    setFileToDelete(item);
  };

  const handleTags = (item: FileItem) => {
    if (item.isFolder) return;
    setTagFileId(item.id);
  };

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    if (item.isFolder) return;
    openDownloadDialog(item.id, item.name);
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
    onFavorite: handleToggleStar,
    onRename: handleRename,
    onTags: handleTags,
    onDelete: handleDeleteRequest,
  };

  const activeSelectedIds = selectedIds.filter((id) =>
    files.some((f) => f.id === id)
  );
  const isAllSelected =
    files.length > 0 && activeSelectedIds.length === files.length;

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(files.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkFavorite = () => {
    activeSelectedIds.forEach((id) => {
      const item = files.find((f) => f.id === id);
      if (item && !item.isStarred) {
        addFavorite.mutate(
          { file_id: item.id },
          {
            onError: (err) => toast("error", getErrorMessage(err)),
          }
        );
      }
    });
    toast("success", `Added ${activeSelectedIds.length} item(s) to favorites`);
    setSelectedIds([]);
  };

  const confirmBulkDeleteAction = () => {
    if (activeSelectedIds.length === 0) return;
    const promises = activeSelectedIds.map((id) =>
      deleteFile.mutateAsync(id)
    );

    Promise.all(promises)
      .then(() => {
        toast("success", `${activeSelectedIds.length} file(s) moved to trash`);
        setSelectedIds([]);
        setConfirmBulkDelete(false);
      })
      .catch((err) => {
        toast("error", getErrorMessage(err));
        setConfirmBulkDelete(false);
      });
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#0f172a]">My Drive</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => openCreateFolderModal(null)}
                className="flex items-center gap-2 h-9 px-3.5 text-sm"
              >
                <FolderPlus size={16} />
                <span>New Folder</span>
              </Button>

              <Button
                onClick={() => openUploadModal(null)}
                className="flex items-center gap-2 h-9 px-3.5 text-sm bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
              >
                <Upload size={16} />
                <span>Upload File</span>
              </Button>

              <div className="h-6 w-px bg-[#e2e8f0] mx-1 hidden sm:block" />

              <FileTypeFilter value={typeFilter} onChange={setTypeFilter} />
              <FileSort options={sortOptions} value={sortBy} onChange={setSortBy} />
              <FileActions viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </header>

          {activeSelectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-[#eff1fb] border border-[#1c3fc4] rounded-lg p-3 px-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-[#1c3fc4] hover:bg-[#dce5ff] p-1 rounded-md transition-colors"
                  aria-label="Clear selection"
                >
                  <X size={16} />
                </button>
                <span className="text-sm font-medium text-[#1c3fc4]">
                  {activeSelectedIds.length} item(s) selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white flex items-center gap-1.5"
                  onClick={handleBulkFavorite}
                >
                  <Star size={14} />
                  Favorite
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={() => setConfirmBulkDelete(true)}
                >
                  <Trash2 size={14} />
                  Trash
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-8">
              <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Folders</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-[#f1f5f9] animate-pulse" />
                  ))}
                </div>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Files</h2>
                <div className="h-48 rounded-2xl bg-[#f1f5f9] animate-pulse" />
              </section>
            </div>
          ) : folders.length === 0 && files.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mx-auto mb-4">
                <FolderIcon size={32} />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a] mb-2">Your drive is empty</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Create a folder or upload your first file to start organizing your storage.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => openCreateFolderModal(null)}
                  className="flex items-center gap-2"
                >
                  <FolderPlus size={16} />
                  New Folder
                </Button>
                <Button
                  onClick={() => openUploadModal(null)}
                  className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
                >
                  <Upload size={16} />
                  Upload File
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Folders</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={(f) => navigate(`/folders/${f.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Files */}
              <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Files</h2>
                {files.length === 0 ? (
                  <div className="py-8 text-center bg-white rounded-xl border border-[#e2e8f0] p-6">
                    <FileText size={24} className="mx-auto text-[#94a3b8] mb-2" />
                    <p className="text-sm text-[#64748b]">No files in root folder yet.</p>
                  </div>
                ) : viewMode === "list" ? (
                  <FileTable
                    files={files}
                    showCheckbox
                    selectedIds={selectedIds}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
                    onRowClick={handleItemClick}
                    onToggleStar={handleToggleStar}
                    menuActions={fileMenuActions}
                    columns={["name", "starred", "lastModified", "owner"]}
                  />
                ) : (
                  <FileGrid
                    items={files}
                    onItemClick={handleItemClick}
                    onToggleStar={handleToggleStar}
                    menuActions={fileMenuActions}
                  />
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        title="Move file to trash?"
        description={`"${fileToDelete?.name ?? ""}" will be moved to trash. You can restore it later.`}
        confirmLabel="Move to Trash"
        isPending={deleteFile.isPending}
        onConfirm={confirmDelete}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmModal
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        title="Move selected files to trash?"
        description={`${activeSelectedIds.length} selected file(s) will be moved to trash. You can restore them later.`}
        confirmLabel="Move to Trash"
        isPending={deleteFile.isPending}
        onConfirm={confirmBulkDeleteAction}
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
export default FilesPage;
