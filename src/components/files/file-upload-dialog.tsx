"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { usePresignUpload, useSoftDeleteFile } from "../../hooks/use-files";
import { useFolders } from "../../hooks/use-folders";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";
import axios from "axios";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
}

export function FileUploadDialog() {
  const { state, closeUploadModal } = useUIStore();
  const presignUpload = usePresignUpload();
  const deleteFile = useSoftDeleteFile();
  const { data: foldersData } = useFolders(
    { limit: 100 },
    { enabled: state.uploadModalOpen, staleTime: 1000 * 60 * 10 }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(
    null
  );
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
    state.targetFolderId
  );
  const [isDragging, setIsDragging] = useState(false);

  // Sync targetFolderId when modal opens
  const activeFolderId =
    selectedFolderId !== null ? selectedFolderId : state.targetFolderId;

  const handleFileSelect = (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;
    const file = selected[0];
    setUploadingFile({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "pending",
    });
  };

  const removeFile = () => {
    setUploadingFile(null);
  };

  const handleUploadAll = async () => {
    if (!uploadingFile) return;

    const item = uploadingFile;
    setUploadingFile((prev) =>
      prev ? { ...prev, status: "uploading", progress: 10 } : prev
    );

    let presignedFileId: number | null = null;

    try {
      const nameParts = item.file.name.split(".");
      const ext = nameParts.length > 1 ? nameParts.pop()! : "";
      const nameWithoutExt = nameParts.join(".");

      // 1. Presign request
      const presignRes = await presignUpload.mutateAsync({
        name: nameWithoutExt || item.file.name,
        extension: ext,
        folder_id: activeFolderId,
        size: item.file.size
      });

      presignedFileId = presignRes.file.id;

      setUploadingFile((prev) =>
        prev ? { ...prev, progress: 50 } : prev
      );

      // 2. Upload directly to storage URL as multipart form-data (key: file)
      const formData = new FormData();
      formData.append("file", item.file);

      await axios.put(presignRes.uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadingFile((prev) =>
              prev
                ? { ...prev, progress: Math.max(50, percent) }
                : prev
            );
          }
        },
      });

      setUploadingFile((prev) =>
        prev ? { ...prev, status: "success", progress: 100 } : prev
      );
    } catch (err) {
      let errorMsg = getErrorMessage(err);

      if (presignedFileId !== null) {
        try {
          await deleteFile.mutateAsync(presignedFileId);
        } catch {
          // best-effort cleanup, ignore failures
        }
        if (axios.isAxiosError(err) && !err.response) {
          errorMsg =
            "Could not reach the storage server. The presigned upload URL host may not be reachable from your browser.";
        } else {
          errorMsg = `Storage upload failed: ${errorMsg}`;
        }
      }

      setUploadingFile((prev) =>
        prev
          ? { ...prev, status: "error", progress: 0, errorMessage: errorMsg }
          : prev
      );
      toast("error", `Failed to upload ${item.file.name}: ${errorMsg}`);
      return;
    }

    toast("success", "Upload process completed");
  };

  const handleClose = () => {
    if (uploadingFile?.status === "uploading") {
      const confirmClose = window.confirm(
        "Upload is in progress. Are you sure you want to cancel?"
      );
      if (!confirmClose) return;
    }
    setUploadingFile(null);
    closeUploadModal();
  };

  const folders = foldersData?.data ?? [];

  return (
    <Modal
      open={state.uploadModalOpen}
      onClose={handleClose}
      title="Upload Files"
      description="Select or drag files to upload to your drive."
      icon={<Upload size={20} />}
    >
      <div className="flex flex-col gap-5">
        {/* Destination folder selection */}
        <div>
          <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5">
            Destination Folder
          </label>
          <select
            value={activeFolderId ?? ""}
            onChange={(e) =>
              setSelectedFolderId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            aria-label="Select destination folder"
            className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#1c3fc4]"
          >
            <option value="">Root (My Drive)</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.path}
              </option>
            ))}
          </select>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={[
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3",
            isDragging
              ? "border-[#1c3fc4] bg-[#eff1fb]"
              : "border-[#cbd5e1] hover:border-[#94a3b8] bg-[#f8fafc]",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            aria-label="File input"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div className="w-12 h-12 rounded-full bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">
              Click to select a file or drag and drop
            </p>
            <p className="text-xs text-[#64748b] mt-1">
              Supports any file type up to your storage limit
            </p>
          </div>
        </div>

        {/* Selected file */}
        {uploadingFile && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Selected File
              </span>
              <button
                type="button"
                onClick={removeFile}
                className="text-xs text-[#64748b] hover:text-[#ef4444] transition-colors"
              >
                Remove
              </button>
            </div>

            <div
              key={uploadingFile.id}
              className="flex items-center justify-between p-3 rounded-xl border border-[#e2e8f0] bg-white gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="text-sm font-medium text-[#0f172a] truncate"
                      title={uploadingFile.file.name}
                    >
                      {uploadingFile.file.name}
                    </span>
                    <span className="text-xs text-[#64748b] flex-shrink-0">
                      {uploadingFile.status === "uploading" &&
                        `${uploadingFile.progress}%`}
                      {uploadingFile.status === "success" && "Uploaded"}
                      {uploadingFile.status === "error" && "Failed"}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className={[
                        "h-full transition-all duration-300",
                        uploadingFile.status === "success"
                          ? "bg-[#16a34a]"
                          : uploadingFile.status === "error"
                          ? "bg-[#ef4444]"
                          : "bg-[#1c3fc4]",
                      ].join(" ")}
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {uploadingFile.status === "success" ? (
                  <CheckCircle2 size={18} className="text-[#16a34a]" />
                ) : uploadingFile.status === "error" ? (
                  <AlertCircle
                    size={18}
                    className="text-[#ef4444]"
                    aria-label={uploadingFile.errorMessage}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={uploadingFile.status === "uploading"}
                    aria-label="Remove file"
                    className="text-[#94a3b8] hover:text-[#0f172a] p-1 rounded-md transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploadingFile?.status === "uploading"}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleUploadAll}
            disabled={
              !uploadingFile ||
              uploadingFile.status === "success" ||
              uploadingFile.status === "uploading" ||
              presignUpload.isPending
            }
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            {uploadingFile?.status === "uploading"
              ? "Uploading…"
              : "Upload File"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}