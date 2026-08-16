"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { useUpdateFolder } from "../../hooks/use-folders";
import { useUpdateFile } from "../../hooks/use-files";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

export function RenameModal() {
  const { state, closeRenameModal } = useUIStore();
  const renameModal = state.renameModal;
  const id = renameModal.id ?? "";
  const isFolder = renameModal.isFolder ?? true;

  const updateFolder = useUpdateFolder(id);
  const updateFile = useUpdateFile(id);

  const [newName, setNewName] = useState("");
  const [prevOpen, setPrevOpen] = useState(false);

  if (renameModal.open !== prevOpen) {
    setPrevOpen(renameModal.open);
    if (renameModal.open && renameModal.name) {
      setNewName(renameModal.name);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim() === renameModal.name) {
      closeRenameModal();
      return;
    }

    if (isFolder) {
      updateFolder.mutate(
        { name: newName.trim() },
        {
          onSuccess: () => {
            toast("success", "Folder renamed successfully");
            closeRenameModal();
          },
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    } else {
      updateFile.mutate(
        { name: newName.trim() },
        {
          onSuccess: () => {
            toast("success", "File renamed successfully");
            closeRenameModal();
          },
          onError: (err) => toast("error", getErrorMessage(err)),
        }
      );
    }
  };

  const isPending = updateFolder.isPending || updateFile.isPending;

  return (
    <Modal
      open={renameModal.open}
      onClose={closeRenameModal}
      title={`Rename ${isFolder ? "Folder" : "File"}`}
      description="Enter a new name."
      icon={<Edit2 size={20} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="rename-item-input"
            className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5"
          >
            New Name
          </label>
          <input
            id="rename-item-input"
            type="text"
            required
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={closeRenameModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!newName.trim() || isPending}
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {isPending ? "Renaming…" : "Rename"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
