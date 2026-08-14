// ─── Entity types ────────────────────────────────────────────────────────────

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  color: string | null;
  created_at: string;
  /** Included in listTags — aggregated count of files tagged */
  files_count?: number;
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface ListTagsParams {
  page?: number;
  limit?: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateTagPayload {
  name: string;
  color?: string | null;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string | null;
}
