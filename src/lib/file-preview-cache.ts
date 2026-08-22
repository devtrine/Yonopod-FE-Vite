const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedDownloadUrlData {
  url: string;
  expiresAt: number;
}

function getStorageKey(fileId: string): string {
  return `${fileId}-download_url`;
}

/**
 * Retrieves the cached download URL from localStorage if it exists and has not expired.
 * If the cached data is expired or corrupted, it is automatically removed from localStorage.
 */
export function getCachedDownloadUrl(fileId: string | undefined | null): string | null {
  if (!fileId || typeof window === "undefined") {
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

    if (Date.now() >= data.expiresAt) {
      window.localStorage.removeItem(key);
      return null;
    }

    return data.url;
  } catch (error) {
    // If localStorage or JSON parsing fails, cleanup key and fallback
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Stores a download URL in localStorage for a specific file with an expiration timestamp.
 */
export function setCachedDownloadUrl(
  fileId: string | undefined | null,
  url: string | undefined | null,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): void {
  if (!fileId || !url || typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(fileId);
  try {
    const data: CachedDownloadUrlData = {
      url,
      expiresAt: Date.now() + ttlMs,
    };
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`[file-preview-cache] Failed to cache download URL for file ${fileId}:`, error);
  }
}

/**
 * Removes the cached download URL for a file from localStorage.
 */
export function removeCachedDownloadUrl(fileId: string | undefined | null): void {
  if (!fileId || typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(fileId);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
