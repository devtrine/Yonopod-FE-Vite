import { Cloud, CheckCircle, Shield } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { formatFileSize } from "@/lib/formatters";

export function BillingSettingsPage() {
  const { data: user } = useCurrentUser();
  const quotaBytes = user?.storage_quota ? Number(user.storage_quota) : 0;
  const quotaLabel = quotaBytes > 0 ? formatFileSize(quotaBytes) : "100 GB";

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Billing & Plan</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your subscription plan and billing information.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
                <Cloud size={24} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#0f172a]">Yonopod Premium</h2>
                <p className="text-sm text-[#64748b]">{quotaLabel} Engineered Cloud Storage</p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#1c3fc4]">
              Active
            </span>
          </div>

          <div className="border-t border-[#f1f5f9] pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-[#0f172a]">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>{quotaLabel} High-Speed Storage</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#0f172a]">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>End-to-End Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#0f172a]">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>Unlimited Secure Share Links</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex items-center gap-3">
          <Shield size={20} className="text-[#1c3fc4] flex-shrink-0" />
          <p className="text-xs text-[#64748b]">
            You are on the standard enterprise tier. Contact your system administrator for storage quota upgrades.
          </p>
        </div>
      </div>
    </div>
  );
}
export default BillingSettingsPage;
