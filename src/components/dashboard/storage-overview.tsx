import { Cloud, File, Folder, Users } from "lucide-react";
import { ProgressBar } from "../ui/progress-bar";

export function StorageOverview({
  usedGB,
  totalGB,
  totalFiles,
  totalFolders,
  sharedItems,
}: {
  usedGB: number;
  totalGB: number;
  totalFiles: string;
  totalFolders: string;
  sharedItems: string;
}) {
  const percentUsed = Math.round((usedGB / totalGB) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Storage Usage Card */}
      <div className="md:col-span-1 p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#1c3fc4] mb-3">
            <Cloud size={20} />
            <h3 className="font-semibold text-base text-[#0f172a]">Storage Usage</h3>
          </div>
          <p className="text-sm text-[#64748b]">
            You are using {percentUsed}% of your available storage.
          </p>
        </div>
        <div className="mt-6">
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-[#0f172a] leading-none">{usedGB} GB</span>
            <span className="text-sm font-medium text-[#64748b]">/ {totalGB} GB</span>
          </div>
          <ProgressBar value={usedGB} max={totalGB} />
        </div>
      </div>

      {/* Stats Cards */}
      <StatCard icon={File} title="Total Files" value={totalFiles} />
      <StatCard icon={Folder} title="Total Folders" value={totalFolders} />
      <StatCard icon={Users} title="Shared Items" value={sharedItems} />
    </div>
  );
}

function StatCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) {
  return (
    <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col justify-between">
      <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mb-4">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-[#64748b] mb-1">{title}</p>
        <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
      </div>
    </div>
  );
}
