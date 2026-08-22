import { useState } from "react";
import { Tag as TagIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagSection } from "@/components/tags/tag-section";
import { TagFormModal } from "@/components/tags/tag-form-modal";
import { AddFilesToTagModal } from "@/components/tags/add-files-to-tag-modal";
import { TagPickerModal } from "@/components/tags/tag-picker-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useTags, useDeleteTag } from "@/hooks/use-tags";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { Tag } from "@/types/tags";

export function TagsPage() {
  const { data, isPending, isError } = useTags({ limit: 50 });
  const deleteTag = useDeleteTag();

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [addFilesTag, setAddFilesTag] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [manageTagsFileId, setManageTagsFileId] = useState<string | null>(null);

  const tags = data?.data ?? [];

  const openCreateTag = () => {
    setEditingTag(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const openEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const handleDelete = (tag: Tag) => {
    setTagToDelete(tag);
  };

  const confirmDelete = () => {
    if (!tagToDelete) return;
    deleteTag.mutate(tagToDelete.id, {
      onSuccess: () => {
        toast("success", "Tag deleted");
        setTagToDelete(null);
      },
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">Tags</h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                Organize your files by tags and browse representative files for each tag.
              </p>
            </div>

            <Button
              onClick={openCreateTag}
              className="flex items-center gap-2 h-9 px-3.5 text-sm bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
            >
              <Plus size={16} />
              <span>New Tag</span>
            </Button>
          </header>

          {isPending ? (
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-[#f1f5f9] animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8">
              <p className="text-sm text-red-600">
                Failed to load tags. Please try again.
              </p>
            </div>
          ) : tags.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#e2e8f0] p-8 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mx-auto mb-4">
                <TagIcon size={32} />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a] mb-2">No tags yet</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Create tags to organize your files and find them faster.
              </p>
              <Button
                onClick={openCreateTag}
                className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0] mx-auto"
              >
                <Plus size={16} />
                Create your first tag
              </Button>
            </div>
          ) : (
            <section className="flex flex-col gap-6">
              {tags.map((tag) => (
                <TagSection
                  key={tag.id}
                  tag={tag}
                  onEditTag={openEditTag}
                  onDeleteTag={handleDelete}
                  onAddFiles={(t) => setAddFilesTag(t)}
                  onManageTags={(fileId) => setManageTagsFileId(fileId)}
                />
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Tag Create/Edit Modal */}
      <TagFormModal
        key={formKey}
        open={formOpen}
        tag={editingTag}
        onClose={() => setFormOpen(false)}
      />

      {/* Add Files to Tag Modal */}
      {addFilesTag && (
        <AddFilesToTagModal
          open={Boolean(addFilesTag)}
          tag={addFilesTag}
          onClose={() => setAddFilesTag(null)}
        />
      )}

      {/* Manage Tags for File Modal */}
      {manageTagsFileId && (
        <TagPickerModal
          open={Boolean(manageTagsFileId)}
          fileId={manageTagsFileId}
          onClose={() => setManageTagsFileId(null)}
        />
      )}

      {/* Confirm Delete Tag Modal */}
      {tagToDelete && (
        <ConfirmModal
          open={Boolean(tagToDelete)}
          title={`Delete tag "${tagToDelete.name}"?`}
          description="This will remove the tag from all files. The files will not be deleted."
          confirmLabel="Delete Tag"
          isPending={deleteTag.isPending}
          onConfirm={confirmDelete}
          onClose={() => setTagToDelete(null)}
        />
      )}
    </div>
  );
}

export default TagsPage;
