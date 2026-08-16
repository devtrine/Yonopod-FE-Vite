import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Favorite,
  ListFavoritesParams,
  AddFavoritePayload,
} from "../types/favorites";

export async function listFavorites(
  params?: ListFavoritesParams
): Promise<PaginatedResponse<Favorite>> {
  const { data } = await api.get<PaginatedResponse<Favorite>>("/favorites", { params });
  return data;
}

export async function addFavorite(payload: AddFavoritePayload): Promise<Favorite> {
  const { data } = await api.post<ApiResponse<Favorite>>("/favorites", payload);
  return data.data;
}

export async function removeFavorite(id: string): Promise<void> {
  await api.delete(`/favorites/${id}`);
}
