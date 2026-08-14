import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { RecentFile, RecordAccessPayload } from "../types/recent";

export async function listRecent(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<RecentFile>> {
  const { data } = await api.get<PaginatedResponse<RecentFile>>("/recent", { params });
  return data;
}

export async function recordAccess(payload: RecordAccessPayload): Promise<RecentFile> {
  const { data } = await api.post<ApiResponse<RecentFile>>("/recent", payload);
  return data.data;
}

export async function clearRecentHistory(): Promise<void> {
  await api.delete("/recent");
}
