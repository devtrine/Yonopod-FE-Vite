import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { FileTypeFilter } from "@/components/files/file-type-filter";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { File as ApiFile } from "@/types/file";
import type { Folder as ApiFolder } from "@/types/folder";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { useUIStore } from "@/stores/ui-store";
import { useSoftDeleteFile } from "@/hooks/use-files";
import { useSoftDeleteFolder } from "@/hooks/use-folders";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";

// ─── Mappers ─────────────────────────────────────────────────────────────────

function fileToItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    lastModified: new Date(file.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    owner: "me",
    tags: file.tags || [],
    isStarred: file.is_favorite,
  };
}

function folderToItem(folder: ApiFolder): FileItem {
  return {
    id: `folder-${folder.id}`,
    name: folder.name,
    isFolder: true,
    lastModified: new Date(folder.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    owner: "me",
    tags: [],
    isStarred: false,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface SearchPanelProps {
  /** Initial query — useful when rendered inside a header overlay */
  initialQuery?: string;
  /** Hide the "Search Drive" heading (e.g. when used inside header overlay) */
  hideTitle?: boolean;
  /** Callback fired when a navigation action occurs (e.g. clicking a folder) */
  onNavigate?: () => void;
}

export function SearchPanel({ initialQuery = "", hideTitle = false, onNavigate }: SearchPanelProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [fileType, setFileType] = useState(""); 
  const [kindFilter, setKindFilter] = useState<"all" | "files" | "folders">("all");
  const debouncedQuery = useDebounce(query, 400);

  const { openRenameModal, openDownloadDialog } = useUIStore();
  const deleteFile = useSoftDeleteFile();
  const deleteFolder = useSoftDeleteFolder();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap, folderMap } = useFavoriteMaps();
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [tagFileId, setTagFileId] = useState<number | null>(null);

  const { data, isPending, isError } = useSearch({
    q: debouncedQuery || undefined,
    type: fileType || undefined,
    limit: 50,
  });

  let items: FileItem[] = [];
  if (kindFilter === "all" || kindFilter === "folders") {
    items = items.concat((data?.folders ?? []).map(folderToItem));
  }
  if (kindFilter === "all" || kindFilter === "files") {
    items = items.concat((data?.files ?? []).map(fileToItem));
  }

  const hasActiveFilter = Boolean(debouncedQuery || fileType || kindFilter !== "all");
  const totalFiles = data?.pagination.totalFiles ?? 0;
  const totalFolders = data?.pagination.totalFolders ?? 0;

  const handleToggleStar = (item: FileItem) => {
    if (item.isFolder) {
      const realId = Number(item.id.replace("folder-", ""));
      const favorite = folderMap.get(realId);
      if (favorite) {
        removeFavorite.mutate(favorite.id, {
          onSuccess: () => toast("success", "Removed from favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        });
      } else {
        addFavorite.mutate(
          { folder_id: realId },
          {
            onSuccess: () => toast("success", "Added to favorites"),
            onError: (err) => toast("error", getErrorMessage(err)),
          }
        );
      }
    } else {
      const fileId = Number(item.id);
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
    }
  };

  const handleRename = (item: FileItem) => {
    if (item.isFolder) {
      openRenameModal(Number(item.id.replace("folder-", "")), item.name, true);
    } else {
      openRenameModal(Number(item.id), item.name, false);
    }
  };

  const handleDownload = (item: FileItem) => {
    if (!item) return;
    openDownloadDialog(Number(item.id), item.name);
  };

  const handleTags = (item: FileItem) => {
    if (item.isFolder) return;
    setTagFileId(Number(item.id));
  };

  const handleDeleteRequest = (item: FileItem) => {
    setFileToDelete(item);
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    if (fileToDelete.isFolder) {
      deleteFolder.mutate(Number(fileToDelete.id.replace("folder-", "")), {
        onSuccess: () => {
          toast("success", "Folder moved to trash");
          setFileToDelete(null);
        },
        onError: (err) => {
          toast("error", getErrorMessage(err));
          setFileToDelete(null);
        },
      });
    } else {
      deleteFile.mutate(Number(fileToDelete.id), {
        onSuccess: () => {
          toast("success", "File moved to trash");
          setFileToDelete(null);
        },
        onError: (err) => {
          toast("error", getErrorMessage(err));
          setFileToDelete(null);
        },
      });
    }
  };

  const fileMenuActions = {
    onFavorite: handleToggleStar,
    onRename: handleRename,
    onTags: handleTags,
    onDelete: handleDeleteRequest,
    onDownload: handleDownload
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {!hideTitle && (
        <h1 className="text-2xl font-bold text-[#0f172a]">Search Drive</h1>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files and folders..."
            autoFocus={hideTitle}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1c3fc4] focus:ring-1 focus:ring-[#1c3fc4]"
          />
        </div>

        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as "all" | "files" | "folders")}
          className="h-11 px-4 rounded-xl border border-[#e2e8f0] bg-white text-sm text-[#0f172a] appearance-none focus:outline-none focus:border-[#1c3fc4] focus:ring-1 focus:ring-[#1c3fc4]"
        >
          <option value="all">All Files & Folders</option>
          <option value="files">Files Only</option>
          <option value="folders">Folders Only</option>
        </select>

        {kindFilter !== "folders" && (
          <FileTypeFilter value={fileType} onChange={setFileType} />
        )}
      </div>

      {/* Results */}
      <section>
        {!hasActiveFilter ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0]">
            <Search size={32} className="mx-auto text-[#94a3b8] mb-3" />
            <p className="text-sm font-medium text-[#0f172a]">Start searching</p>
            <p className="text-xs text-[#64748b] mt-1">
              Enter a keyword or pick a file type to search your drive.
            </p>
          </div>
        ) : isPending ? (
          <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">Failed to search. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0]">
            <FileText size={32} className="mx-auto text-[#94a3b8] mb-3" />
            <p className="text-sm font-medium text-[#0f172a]">No results found</p>
            <p className="text-xs text-[#64748b] mt-1">
              No matches for{debouncedQuery ? ` "${debouncedQuery}"` : ""}
              {fileType ? ` (${fileType})` : ""}. Try a different keyword.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
              {totalFiles} file(s) · {totalFolders} folder(s)
            </p>
            <FileTable
              files={items}
              columns={["name", "starred", "lastModified", "owner"]}
              menuActions={fileMenuActions}
              onRowClick={(file) => {
                // jika yang diklik adalah folder, arahkan ke halaman folder.
                if (file.isFolder) {
                  navigate(`/folders/${file.id.replace("folder-", "")}`);
                  onNavigate?.();
                }
              }}
            />
          </div>
        )}
      </section>

      <ConfirmModal
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        description={`Are you sure you want to move "${fileToDelete?.name}" to trash?`}
        confirmLabel="Move to Trash"
      />
      <TagPickerModal
        open={tagFileId !== null}
        onClose={() => setTagFileId(null)}
        fileId={tagFileId ?? 0}
      />
    </div>
  );
}
