"use client";

import { useMemo, useState } from "react";
import { Tag as TagIcon, FileText, Check, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import { useAddTagToFile, useFilesByTag } from "../../hooks/use-tags";
import { useFiles } from "../../hooks/use-files";
import { tagColorHex, tagSoftBackground } from "./tag-chip";
import type { Tag } from "../../types/tags";

export function AddFilesToTagModal({
  open,
  tag,
  onClose,
}: {
  open: boolean;
  tag: Tag | null;
  onClose: () => void;
}) {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const { data: tagFilesData } = useFilesByTag(open && tag ? tag.id : undefined, { limit: 100 });
  const { data: allFilesData, isPending: allFilesLoading } = useFiles({ limit: 100 });
  const addTagToFile = useAddTagToFile();

  const tagFiles = useMemo(() => tagFilesData?.data ?? [], [tagFilesData]);
  const tagFileIds = useMemo(() => new Set(tagFiles.map((f) => f.id)), [tagFiles]);
  const availableFiles = useMemo(
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
      toast("success", `Added tag "${tag.name}" to ${ids.length} file(s)`);
      setSelectedFileIds([]);
      onClose();
    } catch (err) {
      toast("error", getErrorMessage(err));
    }
  };

  const handleClose = () => {
    setSelectedFileIds([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Add Files to "${tag.name}"`}
      description="Choose files to attach this tag to."
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
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddFiles}
            disabled={selectedFileIds.length === 0 || adding}
            className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Add Selected ({selectedFileIds.length})
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">
            Available Files
          </p>
          <p className="text-xs text-[#64748b] mt-0.5">
            Files already containing this tag are excluded.
          </p>
        </div>

        <div className="max-h-72 overflow-y-auto border border-[#e2e8f0] rounded-xl divide-y divide-[#f1f5f9]">
          {allFilesLoading ? (
            <div className="p-4 text-center text-sm text-[#64748b]">
              Loading files…
            </div>
          ) : availableFiles.length === 0 ? (
            <div className="p-6 text-center">
              <FileText size={20} className="mx-auto text-[#94a3b8] mb-2" />
              <p className="text-sm text-[#64748b]">
                No files available to add.
              </p>
            </div>
          ) : (
            availableFiles.map((file) => (
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
      </div>
    </Modal>
  );
}
