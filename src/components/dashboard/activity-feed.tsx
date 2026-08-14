import { Upload, Share2, Edit2, Trash2 } from "lucide-react";

export type ActivityItem = {
  id: string;
  type: "upload" | "share" | "edit" | "delete";
  description: string;
  timeAgo: string;
};

const iconMap = {
  upload: { icon: Upload, bg: "bg-[#eff1fb]", color: "text-[#1c3fc4]" },
  share: { icon: Share2, bg: "bg-[#eff1fb]", color: "text-[#1c3fc4]" },
  edit: { icon: Edit2, bg: "bg-[#f1f5f9]", color: "text-[#64748b]" },
  delete: { icon: Trash2, bg: "bg-[#f1f5f9]", color: "text-[#64748b]" },
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white">
      <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-semibold text-[#0f172a]">Recent Activity</h2>
      </div>
      <div className="flex flex-col">
        {activities.map((activity, index) => {
          const { icon: Icon, bg, color } = iconMap[activity.type];
          const isLast = index === activities.length - 1;
          
          return (
            <div
              key={activity.id}
              className={[
                "flex items-start gap-4 p-5",
                !isLast ? "border-b border-[#f1f5f9]" : "",
              ].join(" ")}
            >
              <div className={["w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-0.5", bg, color].join(" ")}>
                <Icon size={14} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-[#0f172a] leading-tight" dangerouslySetInnerHTML={{ __html: activity.description }} />
                <p className="text-xs text-[#64748b]">{activity.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] rounded-b-2xl">
        <button className="w-full text-sm font-medium text-[#1c3fc4] hover:underline focus:outline-none">
          See Full History
        </button>
      </div>
    </div>
  );
}
