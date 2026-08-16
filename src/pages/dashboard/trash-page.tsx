import { useState } from "react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Trash2, AlertTriangle } from "lucide-react";
import { useFilesTrash, useRestoreFile, usePermanentDeleteFile } from "@/hooks/use-files";
import { useFoldersTrash, useRestoreFolder, usePermanentDeleteFolder } from "@/hooks/use-folders";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { File as ApiFile } from "@/types/file";
import type { Folder } from "@/types/folder";

function fileToTrashItem(file: ApiFile): FileItem {
  return {
    id: `file-${file.id}`,
    name: file.name,
    isFolder: false,
    lastModified: file.deleted_at
      ? new Date(file.deleted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—",
    owner: "me",
    tags: file.tags || [],
    location: "My Drive",
  };
}

function folderToTrashItem(folder: Folder): FileItem {
  return {
    id: `folder-${folder.id}`,
    name: folder.name,
    isFolder: true,
    lastModified: folder.deleted_at
      ? new Date(folder.deleted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—",
    owner: "me",
    tags: [],
    location: folder.path ?? "My Drive",
  };
}

export function TrashPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // single item id to permanently delete
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false); // modal status for multiple/bulk delete

  const { data: filesTrash, isPending: filesLoading } = useFilesTrash({ limit: 50 });
  const { data: foldersTrash, isPending: foldersLoading } = useFoldersTrash({ limit: 50 });

  const restoreFile = useRestoreFile();
  const permanentDeleteFile = usePermanentDeleteFile();
  const restoreFolder = useRestoreFolder();
  const permanentDeleteFolder = usePermanentDeleteFolder();

  const trashFiles: FileItem[] = (filesTrash?.data ?? []).map(fileToTrashItem);
  const trashFolders: FileItem[] = (foldersTrash?.data ?? []).map(folderToTrashItem);
  const allTrash = [...trashFolders, ...trashFiles];

  const isLoading = filesLoading || foldersLoading;

  // Filter ID terpilih agar selalu mengikuti daftar item yang sedang tampil
  const activeSelectedIds = selectedIds.filter((id) => allTrash.some((item) => item.id === id));

  // Status Select All
  const isAllSelected = allTrash.length > 0 && activeSelectedIds.length === allTrash.length;

  // Handler Individual Select
  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Handler Select All / Unselect All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(allTrash.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handler Restore (Bisa single/multiple)
  const handleRestore = () => {
    if (activeSelectedIds.length === 0) return;

    const promises = activeSelectedIds.map((id) => {
      if (id.startsWith("file-")) {
        return restoreFile.mutateAsync(id.replace("file-", ""));
      } else {
        return restoreFolder.mutateAsync(id.replace("folder-", ""));
      }
    });

    Promise.all(promises)
      .then(() => {
        toast("success", `${activeSelectedIds.length} item(s) restored`);
        setSelectedIds([]);
      })
      .catch((err) => toast("error", getErrorMessage(err)));
  };

  // Handler Restore item tunggal dari menu
  const handleRestoreItem = (item: FileItem) => {
    const op = item.id.startsWith("file-")
      ? restoreFile.mutateAsync(item.id.replace("file-", ""))
      : restoreFolder.mutateAsync(item.id.replace("folder-", ""));

    op.then(() => toast("success", "Item restored"))
      .catch((err) => toast("error", getErrorMessage(err)));
  };

  // Handler memicu modal konfirmasi single delete
  const handlePermanentDelete = (id: string) => {
    setConfirmDelete(id);
  };

  // Eksekusi Single Delete
  const confirmPermanentDelete = () => {
    if (!confirmDelete) return;
    const op = confirmDelete.startsWith("file-")
      ? permanentDeleteFile.mutateAsync(confirmDelete.replace("file-", ""))
      : permanentDeleteFolder.mutateAsync(confirmDelete.replace("folder-", ""));

    op.then(() => {
      toast("success", "Item permanently deleted");
      setConfirmDelete(null);
      setSelectedIds((prev) => prev.filter((i) => i !== confirmDelete));
    }).catch((err) => {
      toast("error", getErrorMessage(err));
      setConfirmDelete(null);
    });
  };

  // Eksekusi Bulk Delete (Selected Items / Empty Trash)
  const confirmBulkDelete = () => {
    const idsToDelete = activeSelectedIds.length > 0 ? activeSelectedIds : allTrash.map((i) => i.id);

    const promises = idsToDelete.map((id) => {
      if (id.startsWith("file-")) {
        return permanentDeleteFile.mutateAsync(id.replace("file-", ""));
      } else {
        return permanentDeleteFolder.mutateAsync(id.replace("folder-", ""));
      }
    });

    Promise.all(promises)
      .then(() => {
        toast("success", "Items permanently deleted");
        setConfirmEmptyTrash(false);
        setSelectedIds([]);
      })
      .catch((err) => {
        toast("error", getErrorMessage(err));
        setConfirmEmptyTrash(false);
      });
  };

  const isDeletingBulk =
    permanentDeleteFile.isPending || permanentDeleteFolder.isPending;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          
          <header className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#0f172a]">Trash</h1>
              {allTrash.length > 0 && (
                <Button
                  variant="outline"
                  className="text-[#ef4444] border-[#ef4444] hover:bg-[#fee2e2]"
                  onClick={() => setConfirmEmptyTrash(true)}
                >
                  <Trash2 size={16} />
                  Empty Trash
                </Button>
              )}
            </div>
            <p className="text-sm text-[#64748b]">
              Items in trash are deleted forever after 30 days.
            </p>
          </header>

          {activeSelectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-[#eff1fb] border border-[#1c3fc4] rounded-lg p-3 px-4">
              <span className="text-sm font-medium text-[#1c3fc4]">
                {activeSelectedIds.length} item(s) selected
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white" onClick={handleRestore}>
                  Restore
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (activeSelectedIds.length === 1) {
                      handlePermanentDelete(activeSelectedIds[0]);
                    } else {
                      setConfirmEmptyTrash(true);
                    }
                  }}
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          )}

          <section className="flex flex-col gap-4">
            {isLoading ? (
              <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
            ) : allTrash.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#64748b]">Trash is empty.</p>
              </div>
            ) : (
              <FileTable
                files={allTrash}
                columns={["name", "dateDeleted", "originalLocation", "tags"]}
                showCheckbox
                selectedIds={selectedIds}
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
                onSelect={handleSelect}
                menuActions={{
                  onRestore: handleRestoreItem,
                  onDeletePermanent: (item) => handlePermanentDelete(item.id),
                }}
              />
            )}
          </section>
        </div>
      </div>

      {/* Single Item Permanent Delete Modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Permanently?"
        description="This action cannot be undone. The file will be deleted forever."
        icon={<AlertTriangle size={20} />}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmPermanentDelete}
              disabled={permanentDeleteFile.isPending || permanentDeleteFolder.isPending}
            >
              Delete Forever
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#64748b]">
          Are you sure you want to permanently delete this item?
        </p>
      </Modal>

      {/* Bulk / Empty Trash Permanent Delete Modal */}
      <Modal
        open={confirmEmptyTrash}
        onClose={() => setConfirmEmptyTrash(false)}
        title={activeSelectedIds.length > 0 ? "Delete Selected Items?" : "Empty Trash?"}
        description="This action cannot be undone. All selected items will be deleted forever."
        icon={<AlertTriangle size={20} />}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmEmptyTrash(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmBulkDelete}
              disabled={isDeletingBulk}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#64748b]">
          {activeSelectedIds.length > 0
            ? `Are you sure you want to permanently delete ${activeSelectedIds.length} selected item(s)?`
            : "Are you sure you want to empty the trash? All items inside will be permanently deleted."}
        </p>
      </Modal>
    </div>
  );
}
export default TrashPage;
