import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Tag,
  ListTagsParams,
  CreateTagPayload,
  UpdateTagPayload,
} from "../types/tags";
import type { File } from "../types/file";

export async function listTags(params?: ListTagsParams): Promise<PaginatedResponse<Tag>> {
  const { data } = await api.get<PaginatedResponse<Tag>>("/tags", { params });
  return data;
}

export async function createTag(payload: CreateTagPayload): Promise<Tag> {
  const { data } = await api.post<ApiResponse<Tag>>("/tags", payload);
  return data.data;
}

export async function updateTag(id: string, payload: UpdateTagPayload): Promise<Tag> {
  const { data } = await api.put<ApiResponse<Tag>>(`/tags/${id}`, payload);
  return data.data; 
}

export async function deleteTag(id: string): Promise<void> {
  await api.delete(`/tags/${id}`);
}

export async function addTagToFile(tagId: string, fileId: string): Promise<void> {
  await api.post(`/tags/${tagId}/files/${fileId}`);
}

export async function removeTagFromFile(tagId: string, fileId: string): Promise<void> {
  await api.delete(`/tags/${tagId}/files/${fileId}`);
}

export async function getFilesByTag(
  tagId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<File>> {
  const { data } = await api.get<PaginatedResponse<File>>(
    `/tags/${tagId}/files`,
    { params }
  );
  return data;
}
