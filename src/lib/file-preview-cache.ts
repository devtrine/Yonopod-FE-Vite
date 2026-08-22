const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedDownloadUrlData {
  url: string;
  expiresAt: number;
}

// In-memory cache map for rapid sub-millisecond lookup and session stability
const memoryDownloadUrlCache = new Map<string, CachedDownloadUrlData>();
const memoryFileDetailCache = new Map<string, { data: unknown; expiresAt: number }>();

function getStorageKey(fileId: string): string {
  return `${fileId}-download_url`;
}

/**
 * Extracts expiration timestamp in milliseconds from signed URL query parameters (e.g. exp=, expires=)
 */
export function extractUrlExpirationMs(url: string | undefined | null): number | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, "http://localhost");
    const exp =
      parsed.searchParams.get("exp") ||
      parsed.searchParams.get("expires") ||
      parsed.searchParams.get("Expires");
    if (!exp) return null;
    const num = Number(exp);
    if (isNaN(num)) return null;
    // If Unix seconds timestamp (10 digits) convert to ms, otherwise assume ms
    return num < 1e11 ? num * 1000 : num;
  } catch {
    return null;
  }
}

/**
 * Checks if a signed download URL has expired (with a 5 second safety buffer)
 */
export function isUrlExpired(url: string | undefined | null): boolean {
  if (!url) return true;
  const expMs = extractUrlExpirationMs(url);
  if (expMs === null) return false;
  return Date.now() >= expMs - 5000;
}

/**
 * Retrieves the cached download URL from memory or localStorage if it exists and has not expired.
 * If the cached data is expired or corrupted, it is automatically removed.
 */
export function getCachedDownloadUrl(fileId: string | undefined | null): string | null {
  if (!fileId) return null;

  // 1. Check in-memory cache first
  const mem = memoryDownloadUrlCache.get(fileId);
  if (mem) {
    if (Date.now() < mem.expiresAt && !isUrlExpired(mem.url)) {
      return mem.url;
    }
    memoryDownloadUrlCache.delete(fileId);
  }

  // 2. Check localStorage
  if (typeof window === "undefined") {
    return null;
  }

  const key = getStorageKey(fileId);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const data = JSON.parse(raw) as Partial<CachedDownloadUrlData>;
    if (!data || typeof data.url !== "string" || typeof data.expiresAt !== "number") {
      window.localStorage.removeItem(key);
      return null;
    }

    if (Date.now() >= data.expiresAt || isUrlExpired(data.url)) {
      window.localStorage.removeItem(key);
      return null;
    }

    // Populate memory cache
    memoryDownloadUrlCache.set(fileId, {
      url: data.url,
      expiresAt: data.expiresAt,
    });

    return data.url;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Stores a download URL in memory and localStorage for a specific file with an expiration timestamp.
 * Separated from API data cache so that Non-GET entity mutations do not evict file preview resources.
 */
export function setCachedDownloadUrl(
  fileId: string | undefined | null,
  url: string | undefined | null,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): void {
  if (!fileId || !url) return;

  if (isUrlExpired(url)) {
    // Do not cache an already expired signed URL
    return;
  }

  const expMs = extractUrlExpirationMs(url);
  const effectiveExpiresAt = expMs ? Math.min(Date.now() + ttlMs, expMs) : Date.now() + ttlMs;

  const entry: CachedDownloadUrlData = {
    url,
    expiresAt: effectiveExpiresAt,
  };

  // Set in memory
  memoryDownloadUrlCache.set(fileId, entry);

  // Set in localStorage
  if (typeof window !== "undefined") {
    const key = getStorageKey(fileId);
    try {
      window.localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn(`[file-preview-cache] Failed to cache download URL to localStorage for file ${fileId}:`, error);
    }
  }
}

/**
 * Removes the cached download URL for a file from both memory and localStorage.
 */
export function removeCachedDownloadUrl(fileId: string | undefined | null): void {
  if (!fileId) return;

  memoryDownloadUrlCache.delete(fileId);

  if (typeof window !== "undefined") {
    const key = getStorageKey(fileId);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Caches file detail in memory
 */
export function setCachedFileDetail<T>(fileId: string | undefined | null, data: T, ttlMs: number = DEFAULT_CACHE_TTL_MS): void {
  if (!fileId || !data) return;
  memoryFileDetailCache.set(fileId, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Retrieves cached file detail from memory
 */
export function getCachedFileDetail<T>(fileId: string | undefined | null): T | null {
  if (!fileId) return null;
  const entry = memoryFileDetailCache.get(fileId);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    memoryFileDetailCache.delete(fileId);
    return null;
  }
  return entry.data as T;
}

/**
 * Clears all in-memory preview caches
 */
export function clearMemoryPreviewCache(): void {
  memoryDownloadUrlCache.clear();
  memoryFileDetailCache.clear();
}

