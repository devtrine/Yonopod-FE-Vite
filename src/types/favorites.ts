import type { File } from "./file";
import type { Folder } from "./folder";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  user_id: string;
  file_id: string | null;
  folder_id: string | null;
  created_at: string;
  file?: File | null;
  folder?: Folder | null;
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface ListFavoritesParams {
  page?: number;
  limit?: number;
  type?: "file" | "folder";
}

// ─── Request types ────────────────────────────────────────────────────────────

/** Exactly one of file_id or folder_id must be provided */
export type AddFavoritePayload =
  | { file_id: string; folder_id?: never }
  | { folder_id: string; file_id?: never };
