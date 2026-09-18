import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  File,
  FileDetail,
  ListFilesParams,
  S3Config,
  S3PresignPayload,
  S3PresignResponse,
  ConfirmUploadPayload,
  UpdateFilePayload,
  DownloadFileResponse,
  CheckFileStatusResponse,
} from "../types/file";

export async function listFiles(params?: ListFilesParams): Promise<PaginatedResponse<File>> {
  const { data } = await api.get<PaginatedResponse<File>>("/files", { params });
  return data;
}

export async function listFilesTrash(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<File>> {
  const { data } = await api.get<PaginatedResponse<File>>("/files/trash", { params });
  return data;
}

export async function getFile(id: string): Promise<FileDetail> {
  const { data } = await api.get<ApiResponse<FileDetail>>(`/files/${id}`);
  return data.data;
}

export async function getS3Config(): Promise<S3Config> {
  const { data } = await api.get<ApiResponse<S3Config>>("/files/s3/config");
  return data.data;
}

export async function signS3Request(payload: S3PresignPayload): Promise<S3PresignResponse> {
  const { data } = await api.post<ApiResponse<S3PresignResponse> & { url?: string; key?: string }>(
    "/files/s3/presign",
    payload
  );
  return {
    url: data.data?.url ?? data.url ?? "",
    key: data.data?.key ?? data.key ?? payload.key,
  };
}

export async function confirmUpload(payload: ConfirmUploadPayload): Promise<File> {
  const { data } = await api.post<ApiResponse<File>>("/files/confirm-upload", payload);
  return data.data;
}

export async function downloadFile(id: string): Promise<DownloadFileResponse> {
  const { data } = await api.get<ApiResponse<DownloadFileResponse>>(
    `/files/${id}/download`
  );
  return data.data;
}

/**
 * Fetch the external Huby `check-status` signed URL obtained from the
 * GET file detail response (`url.check_status`) to determine whether the
 * file has actually been uploaded. Fetched directly (not via the API
 * client) because the URL points to the Huby host and is already signed.
 */
export async function checkFileUploadStatus(
  checkStatusUrl: string
): Promise<CheckFileStatusResponse> {
  const res = await fetch(checkStatusUrl, 
    
    // agar mendapatkan fresh data dari hubby
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to check upload status (${res.status})`);
  }

  const json: unknown = await res.json();
  const body =
    typeof json === "object" && json !== null
      ? (json as { isUploaded?: unknown; data?: { isUploaded?: unknown } })
      : {};

  const isUploaded = body.isUploaded ?? body.data?.isUploaded ?? false;
  return { isUploaded: Boolean(isUploaded) };
}

export async function updateFile(id: string, payload: UpdateFilePayload): Promise<File> {
  const { data } = await api.put<ApiResponse<File>>(`/files/${id}`, payload);
  return data.data;
}

export async function softDeleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}`);
}

export async function restoreFile(id: string): Promise<void> {
  await api.post(`/files/${id}/restore`);
}

export async function permanentDeleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}/permanent`);
}
