import { useState, FormEvent } from "react";
import { useChangePassword } from "@/hooks/use-auth";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import { Eye, EyeOff } from "lucide-react";

export function SecuritySettingsPage() {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) {
      toast("error", "New password must be at least 8 characters");
      return;
    }

    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast("success", "Password changed successfully");
          setCurrentPassword("");
          setNewPassword("");
        },
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Security</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your password and account security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="current_password" className="text-sm font-medium text-[#0f172a]">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current_password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 pr-10 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]/20 focus:border-[#1c3fc4] text-sm text-[#0f172a]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new_password" className="text-sm font-medium text-[#0f172a]">
              New Password
            </label>
            <div className="relative">
              <input
                id="new_password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]/20 focus:border-[#1c3fc4] text-sm text-[#0f172a]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-[#94a3b8]">Must be at least 8 characters.</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="px-5 py-2.5 rounded-lg bg-[#1c3fc4] text-white text-sm font-medium hover:bg-[#1636b0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {changePassword.isPending ? "Changing…" : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SecuritySettingsPage;
