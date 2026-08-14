import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { SearchParams, SearchResult } from "@/types/search";

export async function search(params?: SearchParams): Promise<SearchResult> {
  const { data } = await api.get<ApiResponse<SearchResult>>("/search", { params });
  return data.data;
}
