import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Folder as FolderIcon,
  FolderPlus,
  Upload,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  ShieldCheck,
  FileText,
  Download,
  Star,
  X,
} from "lucide-react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { FileGrid } from "@/components/files/file-grid";
import { FileSort } from "@/components/files/file-sort";
import { FileActions } from "@/components/files/file-actions";
import { FilePreview } from "@/components/files/file-preview";
import { FolderCard } from "@/components/folders/folder-card";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  useFolder,
  useFolders,
  useSoftDeleteFolder,
  useUnlockFolder,
} from "@/hooks/use-folders";
import { useFiles, useSoftDeleteFile } from "@/hooks/use-files";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { File as ApiFile } from "@/types/file";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function fileToFileItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    lastModified: file.updated_at
      ? new Date(file.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : new Date(file.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    owner: "me",
    tags: file.tags || [],
    isStarred: file.is_favorite,
  };
}

const sortOptions = [
  { id: "created_at", label: "Last Modified" },
  { id: "name", label: "Name" },
];

export function FolderDetailPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const id = folderId || "";
  const navigate = useNavigate();

  const { openCreateFolderModal, openUploadModal, openRenameModal, openLockModal, openDownloadDialog } =
    useUIStore();

  const { data: folder, isPending: folderLoading, isError, error } = useFolder(id);
  const { data: subfoldersData, isPending: subfoldersLoading } = useFolders({
    parent_id: id,
    limit: 50,
  });
  const { data: filesData, isPending: filesLoading } = useFiles({
    folder_id: id,
    limit: 50,
  });

  const deleteFolder = useSoftDeleteFolder();
  const unlockFolder = useUnlockFolder(id);
  const deleteFile = useSoftDeleteFile();

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [tagFileId, setTagFileId] = useState<string | null>(null);

  if (folderLoading || subfoldersLoading || filesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8fafc]">
        <div className="w-16 h-16 rounded-full bg-[#f1f5f9] animate-pulse" />
      </div>
    );
  }

  if (isError || !folder) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8fafc] p-4">
        <div className="text-center max-w-md">
          <p className="text-base font-semibold text-red-600 mb-2">
            Folder not found
          </p>
          <p className="text-sm text-[#64748b] mb-6">
            {error
              ? getErrorMessage(error)
              : "The requested folder does not exist or has been deleted."}
          </p>
          <Button onClick={() => navigate("/files")}>
            Return to My Drive
          </Button>
        </div>
      </div>
    );
  }

  // Handle locked folder screen
  if (folder.is_locked && !isUnlocked) {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!pin) return;
      try {
        await unlockFolder.mutateAsync({
          vault_password: pin,
        });
        setIsUnlocked(true);
        toast("success", "Folder unlocked successfully");
      } catch (err) {
        toast("error", getErrorMessage(err));
      }
    };

    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8fafc] p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e2e8f0] text-center">
          <div className="w-16 h-16 bg-[#eff1fb] text-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
            {folder.name}
          </h1>
          <p className="text-sm text-[#64748b] mb-6">
            This folder is protected and encrypted. Enter your vault password to
            view its contents.
          </p>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="password"
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter password / PIN"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-center text-sm focus:outline-none focus:border-[#1c3fc4]"
            />
            <Button
              type="submit"
              disabled={!pin || unlockFolder.isPending}
              className="w-full h-11 text-base flex items-center justify-center gap-2"
            >
              <Unlock size={18} />
              {unlockFolder.isPending ? "Unlocking…" : "Unlock Folder"}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#16a34a] bg-[#dcfce7] py-2 px-3 rounded-lg mx-auto w-fit">
            <ShieldCheck size={16} />
            End-to-End Encrypted
          </div>
        </div>
      </div>
    );
  }

  const subfolders = subfoldersData?.data ?? [];
  const files: FileItem[] = (filesData?.data ?? []).map(fileToFileItem);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to move "${folder.name}" to trash?`)) {
      deleteFolder.mutate(folder.id, {
        onSuccess: () => {
          toast("success", "Folder moved to trash");
          navigate("/files");
        },
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    }
  };

  const handleItemClick = (item: FileItem) => {
    if (item.isFolder) {
      const targetId = item.id.replace("folder-", "");
      navigate(`/folders/${targetId}`);
    } else {
      setSelectedItem(item);
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

  const handleFileRename = (item: FileItem) => {
    if (item.isFolder) return;
    openRenameModal(item.id, item.name, false);
  };

  const handleFileDeleteRequest = (item: FileItem) => {
    if (item.isFolder) return;
    setFileToDelete(item);
  };

  const handleFileTags = (item: FileItem) => {
    if (item.isFolder) return;
    setTagFileId(item.id);
  };

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    if (item.isFolder) return;
    openDownloadDialog(item.id, item.name);
  };

  const confirmFileDelete = () => {
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
    onRename: handleFileRename,
    onTags: handleFileTags,
    onDelete: handleFileDeleteRequest,
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

  const handleBulkDownload = () => {
    activeSelectedIds.forEach((id) => {
      const item = files.find((f) => f.id === id);
      if (item && !item.isFolder) {
        openDownloadDialog(item.id, item.name);
      }
    });
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
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-[#64748b]">
            <button
              onClick={() => navigate("/files")}
              className="hover:text-[#0f172a] transition-colors font-medium"
            >
              My Drive
            </button>
            <span>/</span>
            <span className="font-semibold text-[#0f172a]">{folder.name}</span>
          </nav>

          {/* Folder Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center flex-shrink-0">
                <FolderIcon size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#0f172a]">
                    {folder.name}
                  </h1>
                  {folder.is_locked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fef3c7] text-[#b45309] text-xs font-semibold">
                      <Lock size={12} />
                      Protected
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748b] mt-1">
                  Created{" "}
                  {new Date(folder.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => openCreateFolderModal(folder.id)}
                className="flex items-center gap-1.5 h-9 px-3 text-sm"
              >
                <FolderPlus size={16} />
                <span>New Folder</span>
              </Button>

              <Button
                onClick={() => openUploadModal(folder.id)}
                className="flex items-center gap-1.5 h-9 px-3 text-sm bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
              >
                <Upload size={16} />
                <span>Upload File</span>
              </Button>

              <div className="h-5 w-px bg-[#e2e8f0] mx-1 hidden sm:block" />

              <Button
                variant="outline"
                onClick={() => openRenameModal(folder.id, folder.name, true)}
                className="h-9 px-3 text-sm"
              >
                <Edit2 size={15} />
                <span>Rename</span>
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  openLockModal(folder.id, folder.name, folder.is_locked)
                }
                className="h-9 px-3 text-sm"
              >
                {folder.is_locked ? <Unlock size={15} /> : <Lock size={15} />}
                <span>{folder.is_locked ? "Unlock" : "Lock"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-9 px-3 text-sm text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]"
              >
                <Trash2 size={15} />
                <span>Trash</span>
              </Button>

              <div className="h-5 w-px bg-[#e2e8f0] mx-1 hidden sm:block" />

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
                  onClick={handleBulkDownload}
                >
                  <Download size={14} />
                  Download
                </Button>
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

          {subfolders.length === 0 && files.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8 max-w-md mx-auto my-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mx-auto mb-4">
                <FolderIcon size={28} />
              </div>
              <h2 className="text-base font-bold text-[#0f172a] mb-1">
                This folder is empty
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                Create a subfolder or upload files into this folder.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => openCreateFolderModal(folder.id)}
                  className="flex items-center gap-2"
                >
                  <FolderPlus size={16} />
                  New Folder
                </Button>
                <Button
                  onClick={() => openUploadModal(folder.id)}
                  className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
                >
                  <Upload size={16} />
                  Upload File
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Subfolders */}
              {subfolders.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                    Folders
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subfolders.map((sub) => (
                      <FolderCard
                        key={sub.id}
                        folder={sub}
                        onClick={(f) => navigate(`/folders/${f.id}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Files in folder */}
              <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
                  Files
                </h2>
                {files.length === 0 ? (
                  <div className="py-8 text-center bg-white rounded-xl border border-[#e2e8f0] p-6">
                    <FileText size={24} className="mx-auto text-[#94a3b8] mb-2" />
                    <p className="text-sm text-[#64748b]">
                      No files in this folder yet.
                    </p>
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
                    columns={["name", "starred", "lastModified", "owner", "tags"]}
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

      {/* Right Side Panel */}
      {selectedItem && (
        <FilePreview
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        title="Move file to trash?"
        description={`"${fileToDelete?.name ?? ""}" will be moved to trash. You can restore it later.`}
        confirmLabel="Move to Trash"
        isPending={deleteFile.isPending}
        onConfirm={confirmFileDelete}
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
export default FolderDetailPage;
