"use client";

import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tag as TagIcon, FileText, Plus, Check, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import {
  useFilesByTag,
  useAddTagToFile,
  useRemoveTagFromFile,
} from "../../hooks/use-tags";
import { useFiles, useSoftDeleteFile } from "../../hooks/use-files";
import {
  useAddFavorite,
  useRemoveFavorite,
  useFavoriteMaps,
} from "../../hooks/use-favorites";
import { useUIStore } from "../../stores/ui-store";
import { tagColorHex, tagSoftBackground } from "./tag-chip";
import { FileActionsMenu } from "../files/file-actions-menu";
import type { FileItem } from "../files/file-table";
import type { Tag } from "../../types/tags";
import type { File as ApiFile } from "../../types/file";

function fileToFileItem(file: ApiFile, isStarred?: boolean): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    isFolder: false,
    tags: file.tags || [],
    isStarred,
  };
}

export function TagFilesModal({
  tag,
  onClose,
}: {
  tag: Tag | null;
  onClose: () => void;
}) {
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError } = useFilesByTag(tag?.id, { limit: 50 });
  const { data: allFilesData, isPending: allFilesLoading } = useFiles({ limit: 100 });
  const addTagToFile = useAddTagToFile();
  const removeTagFromFile = useRemoveTagFromFile();
  const deleteFile = useSoftDeleteFile();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { fileMap } = useFavoriteMaps();
  const { openRenameModal } = useUIStore();
  const queryClient = useQueryClient();

  const tagFiles = useMemo(() => data?.data ?? [], [data]);
  const tagFileIds = useMemo(() => new Set(tagFiles.map((f) => f.id)), [tagFiles]);
  const allFiles = useMemo(
    () => (allFilesData?.data ?? []).filter((f) => !tagFileIds.has(f.id)),
    [allFilesData, tagFileIds]
  );

  if (!tag) return null;

  const hex = tagColorHex(tag.color);
  const adding = addTagToFile.isPending;

  const toggleFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddFiles = async () => {
    if (!tag || selectedFileIds.length === 0) return;
    const ids = [...selectedFileIds];
    try {
      for (const fileId of ids) {
        await addTagToFile.mutateAsync({ tagId: tag.id, fileId });
      }
      toast("success", `Added tag to ${ids.length} file(s)`);
      setSelectedFileIds([]);
      setShowFilePicker(false);
    } catch (err) {
      toast("error", getErrorMessage(err));
    }
  };

  const handleRemoveFile = (fileId: string) => {
    if (!tag) return;
    removeTagFromFile.mutate(
      { tagId: tag.id, fileId },
      {
        onSuccess: () => toast("success", "Tag removed from file"),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  const handleFavorite = (file: ApiFile) => {
    const favorite = fileMap.get(file.id);
    if (favorite) {
      removeFavorite.mutate(favorite.id, {
        onSuccess: () => toast("success", "Removed from favorites"),
        onError: (err) => toast("error", getErrorMessage(err)),
      });
    } else {
      addFavorite.mutate(
        { file_id: file.id },
        {
          onSuccess: () => toast("success", "Added to favorites"),
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const handleRename = (file: ApiFile) => {
    openRenameModal(file.id, file.name, false);
  };

  const handleDelete = (file: ApiFile) => {
    deleteFile.mutate(file.id, {
      onSuccess: () => {
        toast("success", "File moved to trash");
        if (tag) {
          queryClient.invalidateQueries({
            queryKey: ["tags", tag.id, "files"],
          });
        }
      },
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  return (
    <Modal
      open={Boolean(tag)}
      onClose={onClose}
      title={tag.name}
      description={`${tagFiles.length} file(s) tagged`}
      icon={
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: tagSoftBackground(hex), color: hex }}
        >
          <TagIcon size={20} />
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {!showFilePicker ? (
            <Button
              variant="outline"
              onClick={() => setShowFilePicker(true)}
              className="flex items-center gap-1.5"
            >
              <Plus size={15} />
              Add Files
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowFilePicker(false);
                setSelectedFileIds([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onClose}
              className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
            >
              Done
            </Button>
          </div>
        </div>
      }
    >
      {showFilePicker ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">
              Choose files to tag
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              Files already tagged are hidden from this list.
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto border border-[#e2e8f0] rounded-xl divide-y divide-[#f1f5f9]">
            {allFilesLoading ? (
              <div className="p-4 text-center text-sm text-[#64748b]">
                Loading files…
              </div>
            ) : allFiles.length === 0 ? (
              <div className="p-6 text-center">
                <FileText size={20} className="mx-auto text-[#94a3b8] mb-2" />
                <p className="text-sm text-[#64748b]">
                  No files available. Upload files first.
                </p>
              </div>
            ) : (
              allFiles.map((file) => (
                <label
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFileIds.includes(file.id)}
                    onChange={() => toggleFile(file.id)}
                    className="w-4 h-4 rounded border-[#cbd5e1] text-[#1c3fc4] cursor-pointer"
                  />
                  <FileText size={16} className="text-[#64748b] flex-shrink-0" />
                  <span className="flex-1 text-sm text-[#0f172a] truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#94a3b8] flex-shrink-0">
                    .{file.extension}
                  </span>
                </label>
              ))
            )}
          </div>

          <Button
            onClick={handleAddFiles}
            disabled={selectedFileIds.length === 0 || adding}
            className="flex items-center gap-2 self-end bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Add to Tag ({selectedFileIds.length})
          </Button>
        </div>
      ) : isPending ? (
        <div className="flex flex-col gap-2 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-[#f1f5f9] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-600">
            Failed to load files for this tag. Please try again.
          </p>
        </div>
      ) : tagFiles.length === 0 ? (
        <div className="py-10 text-center">
          <TagIcon size={28} className="mx-auto text-[#94a3b8] mb-3" />
          <p className="text-sm font-medium text-[#0f172a]">
            No files tagged yet
          </p>
          <p className="text-xs text-[#64748b] mt-1">
            Click &quot;Add Files&quot; to attach this tag to files.
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          className="max-h-72 overflow-y-auto border border-[#e2e8f0] rounded-xl divide-y divide-[#f1f5f9]"
        >
          {tagFiles.map((file) => (
            <div
              key={file.id}
              className="group flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors"
            >
              <FileText size={16} className="text-[#64748b] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0f172a] truncate">{file.name}</p>
                <p className="text-xs text-[#94a3b8]">.{file.extension}</p>
              </div>
              <FileActionsMenu
                item={fileToFileItem(file, Boolean(fileMap.get(file.id)))}
                triggerClassName="opacity-0 group-hover:opacity-100"
                portalTarget={listRef}
                onFavorite={() => handleFavorite(file)}
                onRename={() => handleRename(file)}
                onDelete={() => handleDelete(file)}
                onRemoveFromTag={() => handleRemoveFile(file.id)}
              />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
