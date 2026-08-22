"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, FileText, Loader2 } from "lucide-react";
import { useUIStore } from "../../stores/ui-store";
import { useFile, useCheckFileStatus } from "../../hooks/use-files";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { getErrorMessage } from "../../lib/api/client";

type DownloadState = "idle" | "downloading" | "success" | "error";

function FileDownloadDialogContent({
  fileId,
  fileName,
  onClose,
}: {
  fileId: string;
  fileName?: string;
  onClose: () => void;
}) {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);

  const { data: file, isPending: filePending } = useFile(fileId);
  const checkStatusUrl = file?.url?.check_status ?? null;
  const downloadUrl = file?.url?.download ?? null;
  const {
    data: checkStatus,
    isFetching: statusChecking,
    refetch: refetchStatus,
  } = useCheckFileStatus(fileId, checkStatusUrl);
  const isReady = checkStatus?.isUploaded === true;

  // Every time this dialog opens it is remounted (via `key`), so fetching
  // status on mount checks the file directly instead of relying on cached data.
  useEffect(() => {
    if (checkStatusUrl) {
      refetchStatus();
    }
  }, [checkStatusUrl, refetchStatus]);

  const handleDownload = async () => {
    if (!file || !downloadUrl) {
      toast("error", "This file is not available for download yet.");
      return;
    }

    setDownloadState("downloading");
    setProgress(0);

    try {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setDownloadState("success");
      toast("success", `Downloaded ${file.name}`);
      onClose();
    } catch (err) {
      setDownloadState("error");
      toast("error", getErrorMessage(err));
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Download File"
      description="Check the file status and download it to your device."
      icon={<Download size={20} />}
    >
      <div className="flex flex-col gap-5">
        {/* File info */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
          <div className="w-10 h-10 rounded-lg bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center flex-shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-medium text-[#0f172a] truncate"
              title={fileName}
            >
              {fileName ?? "File"}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              {file ? `.${file.extension || "file"}` : "Loading file info…"}
            </p>
          </div>
        </div>

        {/* Status / readiness */}
        {filePending || statusChecking ? (
          <div className="flex items-center gap-2 text-sm text-[#64748b]">
            <Loader2 size={16} className="animate-spin" />
            {statusChecking ? "Checking upload status…" : "Loading file info…"}
          </div>
        ) : !isReady ? (
          <div className="flex flex-col gap-2 text-sm text-[#64748b]">
            <p>
              This file is not ready to download yet. It may still be uploading
              or processing.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetchStatus()}
              disabled={statusChecking}
              className="self-start flex items-center gap-1.5"
            >
              <RefreshCw
                size={15}
                className={statusChecking ? "animate-spin" : ""}
              />
              Check Again
            </Button>
          </div>
        ) : (
          <p className="text-sm text-[#16a34a]">
            This file is ready to download.
          </p>
        )}

        {/* Progress */}
        {downloadState === "downloading" && (
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
              <div
                className="h-full bg-[#1c3fc4] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#64748b]">{progress}%</span>
          </div>
        )}

        {downloadState === "error" && (
          <p className="text-sm text-[#ef4444]">
            Failed to download the file. Please try again.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={downloadState === "downloading"}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={
              !isReady || !downloadUrl || downloadState === "downloading"
            }
            className="bg-[#1c3fc4] text-white hover:bg-[#1636b0]"
          >
            <Download size={16} />
            {downloadState === "downloading"
              ? `Downloading ${progress}%…`
              : "Download"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function FileDownloadDialog() {
  const { state, closeDownloadDialog } = useUIStore();
  const { open, fileId, fileName } = state.downloadDialog;

  if (!open || fileId === undefined) return null;

  return (
    <FileDownloadDialogContent
      key={fileId}
      fileId={fileId}
      fileName={fileName}
      onClose={closeDownloadDialog}
    />
  );
}
