import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StorageOverview } from "@/components/dashboard/storage-overview";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentFiles } from "@/components/dashboard/recent-files";
import { useCurrentUser, useUserStats } from "@/hooks/use-auth";
import { useRecent } from "@/hooks/use-recent";
import { useShares } from "@/hooks/use-shares";
import { usePreviewStore } from "@/stores/preview-store";
import type { FileItem } from "@/components/files/file-table";
import type { RecentFile } from "@/types/recent";

function recentToFileItem(recent: RecentFile): FileItem {
  return {
    id: String(recent.file.id),
    name: recent.file.name,
    extension: recent.file.extension,
    isFolder: false,
    lastModified: new Date(recent.accessed_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    owner: "me",
    tags: recent.file.tags || [],
    isStarred: recent.file.is_favorite,
  };
}

const MOCK_ACTIVITIES = [
  {
    id: "1",
    type: "upload" as const,
    description: "Welcome to Yonopod!",
    timeAgo: "Just now",
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data: statsData, isPending: statsLoading } = useUserStats();
  const { data: recentData, isPending: recentLoading } = useRecent({ limit: 6 });
  const { data: sharesData, isPending: sharesLoading } = useShares({ limit: 1 });
  const { setActiveFiles, openPreview } = usePreviewStore();

  const recentItems: FileItem[] = (recentData?.data ?? []).map(recentToFileItem);

  useEffect(() => {
    setActiveFiles(recentItems, !recentLoading);
  }, [recentData, recentLoading, setActiveFiles]);

  const usedGB = user?.storage_used
    ? Number(user.storage_used) / (1024 * 1024 * 1024)
    : 0;
  const totalGB = user?.storage_quota ? user.storage_quota / 1024 / 1024 / 1024 : 0;

  const greeting = () => {
    return "Welcome Abort";
  };

  const displayName =
    user?.full_name || user?.username || "there";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
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
              <h2 className="text-lg font-semibold text-[#0f172a]">Quick Access</h2>
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
              <h2 className="text-lg font-semibold text-[#0f172a]">Quick Access</h2>
              <p className="text-sm text-[#64748b]">
                Files you access will appear here.
              </p>
            </div>
          )}
        </div>
        <div className="xl:col-span-1">
          <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
