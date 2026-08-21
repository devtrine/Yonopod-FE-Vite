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

export function useFolder(id: string | undefined) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => folderService.getFolder(id!),
    enabled: Boolean(id),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => folderService.createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function useUpdateFolder(folderId: string) {
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
    mutationFn: (id: string) => folderService.softDeleteFolder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
      queryClient.removeQueries({ queryKey: ["folders", id] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function useRestoreFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folderService.restoreFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function usePermanentDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folderService.permanentDeleteFolder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", "trash"] });
      queryClient.removeQueries({ queryKey: ["folders", id] });
      queryClient.invalidateQueries({ queryKey: ["auth", "stats"] });
    },
  });
}

export function useLockFolder(folderId: string) {
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

export function useUnlockFolder(folderId: string) {
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