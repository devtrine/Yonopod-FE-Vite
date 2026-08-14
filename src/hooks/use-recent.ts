"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as recentService from "../services/recent.service";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useRecent(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["recent", params ?? {}],
    queryFn: () => recentService.listRecent(params),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useRecordAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: number) => recentService.recordAccess({ file_id: fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent"] });
    },
  });
}

export function useClearRecentHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recentService.clearRecentHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent"] });
    },
  });
}
