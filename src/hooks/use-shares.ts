"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as shareService from "../services/share.service";
import type {
  CreateSharePayload,
  UpdateSharePayload,
  VerifySharePasswordPayload,
} from "../types/shares";

// ─── Public queries ───────────────────────────────────────────────────────────

export function usePublicShare(token: string | undefined) {
  return useQuery({
    queryKey: ["shares", "public", token],
    queryFn: () => shareService.accessPublicShare(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

// ─── Public mutations ─────────────────────────────────────────────────────────

export function useVerifySharePassword(token: string) {
  return useMutation({
    mutationFn: (payload: VerifySharePasswordPayload) =>
      shareService.verifySharePassword(token, payload),
  });
}

export function useDownloadSharedFile() {
  return useMutation({
    mutationFn: (token: string) => shareService.downloadSharedFile(token),
  });
}

// ─── Private queries (auth required) ─────────────────────────────────────────

export function useShares(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["shares", params ?? {}],
    queryFn: () => shareService.listShares(params),
  });
}

export function useShare(id: string | undefined) {
  return useQuery({
    queryKey: ["shares", id],
    queryFn: () => shareService.getShare(id!),
    enabled: Boolean(id),
  });
}

// ─── Private mutations (auth required) ───────────────────────────────────────

export function useCreateShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSharePayload) => shareService.createShare(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    },
  });
}

export function useUpdateShare(shareId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSharePayload) =>
      shareService.updateShare(shareId, payload),
    onSuccess: (share) => {
      queryClient.setQueryData(["shares", shareId], share);
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    },
  });
}

export function useDeleteShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shareService.deleteShare(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["shares", id] });
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    },
  });
}
