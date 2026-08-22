"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as favoritesService from "../services/favorites.service";
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
  const { data, ...rest } = useFavorites({ limit });
  const maps = useMemo(() => {
    const fileMap = new Map<string, Favorite>();
    const folderMap = new Map<string, Favorite>();
    for (const fav of data?.data ?? []) {
      if (fav.file_id != null) fileMap.set(fav.file_id, fav);
      if (fav.folder_id != null) folderMap.set(fav.folder_id, fav);
    }
    return { fileMap, folderMap };
  }, [data]);

  return { ...rest, ...maps };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddFavoritePayload) =>
      favoritesService.addFavorite(payload),
    onMutate: async (newFav) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousFavorites = queryClient.getQueryData(["favorites"]);

      // Optimistically update file detail query if cached
      if (newFav.file_id) {
        queryClient.setQueryData(["files", newFav.file_id], (old: Record<string, unknown> | undefined) => {
          if (!old) return old;
          return { ...old, is_favorite: true };
        });
      }

      return { previousFavorites, fileId: newFav.file_id };
    },
    onError: (_err, _newFav, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      if (context?.fileId) {
        queryClient.setQueryData(["files", context.fileId], (old: Record<string, unknown> | undefined) => {
          if (!old) return old;
          return { ...old, is_favorite: false };
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => favoritesService.removeFavorite(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData(["favorites"]);
      return { previousFavorites };
    },
    onError: (_err, _id, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

