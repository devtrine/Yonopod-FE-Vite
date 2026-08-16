import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Folder,
  ListFoldersParams,
  CreateFolderPayload,
  UpdateFolderPayload,
  LockFolderPayload,
  UnlockFolderPayload,
} from "../types/folder";

export async function listFolders(params?: ListFoldersParams): Promise<PaginatedResponse<Folder>> {
  const { data } = await api.get<PaginatedResponse<Folder>>("/folders", { params });
  return data;
}

export async function listFoldersTrash(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Folder>> {
  const { data } = await api.get<PaginatedResponse<Folder>>("/folders/trash", { params });
  return data;
}

export async function getFolder(id: string): Promise<Folder> {
  const { data } = await api.get<ApiResponse<Folder>>(`/folders/${id}`);
  return data.data;
}

export async function createFolder(payload: CreateFolderPayload): Promise<Folder> {
  const { data } = await api.post<ApiResponse<Folder>>("/folders", payload);
  return data.data;
}

export async function updateFolder(id: string, payload: UpdateFolderPayload): Promise<Folder> {
  const { data } = await api.put<ApiResponse<Folder>>(`/folders/${id}`, payload);
  return data.data;
}

export async function softDeleteFolder(id: string): Promise<void> {
  await api.delete(`/folders/${id}`);
}

export async function restoreFolder(id: string): Promise<void> {
  await api.post(`/folders/${id}/restore`);
}

export async function permanentDeleteFolder(id: string): Promise<void> {
  await api.delete(`/folders/${id}/permanent`);
}

export async function lockFolder(id: string, payload: LockFolderPayload): Promise<void> {
  await api.post(`/folders/${id}/lock`, payload);
}

export async function unlockFolder(id: string, payload: UnlockFolderPayload): Promise<Folder> {
  const { data } = await api.post<ApiResponse<Folder>>(`/folders/${id}/unlock`, payload);
  return data.data;
}
