import type { Tag } from "./tags";
import type { Folder } from "./folder";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface File {
  id: number;
  user_id: number;
  folder_id: number | null;
  name: string;
  extension: string;
  size: number | null;
  file_path: string;
  thumbnail_path: string | null;
  is_favorite: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  /** Included when using getFile / listFiles */
  folder?: Folder | null;
  /** Included when using getFile / listFiles */
  tags?: Tag[];
}

/** Hub URLs returned by the backend only in the GET file detail response. */
export interface FileUrl {
  check_status: string | null;
  download: string | null;
}

/**
 * Response shape of the external Huby `check-status` endpoint
 * (`data.url.check_status`). Determines whether the file has actually
 * been uploaded and can be downloaded.
 */
export interface CheckFileStatusResponse {
  isUploaded: boolean;
}

/**
 * Shape of the GET /files/:id (detail) response.
 * The list response does not include `url`, so download availability
 * must be read from a detail request for the opened file only.
 */
export interface FileDetail extends File {
  url: FileUrl | null;
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface ListFilesParams {
  page?: number;
  limit?: number;
  folder_id?: number | null;
  extension?: string;
  search?: string;
  sort_by?: "name" | "created_at";
  order?: "ASC" | "DESC" | "asc" | "desc";
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface PresignUploadPayload {
  name: string;
  extension: string;
  folder_id?: number | null;
  size: number
}

export interface PresignUploadResponse {
  uploadUrl: string;
  file: File;
}

export interface UpdateFilePayload {
  name?: string;
  folder_id?: number | null;
  is_favorite?: boolean;
}

export interface DownloadFileResponse {
  downloadUrl: string;
}
