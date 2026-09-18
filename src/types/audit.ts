export type AuditEvent = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'DOWNLOAD' | 'MOVE';

export interface AuditUser {
  id: string;
  username: string;
  email: string;
}

export interface AuditTargetFolder {
  id: string;
  name: string;
}

export interface AuditTargetFile {
  id: string;
  name: string;
}

export interface AuditLogItem {
  id: string;
  user_id: string;
  folder_id: string | null;
  file_id: string | null;
  event: AuditEvent;
  message: string;
  created_at: string;
  updated_at: string;
  user?: AuditUser;
  folder?: AuditTargetFolder | null;
  file?: AuditTargetFile | null;
}

export interface ListAuditLogsParams {
  page?: number;
  limit?: number;
}
