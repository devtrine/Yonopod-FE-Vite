import { useState } from "react";
import { Tag as TagIcon, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagFormModal } from "@/components/tags/tag-form-modal";
import { TagFilesModal } from "@/components/tags/tag-files-modal";
import { TagChip } from "@/components/tags/tag-chip";
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
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

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
    if (!confirm(`Delete tag "${tag.name}"? This will remove it from all files.`)) {
      return;
    }
    deleteTag.mutate(tag.id, {
      onSuccess: () => toast("success", "Tag deleted"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#0f172a]">Tags</h1>

            <Button
              onClick={openCreateTag}
              className="flex items-center gap-2 h-9 px-3.5 text-sm bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
            >
              <Plus size={16} />
              <span>New Tag</span>
            </Button>
          </header>

          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-[#f1f5f9] animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center">
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
                className="flex items-center gap-2 bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
              >
                <Plus size={16} />
                Create your first tag
              </Button>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => setActiveTag(tag)}
                  className="group relative flex items-center gap-3 p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
                >
                  <TagChip tag={tag} />
                  <span className="text-xs text-[#64748b] flex-shrink-0">
                    {tag.files_count ?? 0} file(s)
                  </span>

                  <div
                    className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEditTag(tag)}
                      aria-label={`Edit tag ${tag.name}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(tag)}
                      aria-label={`Delete tag ${tag.name}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      <TagFormModal
        key={formKey}
        open={formOpen}
        tag={editingTag}
        onClose={() => setFormOpen(false)}
      />
      {activeTag && (
        <TagFilesModal tag={activeTag} onClose={() => setActiveTag(null)} />
      )}
    </div>
  );
}
export default TagsPage;
