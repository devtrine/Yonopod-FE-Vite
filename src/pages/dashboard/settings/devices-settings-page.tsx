import { Laptop, Smartphone, ShieldCheck } from "lucide-react";

export function DevicesSettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Connected Devices</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Devices that have logged into your Yonopod account.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col gap-4">
          <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
                <Laptop size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">Current Web Browser</p>
                <p className="text-xs text-[#64748b]">Windows • Web Client (React + Vite)</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Active Now
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f8fafc] text-[#64748b] flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">Yonopod Mobile App</p>
                <p className="text-xs text-[#64748b]">iOS / Android • Synchronized</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#64748b]">Trusted</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center gap-3">
          <ShieldCheck size={20} className="flex-shrink-0" />
          <p className="text-xs">
            All connected devices are authenticated using HTTP-only session tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
export default DevicesSettingsPage;
