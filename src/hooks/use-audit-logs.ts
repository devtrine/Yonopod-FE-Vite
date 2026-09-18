"use client";

import { useQuery } from "@tanstack/react-query";
import * as auditService from "../services/audit.service";
import type { ListAuditLogsParams } from "../types/audit";

export function useFolderLogs(
  params?: ListAuditLogsParams,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: ["audit-logs", "folders", params ?? {}],
    queryFn: () => auditService.listFolderLogs(params),
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: options?.refetchInterval,
  });
}

export function useFileLogs(
  params?: ListAuditLogsParams,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: ["audit-logs", "files", params ?? {}],
    queryFn: () => auditService.listFileLogs(params),
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: options?.refetchInterval,
  });
}
