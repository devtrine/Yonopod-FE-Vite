import type { File } from "./file";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface RecentFile {
  id: number;
  user_id: number;
  file_id: number;
  accessed_at: string;
  file: File & {
    folder?: { id: number; name: string; is_locked: boolean } | null;
  };
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface RecordAccessPayload {
  file_id: number;
}
