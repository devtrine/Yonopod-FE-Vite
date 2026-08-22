"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, ChevronRight, Tag as TagIcon, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileCard } from "@/components/files/file-card";
import { TagChip, tagColorHex, tagSoftBackground } from "@/components/tags/tag-chip";
import { useFilesByTag, useRemoveTagFromFile } from "@/hooks/use-tags";
import { useSoftDeleteFile } from "@/hooks/use-files";
import { useAddFavorite, useRemoveFavorite, useFavoriteMaps } from "@/hooks/use-favorites";
import { useUIStore } from "@/stores/ui-store";
import { usePreviewStore } from "@/stores/preview-store";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { Tag } from "@/types/tags";
import type { File as ApiFile } from "@/types/file";
import type { FileItem } from "@/components/files/file-table";
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

export function TagSection({
  tag,
  onEditTag,
  onDeleteTag,
  onAddFiles,
  onFileClick,
  onManageTags,
}: {
  tag: Tag;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
  onAddFiles: (tag: Tag) => void;
  onFileClick?: (file: FileItem) => void;
  onManageTags?: (fileId: string) => void;
}) {
  const navigate = useNavigate();
  const { openRenameModal, openDownloadDialog } = useUIStore();
  const { setActiveFiles, openPreview } = usePreviewStore();

  const { data, isPending, isError } = useFilesByTag(tag.id, { limit: 3 });
  const deleteFile = useSoftDeleteFile();
  const removeTagFromFile = useRemoveTagFromFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();

  const rawFiles: ApiFile[] = data?.data ?? [];
  const fileItems: FileItem[] = useMemo(
    () => rawFiles.map((file) => apiFileToFileItem(file, Boolean(fileMap.get(file.id)))),
    [rawFiles, fileMap]
  );

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
      { tagId: tag.id, fileId },
      {
        onSuccess: () => toast("success", `Removed "${tag.name}" from file`),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile.mutate(fileId, {
      onSuccess: () => toast("success", "File moved to trash"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleFileClick = (item: FileItem) => {
    if (onFileClick) {
      onFileClick(item);
    } else {
      setActiveFiles(fileItems, !isPending);
      openPreview(item.id);
    }
  };

  const getMenuActions = (item: FileItem): FileMenuActions => ({
    onDownload: () => openDownloadDialog(item.id, item.name + (item.extension ? `.${item.extension}` : "")),
    onFavorite: () => handleToggleStar(item),
    onRename: () => openRenameModal(item.id, item.name, false),
    onRemoveFromTag: () => handleRemoveFromTag(item.id),
    onDelete: () => handleDeleteFile(item.id),
    onTags: () => onManageTags?.(item.id),
  });

  const hex = tagColorHex(tag.color);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div
          onClick={() => navigate(`/tags/${tag.id}`)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: tagSoftBackground(hex), color: hex }}
          >
            <TagIcon size={16} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0f172a] group-hover:text-[#1c3fc4] transition-colors">
              {tag.name}
            </h2>
            <TagChip tag={tag} />
            <span className="text-xs text-[#64748b] font-medium">
              ({tag.files_count ?? 0} {tag.files_count === 1 ? "file" : "files"})
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddFiles(tag)}
            className="h-8 px-2.5 text-xs flex items-center gap-1 text-[#64748b] hover:text-[#0f172a]"
          >
            <Plus size={14} />
            <span>Add Files</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tags/${tag.id}`)}
            className="h-8 px-2.5 text-xs flex items-center gap-1 text-[#1c3fc4] hover:bg-[#eff4ff]"
          >
            <span>View all</span>
            <ChevronRight size={14} />
          </Button>

          <div className="h-4 w-px bg-[#e2e8f0] mx-1" />

          <button
            onClick={() => onEditTag(tag)}
            aria-label={`Edit tag ${tag.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDeleteTag(tag)}
            aria-label={`Delete tag ${tag.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body / Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="py-6 text-center text-xs text-red-500 bg-[#fef2f2] rounded-xl">
          Failed to load files for this tag.
        </div>
      ) : fileItems.length === 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc]">
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <FilePlus size={16} className="text-[#94a3b8]" />
            <span>Belum ada file di tag ini.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddFiles(tag)}
            className="h-7 text-xs bg-white"
          >
            <Plus size={13} className="mr-1" /> Add files to tag
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
          {fileItems.map((item) => (
            <FileCard
              key={item.id}
              item={item}
              onClick={handleFileClick}
              onToggleStar={handleToggleStar}
              menuActions={getMenuActions(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
