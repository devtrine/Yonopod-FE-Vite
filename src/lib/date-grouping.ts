import type { FileItem } from "@/components/files/file-table";

export interface FileDateGroup {
  key: string;
  label: string;
  files: FileItem[];
}

/**
 * Group files by Windows File Explorer date categories:
 * - Today
 * - Yesterday
 * - Earlier this week
 * - Last week
 * - Earlier this month
 * - Last month
 * - Earlier this year
 * - A long time ago
 */
export function groupFilesByDate(files: FileItem[]): FileDateGroup[] {
  if (!files || files.length === 0) return [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;

  // Start of current week (Monday)
  const dayOfWeek = now.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday).getTime();

  // Start of last week (Monday of last week)
  const startOfLastWeek = startOfWeek - 7 * 86400000;

  // Start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  // Start of last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  // Start of this year
  const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime();

  const groupMap = new Map<string, { label: string; order: number; files: FileItem[] }>();

  const getOrCreateGroup = (key: string, label: string, order: number) => {
    if (!groupMap.has(key)) {
      groupMap.set(key, { label, order, files: [] });
    }
    return groupMap.get(key)!;
  };

  for (const file of files) {
    const raw = file.rawDate || file.lastModified;
    const fileDate = raw ? new Date(raw) : null;
    const timestamp = fileDate && !isNaN(fileDate.getTime()) ? fileDate.getTime() : 0;

    if (timestamp === 0) {
      getOrCreateGroup("older", "A long time ago", 99999).files.push(file);
      continue;
    }

    if (timestamp >= startOfToday) {
      getOrCreateGroup("today", "Today", 1).files.push(file);
    } else if (timestamp >= startOfYesterday) {
      getOrCreateGroup("yesterday", "Yesterday", 2).files.push(file);
    } else if (timestamp >= startOfWeek) {
      getOrCreateGroup("earlier_this_week", "Earlier this week", 3).files.push(file);
    } else if (timestamp >= startOfLastWeek) {
      getOrCreateGroup("last_week", "Last week", 4).files.push(file);
    } else if (timestamp >= startOfThisMonth) {
      getOrCreateGroup("earlier_this_month", "Earlier this month", 5).files.push(file);
    } else if (timestamp >= startOfLastMonth) {
      getOrCreateGroup("last_month", "Last month", 6).files.push(file);
    } else if (timestamp >= startOfThisYear) {
      getOrCreateGroup("earlier_this_year", "Earlier this year", 7).files.push(file);
    } else {
      getOrCreateGroup("older", "A long time ago", 8).files.push(file);
    }
  }

  return Array.from(groupMap.entries())
    .map(([key, value]) => ({
      key,
      label: value.label,
      order: value.order,
      files: value.files,
    }))
    .filter((g) => g.files.length > 0)
    .sort((a, b) => a.order - b.order)
    .map(({ key, label, files }) => ({ key, label, files }));
}
