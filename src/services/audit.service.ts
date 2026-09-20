import { api } from "../lib/api/client";
import type { PaginatedResponse } from "../types/api";
import type { AuditLogItem, ListAuditLogsParams } from "../types/audit";

/**
 * Mendapatkan riwayat audit log khusus aktivitas Folder.
 */
export async function listFolderLogs(
  params?: ListAuditLogsParams
): Promise<PaginatedResponse<AuditLogItem>> {
  const { data } = await api.get<PaginatedResponse<AuditLogItem>>("/logs/folders", {
    params,
  });
  return data;
}

/**
 * Mendapatkan riwayat audit log khusus aktivitas File.
 */
export async function listFileLogs(
  params?: ListAuditLogsParams
): Promise<PaginatedResponse<AuditLogItem>> {
  const { data } = await api.get<PaginatedResponse<AuditLogItem>>("/logs/files", {
    params,
  });
  return data;
}
