import type { File } from "./file";
import type { Folder } from "./folder";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface Share {
  id: string;
  user_id: string;
  file_id: string | null;
  folder_id: string | null;
  share_token: string;
  share_type: "link" | "form";
  permission: "read_only" | "read_write";
  download_limit: number | null;
  download_count: number;
  expires_at: string | null;
  created_at: string;
  file?: File | null;
  folder?: Folder | null;
}

/** Public share response — password is excluded, requiresPassword may be true */
export type PublicShareResponse =
  | { requiresPassword: true }
  | (Omit<Share, "password"> & { requiresPassword?: false });

// ─── Request types ────────────────────────────────────────────────────────────

/** Exactly one of file_id or folder_id must be provided */
export type CreateSharePayload =
  | {
      file_id: string;
      folder_id?: never;
      share_type?: "link" | "form";
      password?: string | null;
      permission?: "read_only" | "read_write";
      download_limit?: number | null;
      expires_at?: string | null;
    }
  | {
      folder_id: string;
      file_id?: never;
      share_type?: "link" | "form";
      password?: string | null;
      permission?: "read_only" | "read_write";
      download_limit?: number | null;
      expires_at?: string | null;
    };

export interface UpdateSharePayload {
  password?: string | null;
  permission?: "read_only" | "read_write";
  download_limit?: number | null;
  expires_at?: string | null;
}

export interface VerifySharePasswordPayload {
  password: string;
}

export interface DownloadSharedFileResponse {
  downloadUrl: string;
}
