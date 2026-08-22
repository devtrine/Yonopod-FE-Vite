import { useCurrentUser } from "@/hooks/use-auth";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatFileSize, bytesToGB } from "@/lib/formatters";
import { Cloud, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function StorageSettingsPage() {
  const { data: user, isPending } = useCurrentUser();

  const usedBytes = user?.storage_used ? Number(user.storage_used) : 0;
  const quotaBytes = user?.storage_quota ? Number(user.storage_quota) : 100 * 1024 * 1024 * 1024;
  const usedGB = bytesToGB(usedBytes);
  const totalGB = bytesToGB(quotaBytes);
  const percentage = quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 100)) : 0;

  if (isPending) {
    return (
      <div className="p-6 md:p-8 max-w-2xl">
        <div className="h-40 bg-[#f1f5f9] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Storage</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your storage quota and clean up unnecessary files.
          </p>
        </div>

        {/* Storage Card */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
              <Cloud size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0f172a]">Your Storage Plan</h2>
              <p className="text-sm text-[#64748b]">{totalGB} GB Engineered Cloud Quota</p>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-[#0f172a]">
                {usedGB} GB
              </span>
              <span className="text-sm font-medium text-[#64748b]">
                of {totalGB} GB used ({percentage}%)
              </span>
            </div>
            <ProgressBar value={usedGB} max={totalGB} />
          </div>

          <div className="text-xs text-[#64748b] pt-2 border-t border-[#f1f5f9] flex justify-between items-center">
            <span>Total Used: {formatFileSize(usedBytes)}</span>
            <span>Available: {Math.max(0, totalGB - usedGB).toFixed(2)} GB</span>
          </div>
        </div>

        {/* Clean up recommendations */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col gap-4">
          <h3 className="text-base font-semibold text-[#0f172a]">Free Up Space</h3>
          <p className="text-sm text-[#64748b]">
            Items in your trash count against your storage quota. Empty your trash to free up space instantly.
          </p>
          <div className="pt-2">
            <Link
              to="/trash"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Go to Trash
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StorageSettingsPage;
