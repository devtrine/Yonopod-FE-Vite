"use client";

import { FileUploadDialog } from "../files/file-upload-dialog";
import { FileDownloadDialog } from "../files/file-download-dialog";
import { CreateFolderModal } from "../folders/create-folder-modal";
import { RenameModal } from "../folders/rename-modal";
import { LockUnlockModal } from "../folders/lock-unlock-modal";
import { FilePreviewModal } from "../files/preview/file-preview-modal";

export function DashboardModals() {
  return (
    <>
      <FileUploadDialog />
      <FileDownloadDialog />
      <CreateFolderModal />
      <RenameModal />
      <LockUnlockModal />
      <FilePreviewModal />
    </>
  );
}
