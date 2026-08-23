import type { FileItem } from "@/components/files/file-table";

export interface FileDateGroup {
  key: string;
  label: string;
  files: FileItem[];
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Group files by date categories:
 * - Hari Ini (Today)
 * - Kemarin (Yesterday)
 * - 7 Hari Terakhir (Last 7 Days)
 * - Bulan Ini (This Month)
 * - Per-Bulan (e.g. Juli, Juni, dll. untuk bulan sebelumnya di tahun ini)
 * - Lebih Lama (Sebelum tahun ini)
 */
export function groupFilesByDate(files: FileItem[]): FileDateGroup[] {
  if (!files || files.length === 0) return [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
  const startOf7DaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
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
      getOrCreateGroup("older", "Lebih Lama", 99999).files.push(file);
      continue;
    }

    if (timestamp >= startOfToday) {
      getOrCreateGroup("today", "Hari Ini", 1).files.push(file);
    } else if (timestamp >= startOfYesterday) {
      getOrCreateGroup("yesterday", "Kemarin", 2).files.push(file);
    } else if (timestamp >= startOf7DaysAgo) {
      getOrCreateGroup("last_7_days", "7 Hari Terakhir", 3).files.push(file);
    } else if (timestamp >= startOfThisMonth) {
      getOrCreateGroup("this_month", "Bulan Ini", 4).files.push(file);
    } else if (timestamp >= startOfThisYear) {
      const monthIndex = fileDate!.getMonth();
      const monthLabel = MONTH_NAMES[monthIndex];
      const key = `month_${fileDate!.getFullYear()}_${monthIndex}`;
      const order = 100 + (11 - monthIndex);
      getOrCreateGroup(key, monthLabel, order).files.push(file);
    } else {
      const fileYear = fileDate!.getFullYear();
      const key = `year_${fileYear}`;
      const order = 1000 + (now.getFullYear() - fileYear);
      getOrCreateGroup(key, `Lebih Lama (${fileYear})`, order).files.push(file);
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
