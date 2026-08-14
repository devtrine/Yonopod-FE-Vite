import type { File } from "./file";
import type { Folder } from "./folder";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface Favorite {
  id: number;
  user_id: number;
  file_id: number | null;
  folder_id: number | null;
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
  | { file_id: number; folder_id?: never }
  | { folder_id: number; file_id?: never };
