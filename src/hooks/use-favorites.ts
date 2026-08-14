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
    const fileMap = new Map<number, Favorite>();
    const folderMap = new Map<number, Favorite>();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["folders"]});
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => favoritesService.removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
