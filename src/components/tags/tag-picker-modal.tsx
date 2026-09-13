"use client";

import { useMemo } from "react";
import { Tag as TagIcon, Plus, X, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import { useFile } from "../../hooks/use-files";
import {
  useTags,
  useAddTagToFile,
  useRemoveTagFromFile,
} from "../../hooks/use-tags";
import { tagColorHex } from "./tag-chip";
import type { Tag } from "../../types/tags";

export function TagPickerModal({
  open,
  fileId,
  onClose,
}: {
  open: boolean;
  fileId: string;
  onClose: () => void;
}) {
  const { data: file, isPending: fileLoading } = useFile(open ? fileId : undefined);
  const { data: tagsData, isPending: tagsLoading } = useTags({ limit: 100 });
  const addTagToFile = useAddTagToFile();
  const removeTagFromFile = useRemoveTagFromFile();

  const allTags = useMemo(() => tagsData?.data ?? [], [tagsData?.data]);
  const fileTags = useMemo(() => file?.tags ?? [], [file?.tags]);

  const fileTagIds = useMemo(() => new Set(fileTags.map((t) => t.id)), [fileTags]);
  const availableTags = useMemo(
    () => allTags.filter((t) => !fileTagIds.has(t.id)),
    [allTags, fileTagIds]
  );

  const handleAdd = (tag: Tag) => {
    addTagToFile.mutate(
      { tagId: tag.id, fileId },
      {
        onSuccess: () => toast("success", `Tagged with "${tag.name}"`),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  const handleRemove = (tag: Tag) => {
    removeTagFromFile.mutate(
      { tagId: tag.id, fileId },
      {
        onSuccess: () => toast("success", `Removed "${tag.name}" from file`),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage Tags"
      description={file ? file.name : "Loading file…"}
      icon={<TagIcon size={20} />}
      size="lg"
      footer={
        <div className="flex w-full justify-end">
          <Button
            onClick={onClose}
            className="bg-[#0F0A6B] text-white hover:bg-[#161282]"
          >
            Done
          </Button>
        </div>
      }
    >
      {fileLoading || tagsLoading ? (
        <div className="flex flex-col gap-2 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-[#f1f5f9] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Current tags */}
          <div>
            <p className="text-sm font-semibold text-[#0f172a] mb-2">
              Current tags
            </p>
            {fileTags.length === 0 ? (
              <p className="text-sm text-[#64748b]">No tags assigned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {fileTags.map((tag) => {
                  const hex = tagColorHex(tag.color);
                  return (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#B3EEF6] text-black border border-[#9ee4ee]/50"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: hex === "#3b82f6" || hex === "#0F0A6B" ? "#000000" : hex }}
                      />
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(tag)}
                        disabled={removeTagFromFile.isPending}
                        aria-label={`Remove tag ${tag.name}`}
                        className="text-black/60 hover:text-black transition-opacity disabled:opacity-30"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Addable tags */}
          <div>
            <p className="text-sm font-semibold text-[#0f172a] mb-2">
              Add a tag
            </p>
            {allTags.length === 0 ? (
              <p className="text-sm text-[#64748b]">
                No tags available. Create tags first from the Tags page.
              </p>
            ) : availableTags.length === 0 ? (
              <p className="text-sm text-[#64748b]">
                This file already has all available tags.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTags.map((tag) => {
                  const hex = tagColorHex(tag.color);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAdd(tag)}
                      disabled={addTagToFile.isPending}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] hover:border-[#0F0A6B] hover:bg-[#0F0A6B]/5 transition-colors disabled:opacity-50 text-left"
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="flex-1 truncate">{tag.name}</span>
                      {addTagToFile.isPending ? (
                        <Loader2 size={14} className="animate-spin text-[#64748b]" />
                      ) : (
                        <Plus size={14} className="text-[#94a3b8]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
