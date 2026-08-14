"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as tagsService from "../services/tags.service";
import type {
  ListTagsParams,
  CreateTagPayload,
  UpdateTagPayload,
} from "../types/tags";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTags(params?: ListTagsParams) {
  return useQuery({
    queryKey: ["tags", params ?? {}],
    queryFn: () => tagsService.listTags(params),
  });
}

export function useFilesByTag(tagId: number | undefined, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["tags", tagId, "files", params ?? {}],
    queryFn: () => tagsService.getFilesByTag(tagId!, params),
    enabled: Boolean(tagId),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagsService.createTag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTag(tagId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTagPayload) => tagsService.updateTag(tagId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagsService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useAddTagToFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, fileId }: { tagId: number; fileId: number }) =>
      tagsService.addTagToFile(tagId, fileId),
    onSuccess: (_, { tagId, fileId }) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags", tagId, "files"] });
      queryClient.invalidateQueries({ queryKey: ["files", fileId] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useRemoveTagFromFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, fileId }: { tagId: number; fileId: number }) =>
      tagsService.removeTagFromFile(tagId, fileId),
    onSuccess: (_, { tagId, fileId }) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags", tagId, "files"] });
      queryClient.invalidateQueries({ queryKey: ["files", fileId] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
