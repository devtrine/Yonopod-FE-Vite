import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Share,
  PublicShareResponse,
  CreateSharePayload,
  UpdateSharePayload,
  VerifySharePasswordPayload,
  DownloadSharedFileResponse,
} from "../types/shares";

// ─── Public endpoints (no auth) ──────────────────────────────────────────────

export async function accessPublicShare(token: string): Promise<PublicShareResponse> {
  const { data } = await api.get<ApiResponse<PublicShareResponse>>(
    `/shares/public/${token}`
  );
  return data.data;
}

export async function verifySharePassword(
  token: string,
  payload: VerifySharePasswordPayload
): Promise<Share> {
  const { data } = await api.post<ApiResponse<Share>>(
    `/shares/public/${token}/verify`,
    payload
  );
  return data.data;
}

export async function downloadSharedFile(
  token: string
): Promise<DownloadSharedFileResponse> {
  const { data } = await api.get<ApiResponse<DownloadSharedFileResponse>>(
    `/shares/public/${token}/download`
  );
  return data.data;
}

// ─── Private endpoints (auth required) ──────────────────────────────────────

export async function listShares(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Share>> {
  const { data } = await api.get<PaginatedResponse<Share>>("/shares", { params });
  return data;
}

export async function createShare(payload: CreateSharePayload): Promise<Share> {
  const { data } = await api.post<ApiResponse<Share>>("/shares", payload);
  return data.data;
}

export async function getShare(id: string): Promise<Share> {
  const { data } = await api.get<ApiResponse<Share>>(`/shares/${id}`);
  return data.data;
}

export async function updateShare(
  id: string,
  payload: UpdateSharePayload
): Promise<Share> {
  const { data } = await api.put<ApiResponse<Share>>(`/shares/${id}`, payload);
  return data.data;
}

export async function deleteShare(id: string): Promise<void> {
  await api.delete(`/shares/${id}`);
}
