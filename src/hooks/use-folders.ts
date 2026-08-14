"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as folderService from "../services/folder.service";
import type {
  ListFoldersParams,
  CreateFolderPayload,
  UpdateFolderPayload,
  LockFolderPayload,
  UnlockFolderPayload,
} from "../types/folder";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useFolders(
  params?: ListFoldersParams,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: ["folders", params ?? {}],
    queryFn: () => folderService.listFolders(params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
  });
}

export function useFoldersTrash(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["folders", "trash", params ?? {}],
    queryFn: () => folderService.listFoldersTrash(params),
  });
}

export function useFolder(id: number | undefined) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => folderService.getFolder(id!),
    enabled: id !== undefined && id !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => folderService.createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUpdateFolder(folderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFolderPayload) =>
      folderService.updateFolder(folderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", folderId] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useSoftDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => folderService.softDeleteFolder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
      queryClient.removeQueries({ queryKey: ["folders", id] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useRestoreFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => folderService.restoreFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
    },
  });
}

export function usePermanentDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => folderService.permanentDeleteFolder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
      queryClient.removeQueries({ queryKey: ["folders", id] });
    },
  });
}

export function useLockFolder(folderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LockFolderPayload) =>
      folderService.lockFolder(folderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", folderId] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUnlockFolder(folderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UnlockFolderPayload) =>
      folderService.unlockFolder(folderId, payload),
    onSuccess: (folder) => {
      queryClient.setQueryData(["folders", folderId], folder);
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}