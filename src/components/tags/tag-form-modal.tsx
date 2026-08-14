"use client";

import { useState } from "react";
import { Tag as TagIcon } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import { useCreateTag, useUpdateTag } from "../../hooks/use-tags";
import type { Tag } from "../../types/tags";

const TAG_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#64748b",
];

export function TagFormModal({
  open,
  tag,
  onClose,
}: {
  open: boolean;
  tag: Tag | null;
  onClose: () => void;
}) {
  const isEdit = Boolean(tag);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag(tag?.id ?? 0);
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState<string>(tag?.color ?? TAG_COLORS[3]);

  const isPending = createTag.isPending || updateTag.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: name.trim(), color };
    if (!payload.name) return;

    const onSuccess = () => {
      toast("success", isEdit ? "Tag updated" : "Tag created");
      onClose();
    };
    const onError = (err: unknown) => toast("error", getErrorMessage(err));

    if (isEdit && tag) {
      updateTag.mutate(payload, { onSuccess, onError });
    } else {
      createTag.mutate(payload, { onSuccess, onError });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Tag" : "Create Tag"}
      description={
        isEdit
          ? "Update the name or color of your tag."
          : "Create a tag to organize and quickly find your files."
      }
      icon={<TagIcon size={20} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="tag-name-input"
            className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5"
          >
            Tag Name
          </label>
          <input
            id="tag-name-input"
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work, Personal, Important"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-2">
            Color
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {TAG_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                className={[
                  "w-8 h-8 rounded-full transition-transform",
                  color === c
                    ? "ring-2 ring-offset-2 ring-[#1c3fc4] scale-110"
                    : "hover:scale-110",
                ].join(" ")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Tag"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
