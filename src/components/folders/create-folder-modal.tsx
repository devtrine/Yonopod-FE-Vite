"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { useCreateFolder } from "../../hooks/use-folders";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

export function CreateFolderModal() {
  const { state, closeCreateFolderModal } = useUIStore();
  const createFolder = useCreateFolder();
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    createFolder.mutate(
      {
        name: folderName.trim(),
        parent_id: state.createFolderParentId,
      },
      {
        onSuccess: () => {
          toast("success", "Folder created successfully");
          setFolderName("");
          closeCreateFolderModal();
        },
        onError: (err) => {
          toast("error", getErrorMessage(err));
        },
      }
    );
  };

  return (
    <Modal
      open={state.createFolderModalOpen}
      onClose={() => {
        setFolderName("");
        closeCreateFolderModal();
      }}
      title="Create New Folder"
      description="Enter a name for your new folder."
      icon={<FolderPlus size={20} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="folder-name-input"
            className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5"
          >
            Folder Name
          </label>
          <input
            id="folder-name-input"
            type="text"
            required
            autoFocus
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. Projects, Invoices, Personal"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#1c3fc4]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFolderName("");
              closeCreateFolderModal();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!folderName.trim() || createFolder.isPending}
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {createFolder.isPending ? "Creating…" : "Create Folder"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
