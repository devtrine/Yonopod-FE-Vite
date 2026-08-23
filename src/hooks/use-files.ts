"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as fileService from "../services/file.service";
import type { ListFilesParams, PresignUploadPayload, UpdateFilePayload } from "../types/file";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useFiles(params?: ListFilesParams) {
  return useQuery({
    queryKey: ["files", params ?? {}],
    queryFn: () => fileService.listFiles(params),
  });
}

export function useFilesTrash(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["files", "trash", params ?? {}],
    queryFn: () => fileService.listFilesTrash(params),
  });
}

export function useFile(id: string | undefined) {
  return useQuery({
    queryKey: ["files", id],
    queryFn: () => fileService.getFile(id!),
    enabled: Boolean(id),
  });
}

/**
 * Check whether the file opened in Preview has actually been uploaded,
 * by fetching the Huby `check-status` URL from the file detail response.
 * Only enabled for the file currently opened (never for list rows), and
 * keyed by file id so re-renders don't trigger duplicate requests.
 */
export function useCheckFileStatus(
  id: string | undefined,
  checkStatusUrl: string | null | undefined
) {
  return useQuery({
    queryKey: ["files", id, "check-status"],
    queryFn: () => fileService.checkFileUploadStatus(checkStatusUrl!),
    enabled:
      Boolean(id) &&
      Boolean(checkStatusUrl),
    staleTime: 1000 * 60 * 10, // 10 minutes - upload status is stable once checked
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function usePresignUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PresignUploadPayload) => fileService.presignUpload(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: (id: string) => fileService.downloadFile(id),
  });
}

export function useUpdateFile(fileId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFilePayload) => fileService.updateFile(fileId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", fileId] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
    },
  });
}

export function useSoftDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fileService.softDeleteFile(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", "trash"] });
      queryClient.removeQueries({ queryKey: ["files", id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fileService.restoreFile(id),
    onSuccess: () => {
      // Menghapus cache semua query yang diawali ["files"] (termasuk ["files", "trash", ...])
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", "trash"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function usePermanentDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fileService.permanentDeleteFile(id),
    onSuccess: (_, id) => {
      // Invalidate semua query terkait files
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", "trash"] });
      queryClient.removeQueries({ queryKey: ["files", id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}
