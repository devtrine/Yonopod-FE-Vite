import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StorageOverview } from "@/components/dashboard/storage-overview";
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/activity-feed";
import { RecentFiles } from "@/components/dashboard/recent-files";
import { LargestFiles } from "@/components/dashboard/largest-files";
import { useCurrentUser, useUserStats } from "@/hooks/use-auth";
import { useRecentFiles, useLargestFiles } from "@/hooks/use-files";
import { useFileLogs, useFolderLogs } from "@/hooks/use-audit-logs";
import { useShares } from "@/hooks/use-shares";
import { usePreviewStore } from "@/stores/preview-store";
import { formatDate } from "@/lib/formatters";
import type { FileItem } from "@/components/files/file-table";
import type { File as ApiFile } from "@/types/file";
import type { AuditLogItem } from "@/types/audit";

function fileToFileItem(file: ApiFile): FileItem {
  return {
    id: String(file.id),
    name: file.name,
    extension: file.extension,
    isFolder: false,
    lastModified: file.updated_at
      ? new Date(file.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : file.created_at
      ? new Date(file.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    rawDate: file.updated_at || file.created_at,
    owner: "me",
    tags: file.tags || [],
    location: file.folder?.name ?? "My Drive",
    isStarred: Boolean(file.is_favorite),
    size: file.size != null ? Number(file.size) : null,
  };
}

function auditLogToActivityItem(
  log: AuditLogItem,
  isFolder: boolean
): ActivityItem & { rawTimestamp: number } {
  const targetName = isFolder
    ? log.folder?.name ?? "Unnamed Folder"
    : log.file?.name ?? "Unnamed File";

  let type: ActivityItem["type"] = isFolder ? "folder" : "upload";
  switch (log.event) {
    case "CREATE":
      type = isFolder ? "folder" : "upload";
      break;
    case "DOWNLOAD":
      type = "download";
      break;
    case "UPDATE":
      type = "edit";
      break;
    case "DELETE":
      type = "delete";
      break;
    case "MOVE":
      type = "move";
      break;
    case "READ":
    default:
      type = "read";
      break;
  }

  let description = log.message;
  if (!description) {
    description = targetName ? `<b>${targetName}</b>` : log.event;
  } else if (targetName) {
    if (description.includes(targetName)) {
      description = description.replace(targetName, `<b>${targetName}</b>`);
    } else {
      description = `<b>${targetName}</b>: ${description}`;
    }
  }

  return {
    id: `${isFolder ? "folder" : "file"}-${log.id}`,
    type,
    description,
    timeAgo: formatDate(log.created_at),
    rawTimestamp: new Date(log.created_at).getTime(),
  };
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data: statsData, isPending: statsLoading } = useUserStats();
  const { data: recentData, isPending: recentLoading } = useRecentFiles({ limit: 6 });
  const { data: largestData, isPending: largestLoading } = useLargestFiles({ limit: 25 });
  const { data: sharesData, isPending: sharesLoading } = useShares({ limit: 1 });
  const { data: fileLogsData, isPending: fileLogsLoading } = useFileLogs(
    { limit: 2 },
    { refetchInterval: 5000 }
  );
  const { data: folderLogsData, isPending: folderLogsLoading } = useFolderLogs(
    { limit: 2 },
    { refetchInterval: 5000 }
  );
  const { setActiveFiles, openPreview } = usePreviewStore();

  const recentItems: FileItem[] = useMemo(
    () => (recentData?.data ?? []).map(fileToFileItem),
    [recentData?.data]
  );
  const largestItems: FileItem[] = useMemo(
    () => (largestData?.data ?? []).map(fileToFileItem),
    [largestData?.data]
  );

  const activities: ActivityItem[] = useMemo(() => {
    const fileItems = (fileLogsData?.data ?? []).map((log) =>
      auditLogToActivityItem(log, false)
    );
    const folderItems = (folderLogsData?.data ?? []).map((log) =>
      auditLogToActivityItem(log, true)
    );

    return [...fileItems, ...folderItems].sort(
      (a, b) => b.rawTimestamp - a.rawTimestamp
    );
  }, [fileLogsData?.data, folderLogsData?.data]);

  useEffect(() => {
    const map = new Map<string, FileItem>();
    recentItems.forEach((item) => map.set(item.id, item));
    largestItems.forEach((item) => map.set(item.id, item));
    setActiveFiles(Array.from(map.values()), !recentLoading && !largestLoading);
  }, [recentItems, largestItems, recentLoading, largestLoading, setActiveFiles]);

  const usedGB = user?.storage_used
    ? Number(user.storage_used) / (1024 * 1024 * 1024)
    : 0;
  const totalGB = user?.storage_quota
    ? Math.round((Number(user.storage_quota) / (1024 * 1024 * 1024)) * 100) / 100
    : 0;

  const greeting = () => {
    return "Welcome Abort";
  };

  const displayName =
    user?.full_name || user?.username || "there";

  return (
    <div className="flex flex-col gap-8 p-6 w-full">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-[#0f172a]">
          {greeting()}, {displayName}
        </h1>
        <p className="text-[#64748b]">
          Here&apos;s an overview of your storage and recent activity.
        </p>
      </header>

      <StorageOverview
        usedGB={Math.round(usedGB * 100) / 100}
        totalGB={totalGB}
        totalFiles={statsData?.files != null ? String(statsData.files) : "—"}
        totalFolders={statsData?.folders != null ? String(statsData.folders) : "—"}
        sharedItems={String(sharesData?.pagination?.total ?? "—")}
        isLoadingStats={statsLoading}
        isLoadingShares={sharesLoading}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {recentLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0f172a]">Recent</h2>
                <button
                  onClick={() => navigate("/recent")}
                  className="text-sm font-medium text-[#0F0A6B] hover:underline focus:outline-none cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-[#f1f5f9] animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : recentItems.length > 0 ? (
            <RecentFiles
              items={recentItems}
              onItemClick={(item) => openPreview(item.id)}
              onViewAll={() => navigate("/recent")}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0f172a]">Recent</h2>
                <button
                  onClick={() => navigate("/recent")}
                  className="text-sm font-medium text-[#0F0A6B] hover:underline focus:outline-none cursor-pointer"
                >
                  View All
                </button>
              </div>
              <p className="text-sm text-[#64748b]">
                Files you access will appear here.
              </p>
            </div>
          )}

          {largestLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0f172a]">Largest File</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-[#f1f5f9] animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : largestItems.length > 0 ? (
            <LargestFiles
              items={largestItems}
              onItemClick={(item) => openPreview(item.id)}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0f172a]">Largest File</h2>
              </div>
              <p className="text-sm text-[#64748b]">
                No files found.
              </p>
            </div>
          )}
        </div>
        <div className="xl:col-span-1">
          <ActivityFeed
            activities={activities}
            isLoading={
              (!fileLogsData && fileLogsLoading) ||
              (!folderLogsData && folderLogsLoading)
            }
          />
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
