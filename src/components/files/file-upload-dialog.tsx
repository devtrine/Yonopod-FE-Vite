"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import Dashboard from "@uppy/react/dashboard";
import { useQueryClient } from "@tanstack/react-query";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/ui-store";
import { useFolders } from "../../hooks/use-folders";
import { useS3Config } from "../../hooks/use-files";
import * as fileService from "../../services/file.service";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

export function FileUploadDialog() {
  const { state, closeUploadModal } = useUIStore();
  const queryClient = useQueryClient();

  const { data: foldersData } = useFolders(
    { limit: 100 },
    { enabled: state.uploadModalOpen, staleTime: 1000 * 60 * 10 }
  );

  const {
    data: s3Config,
    isLoading: isS3ConfigLoading,
    isError: isS3ConfigError,
    refetch: refetchS3Config,
  } = useS3Config({ enabled: state.uploadModalOpen });

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    state.targetFolderId
  );
  const [uppy, setUppy] = useState<Uppy | null>(null);

  // Keep ref synchronized to always have latest destination folder in callbacks
  const activeFolderId =
    selectedFolderId !== null ? selectedFolderId : state.targetFolderId;
  const activeFolderIdRef = useRef<string | null>(activeFolderId);

  useEffect(() => {
    activeFolderIdRef.current = activeFolderId;
  }, [activeFolderId]);

  // Sync folder selection when modal opens
  useEffect(() => {
    if (state.uploadModalOpen) {
      setSelectedFolderId(state.targetFolderId);
    }
  }, [state.uploadModalOpen, state.targetFolderId]);

  // Initialize Uppy instance when modal is open and S3 config is ready
  useEffect(() => {
    if (!state.uploadModalOpen || !s3Config) {
      return;
    }

    const instance = new Uppy({
      id: "yonopod-uppy-uploader",
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 20,
      },
    });

    instance.use(AwsS3, {
      getChunkSize: () => s3Config.multipart_chunksize_bytes,
      shouldUseMultipart: (file) =>
        (file.size || 0) > s3Config.multipart_threshold_bytes,
      limit: 4,
      signRequest: async (request) => {
        return await fileService.signS3Request({
          method: request.method,
          key: request.key,
          uploadId: "uploadId" in request ? request.uploadId : null,
          partNumber: "partNumber" in request ? request.partNumber : null,
        });
      },
    });

    instance.on("upload-success", async (file, response) => {
      if (!file) return;
      try {
        const body = response.body as { key?: string } | undefined;
        const fileKey =
          body?.key ||
          (file as unknown as { s3Multipart?: { key?: string } })
            .s3Multipart?.key ||
          (file.meta?.key as string | undefined) ||
          file.name;

        await fileService.confirmUpload({
          key: fileKey,
          name: file.name,
          extension:
            (file.extension as string) ||
            (file.name.includes(".") ? file.name.split(".").pop() : ""),
          size: file.size || 0,
          folder_id: activeFolderIdRef.current,
        });

        instance.info(`File ${file.name} successfully saved!`, "success", 3000);
      } catch (err) {
        console.error("Failed to confirm upload:", err);
        const errorMsg = getErrorMessage(err);
        instance.info(`Failed to save ${file.name}: ${errorMsg}`, "error", 5000);
        toast("error", `Failed to save ${file.name}: ${errorMsg}`);
      }
    });

    instance.on("complete", (result) => {
      if (result.successful && result.successful.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["files"] });
        queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
        queryClient.invalidateQueries({ queryKey: ["recent"] });
        toast(
          "success",
          `${result.successful.length} file(s) uploaded successfully`
        );
      }
      if (result.failed && result.failed.length > 0) {
        toast("error", `${result.failed.length} file(s) failed to upload`);
      }
    });

    instance.on("upload-error", (file, error) => {
      console.error(`Upload error for ${file?.name}:`, error);
      toast(
        "error",
        `Upload failed for ${file?.name}: ${error?.message || "Unknown error"}`
      );
    });

    setUppy(instance);

    return () => {
      instance.destroy();
      setUppy(null);
    };
  }, [state.uploadModalOpen, s3Config, queryClient]);

  const handleClose = () => {
    if (uppy) {
      const files = uppy.getFiles();
      const isUploading = files.some(
        (f) => f.progress?.uploadStarted && !f.progress?.uploadComplete
      );
      if (isUploading) {
        const confirmClose = window.confirm(
          "Upload is currently in progress. Are you sure you want to cancel?"
        );
        if (!confirmClose) return;
        uppy.cancelAll();
      }
    }
    closeUploadModal();
  };

  const folders = foldersData?.data ?? [];

  return (
    <Modal
      open={state.uploadModalOpen}
      onClose={handleClose}
      title="Upload Files"
      description="Select or drag files to upload to your drive via high-performance S3 storage."
      icon={<Upload size={20} />}
      size="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Destination folder selection */}
        <div>
          <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1.5">
            Destination Folder
          </label>
          <select
            value={activeFolderId ?? ""}
            onChange={(e) => setSelectedFolderId(e.target.value || null)}
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

        {/* Uppy Dashboard UI container */}
        <div className="w-full rounded-xl overflow-hidden min-h-[380px] bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-center">
          {isS3ConfigLoading && (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-[#64748b]">
              <Loader2 className="animate-spin text-[#1c3fc4]" size={28} />
              <span className="text-sm font-medium">
                Memuat konfigurasi upload S3...
              </span>
            </div>
          )}

          {isS3ConfigError && (
            <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
              <AlertCircle className="text-[#ef4444]" size={32} />
              <p className="text-sm text-[#0f172a] font-medium">
                Gagal memuat konfigurasi upload S3.
              </p>
              <p className="text-xs text-[#64748b]">
                Pastikan server backend Yono sedang berjalan.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchS3Config()}
                className="mt-2 text-xs"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {s3Config && uppy && (
            <Dashboard
              uppy={uppy}
              width="100%"
              height={380}
              hideProgressDetails={false}
              proudlyDisplayPoweredByUppy={false}
              note={`Batas per sesi: 20 file. Upload multipart aktif untuk file > ${(
                s3Config.multipart_threshold_bytes /
                (1024 * 1024)
              ).toFixed(0)}MB.`}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}