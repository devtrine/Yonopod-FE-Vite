import type { File } from "./file";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface RecentFile {
  id: string;
  user_id: string;
  file_id: string;
  accessed_at: string;
  file: File & {
    folder?: { id: string; name: string; is_locked: boolean } | null;
  };
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface RecordAccessPayload {
  file_id: string;
}
