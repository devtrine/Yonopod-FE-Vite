import type { File } from "./file";
import type { Folder } from "./folder";

// ─── Query params — mirrors searchSchema in BE ────────────────────────────────

export interface SearchParams {
  q?: string;
  type?: string;        // maps to file.extension in BE
  folderId?: string;
  favorite?: boolean;
  from?: string;        // ISO date
  to?: string;          // ISO date
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "size" | "created_at" | "updated_at";
  sortOrder?: "ASC" | "DESC" | "asc" | "desc";
}

// ─── Response — matches searchController data shape ───────────────────────────

export interface SearchPagination {
  page: number;
  limit: number;
  totalFiles: number;
  totalFolders: number;
}

export interface SearchResult {
  files: File[];
  folders: Folder[];
  pagination: SearchPagination;
}
