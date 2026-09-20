import {
  Upload,
  Share2,
  Edit2,
  Trash2,
  Download,
  ArrowRightLeft,
  Eye,
  Folder,
} from "lucide-react";
import { Link } from "react-router-dom";

export type ActivityItem = {
  id: string;
  type:
    | "upload"
    | "share"
    | "edit"
    | "delete"
    | "download"
    | "move"
    | "read"
    | "folder"
    | "create";
  description: string;
  timeAgo: string;
};

const iconMap: Record<string, { icon: typeof Upload; bg: string; color: string }> = {
  upload: { icon: Upload, bg: "bg-emerald-50", color: "text-emerald-600" },
  create: { icon: Upload, bg: "bg-emerald-50", color: "text-emerald-600" },
  folder: { icon: Folder, bg: "bg-[#0F0A6B]/10", color: "text-[#0F0A6B]" },
  share: { icon: Share2, bg: "bg-[#0F0A6B]/10", color: "text-[#0F0A6B]" },
  edit: { icon: Edit2, bg: "bg-amber-50", color: "text-amber-600" },
  delete: { icon: Trash2, bg: "bg-rose-50", color: "text-rose-600" },
  download: { icon: Download, bg: "bg-blue-50", color: "text-blue-600" },
  move: { icon: ArrowRightLeft, bg: "bg-indigo-50", color: "text-indigo-600" },
  read: { icon: Eye, bg: "bg-slate-100", color: "text-slate-600" },
};

export function ActivityFeed({
  activities,
  isLoading = false,
}: {
  activities: ActivityItem[];
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-[#FDFEFF]">
      <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-semibold text-[#0f172a]">Recent Activity</h2>
      </div>
      {isLoading ? (
        <div className="flex flex-col p-5 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#f1f5f9] animate-pulse flex-shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-[#f1f5f9] rounded-md animate-pulse w-3/4" />
                <div className="h-3 bg-[#f1f5f9] rounded-md animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#64748b]">
          No recent activity yet.
        </div>
      ) : (
        <div className="flex flex-col">
          {activities.map((activity, index) => {
            const config = iconMap[activity.type] || iconMap.upload;
            const Icon = config.icon;
            const isLast = index === activities.length - 1;

            return (
              <div
                key={activity.id}
                className={[
                  "flex items-start gap-4 p-5",
                  !isLast ? "border-b border-[#f1f5f9]" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-0.5",
                    config.bg,
                    config.color,
                  ].join(" ")}
                >
                  <Icon size={14} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p
                    className="text-sm text-[#0f172a] leading-tight"
                    dangerouslySetInnerHTML={{ __html: activity.description }}
                  />
                  <p className="text-xs text-[#64748b]">{activity.timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] rounded-b-2xl">
        <Link
          to="/activity"
          className="block text-center w-full text-sm font-medium text-[#0F0A6B] hover:underline focus:outline-none"
        >
          See Full History
        </Link>
      </div>
    </div>
  );
}
