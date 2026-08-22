"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as favoritesService from "../services/favorites.service";
import type { PaginatedResponse } from "../types/api";
import type { File as ApiFile, FileDetail } from "../types/file";
import type { ListFavoritesParams, AddFavoritePayload, Favorite } from "../types/favorites";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useFavorites(params?: ListFavoritesParams) {
  return useQuery({
    queryKey: ["favorites", params ?? {}],
    queryFn: () => favoritesService.listFavorites(params),
  });
}

/** Builds lookup maps for favorite records by file_id and folder_id. */
export function useFavoriteMaps(limit = 100) {
  const queryResult = useFavorites({ limit });
  const { data } = queryResult;
  const maps = useMemo(() => {
    const fileMap = new Map<string, Favorite>();
    const folderMap = new Map<string, Favorite>();
    for (const fav of data?.data ?? []) {
      if (fav.file_id != null) fileMap.set(fav.file_id, fav);
      if (fav.folder_id != null) folderMap.set(fav.folder_id, fav);
    }
    return { fileMap, folderMap };
  }, [data]);

  return { ...queryResult, ...maps };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddFavoritePayload) =>
      favoritesService.addFavorite(payload),
    onMutate: async (newFav) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousFavorites = queryClient.getQueriesData<PaginatedResponse<Favorite>>({
        queryKey: ["favorites"],
      });

      // Optimistically update all ["favorites"] queries
      queryClient.setQueriesData<PaginatedResponse<Favorite>>(
        { queryKey: ["favorites"] },
        (old) => {
          if (!old) return old;
          const tempFav: Favorite = {
            id: `temp-${Date.now()}`,
            user_id: "",
            file_id: newFav.file_id ?? null,
            folder_id: newFav.folder_id ?? null,
            created_at: new Date().toISOString(),
          };
          return {
            ...old,
            data: [tempFav, ...old.data],
            pagination: old.pagination
              ? {
                  ...old.pagination,
                  total: old.pagination.total + 1,
                  totalPages: Math.max(
                    1,
                    Math.ceil((old.pagination.total + 1) / (old.pagination.limit || 50))
                  ),
                }
              : {
                  page: 1,
                  limit: 50,
                  total: 1,
                  totalPages: 1,
                },
          };
        }
      );

      // Optimistically update file query & list if it's a file
      if (newFav.file_id) {
        queryClient.setQueryData<FileDetail>(["files", newFav.file_id], (old) =>
          old ? { ...old, is_favorite: true } : old
        );

        queryClient.setQueriesData<PaginatedResponse<ApiFile>>(
          { queryKey: ["files"] },
          (old) => {
            if (!old || !Array.isArray(old.data)) return old;
            return {
              ...old,
              data: old.data.map((f) =>
                f && String(f.id) === String(newFav.file_id)
                  ? { ...f, is_favorite: true }
                  : f
              ),
            };
          }
        );
      }

      return { previousFavorites };
    },
    onError: (_err, _newFav, context) => {
      if (context?.previousFavorites) {
        for (const [key, val] of context.previousFavorites) {
          queryClient.setQueryData(key, val);
        }
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      if (variables.file_id) {
        queryClient.invalidateQueries({ queryKey: ["files", variables.file_id], exact: true });
      }
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => favoritesService.removeFavorite(id),
    onMutate: async (favId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousFavorites = queryClient.getQueriesData<PaginatedResponse<Favorite>>({
        queryKey: ["favorites"],
      });

      // Find file_id from snapshot if available
      let targetFileId: string | null = null;
      for (const [, cache] of previousFavorites) {
        const item = cache?.data?.find((f) => f.id === favId);
        if (item?.file_id) {
          targetFileId = item.file_id;
          break;
        }
      }

      // Optimistically remove from all ["favorites"] queries
      queryClient.setQueriesData<PaginatedResponse<Favorite>>(
        { queryKey: ["favorites"] },
        (old) => {
          if (!old) return old;
          const nextTotal = Math.max(0, (old.pagination?.total ?? 1) - 1);
          return {
            ...old,
            data: old.data.filter((f) => f.id !== favId),
            pagination: old.pagination
              ? {
                  ...old.pagination,
                  total: nextTotal,
                  totalPages: Math.max(
                    1,
                    Math.ceil(nextTotal / (old.pagination.limit || 50))
                  ),
                }
              : {
                  page: 1,
                  limit: 50,
                  total: 0,
                  totalPages: 1,
                },
          };
        }
      );

      // Optimistically update file query & list
      if (targetFileId) {
        queryClient.setQueryData<FileDetail>(["files", targetFileId], (old) =>
          old ? { ...old, is_favorite: false } : old
        );

        queryClient.setQueriesData<PaginatedResponse<ApiFile>>(
          { queryKey: ["files"] },
          (old) => {
            if (!old || !Array.isArray(old.data)) return old;
            return {
              ...old,
              data: old.data.map((f) =>
                f && String(f.id) === String(targetFileId)
                  ? { ...f, is_favorite: false }
                  : f
              ),
            };
          }
        );
      }

      return { previousFavorites, targetFileId };
    },
    onError: (_err, _favId, context) => {
      if (context?.previousFavorites) {
        for (const [key, val] of context.previousFavorites) {
          queryClient.setQueryData(key, val);
        }
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      if (context?.targetFileId) {
        queryClient.invalidateQueries({ queryKey: ["files", context.targetFileId], exact: true });
      }
    },
  });
}
