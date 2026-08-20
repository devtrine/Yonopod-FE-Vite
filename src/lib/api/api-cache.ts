import type { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export interface ApiCacheEntry<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders;
  cachedAt: number;
}

const apiCache = new Map<string, ApiCacheEntry>();

/**
 * Checks whether the given URL points to a Huby endpoint (e.g. check_status)
 * Huby URLs must never be cached per system requirements.
 */
export function isHubyUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("huby") ||
    lower.includes("check-status") ||
    lower.includes("check_status")
  );
}

/**
 * Generates a deterministic cache key based on the request method, base URL, URL, and params.
 */
export function generateCacheKey(config: AxiosRequestConfig): string {
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "";
  const baseURL = config.baseURL || "";

  let paramsString = "";
  if (config.params) {
    if (typeof config.params === "object") {
      const sortedKeys = Object.keys(config.params).sort();
      const sortedParams: Record<string, unknown> = {};
      for (const k of sortedKeys) {
        const val = (config.params as Record<string, unknown>)[k];
        if (val !== undefined && val !== null) {
          sortedParams[k] = val;
        }
      }
      paramsString = JSON.stringify(sortedParams);
    } else {
      paramsString = String(config.params);
    }
  }

  return `${method}:${baseURL}:${url}:${paramsString}`;
}

/**
 * Retrieves a cached response entry if present.
 */
export function getApiCache<T = unknown>(key: string): ApiCacheEntry<T> | undefined {
  return apiCache.get(key) as ApiCacheEntry<T> | undefined;
}

/**
 * Saves a successful Axios response into the cache.
 */
export function setApiCache<T = unknown>(key: string, response: AxiosResponse<T>): void {
  let clonedData: T;
  try {
    if (response.data !== undefined && response.data !== null && typeof response.data === "object") {
      if (typeof structuredClone === "function") {
        clonedData = structuredClone(response.data);
      } else {
        clonedData = JSON.parse(JSON.stringify(response.data));
      }
    } else {
      clonedData = response.data;
    }
  } catch {
    clonedData = response.data;
  }

  apiCache.set(key, {
    data: clonedData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    cachedAt: Date.now(),
  });
}

/**
 * Clears the entire API GET cache.
 * Called on any Non-GET request (POST, PUT, PATCH, DELETE) to guarantee data consistency.
 */
export function clearApiCache(): void {
  apiCache.clear();
}

/**
 * Removes a specific cache entry by key.
 */
export function removeApiCache(key: string): boolean {
  return apiCache.delete(key);
}

/**
 * Removes cached entries matching a specific URL pattern or file ID.
 */
export function removeApiCacheByPattern(pattern: string | RegExp): void {
  for (const key of apiCache.keys()) {
    const isMatch = typeof pattern === "string" ? key.includes(pattern) : pattern.test(key);
    if (isMatch) {
      apiCache.delete(key);
    }
  }
}

/**
 * Returns current number of cached entries.
 */
export function getApiCacheSize(): number {
  return apiCache.size;
}

