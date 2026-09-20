import type { File } from "./file";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface FolderSizeInfo {
  total_bytes?: number;
  totalBytes?: number;
  formatted_size?: string;
  formattedSize?: string;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  path: string;
  is_locked: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  /** Included from Folder Size Analyzer */
  size_info?: FolderSizeInfo;
  /** Included on getFolder when unlocked */
  Children?: Folder[];
  /** Included on getFolder when unlocked */
  Files?: File[];
}

export function getFolderFormattedSize(folder?: Folder | null): string | undefined {
  if (!folder) return undefined;
  return folder.size_info?.formatted_size;
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface ListFoldersParams {
  parent_id?: string | null;
  page?: number;
  limit?: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateFolderPayload {
  name: string;
  parent_id?: string | null;
}

export interface UpdateFolderPayload {
  name?: string;
  parent_id?: string | null;
}

export interface LockFolderPayload {
  vault_password: string;
}

export interface UnlockFolderPayload {
  vault_password: string;
}
