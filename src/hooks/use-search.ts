"use client";

import { useQuery } from "@tanstack/react-query";
import * as searchService from "@/services/search.service";
import type { SearchParams } from "@/types/search";

export function useSearch(params?: SearchParams) {
  return useQuery({
    queryKey: ["search", params ?? {}],
    queryFn: () => searchService.search(params),
    enabled: Boolean(params?.q || params?.type || params?.favorite !== undefined),
  });
}
