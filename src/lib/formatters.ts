/**
 * Format a file size in bytes to a human-readable string.
 * e.g. 1024 → "1 KB", 1048576 → "1 MB"
 */
export function formatFileSize(bytes: number | string | null | undefined): string {
  const num = Number(bytes);
  if (!num || isNaN(num) || num <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exp = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
  const size = num / Math.pow(1024, exp);
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[exp]}`;
}

/**
 * Format a date string to a human-friendly relative or absolute label.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format bytes as a GB string e.g. "1.23 GB"
 */
export function formatGB(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
