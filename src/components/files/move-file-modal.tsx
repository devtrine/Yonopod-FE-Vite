"use client";

import { useState, useMemo } from "react";
import { FolderInput, Folder, HardDrive, Check, Search, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { useFolders } from "../../hooks/use-folders";
import * as fileService from "../../services/file.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

export function MoveFileModal() {
  const { state, closeMoveModal } = useUIStore();
  const { open, fileIds, fileNames, currentFolderId } = state.moveModal;
  const queryClient = useQueryClient();

  const { data: foldersData, isLoading } = useFolders(
    { limit: 100 },
    { enabled: open }
  );

  const [search, setSearch] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const folders = foldersData?.data ?? [];

  const filteredFolders = useMemo(() => {
    if (!search.trim()) return folders;
    const q = search.toLowerCase();
    return folders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.path && f.path.toLowerCase().includes(q))
    );
  }, [folders, search]);

  const isCurrentTarget = (targetId: string | null) => {
    if (currentFolderId === undefined) return false;
    return (currentFolderId || null) === targetId;
  };

  const handleMove = async () => {
    if (fileIds.length === 0) return;
    if (isCurrentTarget(selectedTargetId)) {
      toast("error", "File is already in this folder");
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.all(
        fileIds.map((id) =>
          fileService.updateFile(id, { folder_id: selectedTargetId })
        )
      );

      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });

      const targetFolderName =
        selectedTargetId === null
          ? "My Drive (Root)"
          : folders.find((f) => f.id === selectedTargetId)?.name || "target folder";

      toast(
        "success",
        fileIds.length === 1
          ? `Moved "${fileNames[0] || "file"}" to ${targetFolderName}`
          : `Moved ${fileIds.length} files to ${targetFolderName}`
      );

      closeMoveModal();
    } catch (err) {
      toast("error", getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    fileIds.length === 1
      ? `Move "${fileNames[0] || "File"}"`
      : `Move ${fileIds.length} Files`;

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isSubmitting) closeMoveModal();
      }}
      title={title}
      description="Choose a destination folder for the selected file(s)."
      icon={<FolderInput size={20} />}
      size="md"
    >
      <div className="flex flex-col gap-3">
        {/* Search folder input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search folders..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#0F0A6B]"
          />
        </div>

        {/* Folder list container */}
        <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto border border-[#e2e8f0] rounded-xl p-1.5 bg-[#f8fafc]/50">
          {/* Root option */}
          <button
            type="button"
            onClick={() => setSelectedTargetId(null)}
            disabled={isCurrentTarget(null)}
            className={[
              "flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all",
              isCurrentTarget(null)
                ? "opacity-50 cursor-not-allowed bg-transparent text-[#94a3b8]"
                : selectedTargetId === null
                ? "bg-[#0F0A6B] text-white font-medium shadow-sm"
                : "text-[#1e293b] hover:bg-white hover:shadow-xs",
            ].join(" ")}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <HardDrive
                size={16}
                className={
                  selectedTargetId === null && !isCurrentTarget(null)
                    ? "text-white"
                    : "text-[#64748b]"
                }
              />
              <span className="truncate">My Drive (Root)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {isCurrentTarget(null) && (
                <span className="text-xs bg-[#e2e8f0] text-[#64748b] px-2 py-0.5 rounded-full font-normal">
                  Current
                </span>
              )}
              {selectedTargetId === null && !isCurrentTarget(null) && (
                <Check size={16} className="text-white flex-shrink-0" />
              )}
            </div>
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-sm text-[#64748b] gap-2">
              <Loader2 size={16} className="animate-spin text-[#0F0A6B]" />
              <span>Loading folders...</span>
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#94a3b8]">
              {search ? "No folders match your search" : "No other folders available"}
            </div>
          ) : (
            filteredFolders.map((folder) => {
              const isSelected = selectedTargetId === folder.id;
              const isCurrent = isCurrentTarget(folder.id);

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedTargetId(folder.id)}
                  disabled={isCurrent}
                  className={[
                    "flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all",
                    isCurrent
                      ? "opacity-50 cursor-not-allowed bg-transparent text-[#94a3b8]"
                      : isSelected
                      ? "bg-[#0F0A6B] text-white font-medium shadow-sm"
                      : "text-[#1e293b] hover:bg-white hover:shadow-xs",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Folder
                      size={16}
                      className={
                        isSelected && !isCurrent
                          ? "text-white"
                          : "text-[#0F0A6B]"
                      }
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{folder.name}</span>
                      {folder.path && (
                        <span
                          className={[
                            "text-[11px] truncate",
                            isSelected && !isCurrent
                              ? "text-white/80"
                              : "text-[#94a3b8]",
                          ].join(" ")}
                        >
                          {folder.path}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCurrent && (
                      <span className="text-xs bg-[#e2e8f0] text-[#64748b] px-2 py-0.5 rounded-full font-normal">
                        Current
                      </span>
                    )}
                    {isSelected && !isCurrent && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeMoveModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleMove}
            disabled={isSubmitting || isCurrentTarget(selectedTargetId)}
            className="bg-[#0F0A6B] text-white hover:bg-[#161282]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={14} className="animate-spin" />
                Moving…
              </span>
            ) : (
              "Move Here"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
