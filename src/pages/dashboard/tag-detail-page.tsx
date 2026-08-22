"use client";

import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Tag as TagIcon,
  LayoutGrid,
  List,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { FileGrid } from "@/components/files/file-grid";
import { FileSort } from "@/components/files/file-sort";
import { FilePreview } from "@/components/files/file-preview";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { TagChip, tagColorHex, tagSoftBackground } from "@/components/tags/tag-chip";
import { TagFormModal } from "@/components/tags/tag-form-modal";
import { AddFilesToTagModal } from "@/components/tags/add-files-to-tag-modal";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { useTags, useDeleteTag, useFilesByTag, useRemoveTagFromFile } from "@/hooks/use-tags";
import { useSoftDeleteFile } from "@/hooks/use-files";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { File as ApiFile } from "@/types/file";
import type { Tag } from "@/types/tags";
import type { FileMenuActions } from "@/components/files/file-actions-menu";

function apiFileToFileItem(file: ApiFile, isStarred?: boolean): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    extension: file.extension,
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
    isStarred: Boolean(isStarred || file.is_favorite),
  };
}

const sortOptions = [
  { id: "created_at", label: "Last Modified" },
  { id: "name", label: "Name" },
];

export function TagDetailPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const id = tagId || "";
  const navigate = useNavigate();

  const { openRenameModal, openDownloadDialog } = useUIStore();

  const { data: tagsData, isPending: tagsLoading } = useTags({ limit: 100 });
  const { data: filesData, isPending: filesLoading, isError } = useFilesByTag(id, { limit: 100 });

  const deleteTag = useDeleteTag();
  const deleteFile = useSoftDeleteFile();
  const removeTagFromFile = useRemoveTagFromFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();

  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [tagPickerFileId, setTagPickerFileId] = useState<string | null>(null);
  const [addFilesOpen, setAddFilesOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [confirmDeleteTag, setConfirmDeleteTag] = useState(false);

  const tag: Tag | undefined = useMemo(
    () => (tagsData?.data ?? []).find((t) => t.id === id),
    [tagsData, id]
  );

  const rawFiles: ApiFile[] = filesData?.data ?? [];

  const files: FileItem[] = useMemo(() => {
    const items = rawFiles.map((file) =>
      apiFileToFileItem(file, Boolean(fileMap.get(file.id)))
    );

    return [...items].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [rawFiles, fileMap, sortBy]);

  const handleToggleStar = (item: FileItem) => {
    const favorite = fileMap.get(item.id);
    if (favorite) {
      removeFavorite.mutate(favorite.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
      addFavorite.mutate(
        { file_id: item.id },
        {
          onSuccess: () => toast("success", "Added to favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const handleRemoveFromTag = (fileId: string) => {
    removeTagFromFile.mutate(
      { tagId: id, fileId },
      {
        onSuccess: () => {
          toast("success", "Tag removed from file");
          if (selectedItem?.id === fileId) {
            setSelectedItem(null);
          }
        },
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  const handleDeleteFile = (item: FileItem) => {
    deleteFile.mutate(item.id, {
      onSuccess: () => {
        toast("success", "File moved to trash");
        setFileToDelete(null);
        if (selectedItem?.id === item.id) {
          setSelectedItem(null);
        }
      },
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleDeleteTag = () => {
    if (!tag) return;
    deleteTag.mutate(tag.id, {
      onSuccess: () => {
        toast("success", "Tag deleted");
        navigate("/tags");
      },
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const menuActions: FileMenuActions = {
    onDownload: (item) =>
      openDownloadDialog(item.id, item.name + (item.extension ? `.${item.extension}` : "")),
    onFavorite: handleToggleStar,
    onRename: (item) => openRenameModal(item.id, item.name, false),
    onRemoveFromTag: (item) => handleRemoveFromTag(item.id),
    onDelete: (item) => setFileToDelete(item),
    onTags: (item) => setTagPickerFileId(item.id),
  };

  const hex = tag ? tagColorHex(tag.color) : "#1c3fc4";

  if (!tagsLoading && !tag && !filesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-base font-semibold text-[#0f172a] mb-2">Tag not found</p>
          <p className="text-sm text-[#64748b] mb-6">
            The tag you are looking for does not exist or has been deleted.
          </p>
          <Button
            onClick={() => navigate("/tags")}
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            Back to Tags
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-sm text-[#64748b]">
            <button
              onClick={() => navigate("/tags")}
              className="flex items-center gap-1.5 hover:text-[#1c3fc4] transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              <span>Back to Tags</span>
            </button>
          </div>

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tagSoftBackground(hex), color: hex }}
              >
                <TagIcon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#0f172a]">
                    {tag ? tag.name : "Loading tag…"}
                  </h1>
                  {tag && <TagChip tag={tag} />}
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {files.length} {files.length === 1 ? "file" : "files"} with this tag
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {tag && (
                <>
                  <Button
                    onClick={() => setAddFilesOpen(true)}
                    className="flex items-center gap-2 h-9 px-3.5 text-sm bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
                  >
                    <Plus size={16} />
                    <span>Add Files</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditFormOpen(true)}
                    className="flex items-center gap-1.5 h-9 px-3 text-sm text-[#64748b] hover:text-[#0f172a]"
                  >
                    <Edit2 size={15} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDeleteTag(true)}
                    className="flex items-center gap-1.5 h-9 px-3 text-sm text-[#ef4444] hover:bg-[#fef2f2] hover:border-[#fca5a5]"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </Button>
                </>
              )}
            </div>
          </header>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <FileSort
                options={sortOptions}
                value={sortBy}
                onChange={(id: string) => setSortBy(id)}
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#f1f5f9] rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={[
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-[#1c3fc4]"
                    : "text-[#64748b] hover:text-[#0f172a]",
                ].join(" ")}
              >
                <LayoutGrid size={17} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={[
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-[#1c3fc4]"
                    : "text-[#64748b] hover:text-[#0f172a]",
                ].join(" ")}
              >
                <List size={17} />
              </button>
            </div>
          </div>

          {/* Files List / Grid */}
          {filesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-[#f1f5f9] animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8">
              <p className="text-sm text-red-600">
                Failed to load files for this tag. Please try again.
              </p>
            </div>
          ) : files.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8 max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-2xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a] mb-2">No files in this tag</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Attach files to &quot;{tag?.name}&quot; to organize and access them quickly.
              </p>
              <Button
                onClick={() => setAddFilesOpen(true)}
                className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0] mx-auto"
              >
                <Plus size={16} />
                <span>Add Files to Tag</span>
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <FileGrid
              items={files}
              onItemClick={(item) => setSelectedItem(item)}
              onToggleStar={handleToggleStar}
              menuActions={menuActions}
            />
          ) : (
            <FileTable
              files={files}
              columns={["name", "lastModified", "owner", "tags", "starred"]}
              onRowClick={(item) => setSelectedItem(item)}
              onToggleStar={handleToggleStar}
              menuActions={menuActions}
            />
          )}
        </div>
      </div>

      {/* File Preview Drawer */}
      {selectedItem && (
        <FilePreview
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Modals */}
      {tag && (
        <>
          <AddFilesToTagModal
            open={addFilesOpen}
            tag={tag}
            onClose={() => setAddFilesOpen(false)}
          />
          <TagFormModal
            open={editFormOpen}
            tag={tag}
            onClose={() => setEditFormOpen(false)}
          />
          <ConfirmModal
            open={confirmDeleteTag}
            title={`Delete tag "${tag.name}"?`}
            description="This will remove the tag from all associated files. The files themselves will not be deleted."
            confirmLabel="Delete Tag"
            isPending={deleteTag.isPending}
            onConfirm={handleDeleteTag}
            onClose={() => setConfirmDeleteTag(false)}
          />
        </>
      )}

      {fileToDelete && (
        <ConfirmModal
          open={Boolean(fileToDelete)}
          title={`Move "${fileToDelete.name}" to trash?`}
          description="You can restore this file from the trash later."
          confirmLabel="Move to Trash"
          isPending={deleteFile.isPending}
          onConfirm={() => handleDeleteFile(fileToDelete)}
          onClose={() => setFileToDelete(null)}
        />
      )}

      {tagPickerFileId && (
        <TagPickerModal
          open={Boolean(tagPickerFileId)}
          fileId={tagPickerFileId}
          onClose={() => setTagPickerFileId(null)}
        />
      )}
    </div>
  );
}

export default TagDetailPage;
