import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Shield, Laptop, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SessionsSettingsPage() {
  const { data: user, isPending } = useCurrentUser();
  const logout = useLogout();

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
          <h1 className="text-2xl font-bold text-[#0f172a]">Sessions</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your active session and sign out securely.
          </p>
        </div>

        {/* Current Session Card */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
                <Laptop size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#0f172a]">Current Session</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    Active Now
                  </span>
                </div>
                <p className="text-sm text-[#64748b] mt-0.5">
                  Signed in as {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f1f5f9] pt-4 flex items-center justify-between text-xs text-[#64748b]">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#1c3fc4]" />
              <span>Protected by Express-Session HTTP-only cookie</span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0f172a]">Sign Out</h3>
            <p className="text-sm text-[#64748b] mt-0.5">
              End your active session on this device.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            {logout.isPending ? "Signing out…" : "Sign Out Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default SessionsSettingsPage;
