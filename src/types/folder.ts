import type { File } from "./file";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface Folder {
  id: number;
  user_id: number;
  parent_id: number | null;
  name: string;
  path: string;
  is_locked: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  /** Included on getFolder when unlocked */
  Children?: Folder[];
  /** Included on getFolder when unlocked */
  Files?: File[];
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface ListFoldersParams {
  parent_id?: number | null;
  page?: number;
  limit?: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateFolderPayload {
  name: string;
  parent_id?: number | null;
}

export interface UpdateFolderPayload {
  name?: string;
  parent_id?: number | null;
}

export interface LockFolderPayload {
  vault_password: string;
}

export interface UnlockFolderPayload {
  vault_password: string;
}
