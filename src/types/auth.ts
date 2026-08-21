// ─── Entity types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  storage_quota?: string | number;
  storage_used: string | number;
  role?: string;
  is_active: boolean;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserStats {
  files: number;
  folders: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
