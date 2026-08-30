import { formatFileSize } from "@/lib/formatters";

export function StorageChart({
  usedBytes,
  quotaBytes,
}: {
  usedBytes: number;
  quotaBytes: number;
}) {
  const percentage = quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 100)) : 0;

  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl border border-[#e2e8f0] bg-white">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#0f172a]">
          Storage Usage
        </span>
        <span className="text-xs font-medium text-[#64748b]">
          {formatFileSize(usedBytes)} / {formatFileSize(quotaBytes)}
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-[#f1f5f9] overflow-hidden">
        <div
          className="h-full bg-[#1c3fc4] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-[#64748b]">
        {percentage}% of your storage is currently used.
      </span>
    </div>
  );
}
