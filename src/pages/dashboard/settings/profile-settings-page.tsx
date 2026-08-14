import { useState, FormEvent } from "react";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";

export function ProfileSettingsPage() {
  const { data: user, isPending } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Initialize form from user data once loaded
  if (user && !initialized) {
    setFullName(user.full_name ?? "");
    setAvatarUrl(user.avatar_url ?? "");
    setInitialized(true);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile.mutate(
      { full_name: fullName || undefined, avatar_url: avatarUrl || undefined },
      {
        onSuccess: () => toast("success", "Profile updated successfully"),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  if (isPending) {
    return (
      <div className="p-6 md:p-8 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="h-8 w-48 bg-[#f1f5f9] rounded animate-pulse" />
          <div className="h-40 bg-[#f1f5f9] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Profile</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a]">
              Username
            </label>
            <input
              type="text"
              value={user?.username ?? ""}
              disabled
              className="px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] text-sm"
            />
            <p className="text-xs text-[#94a3b8]">Username cannot be changed.</p>
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a]">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] text-sm"
            />
            <p className="text-xs text-[#94a3b8]">Email cannot be changed.</p>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="full_name" className="text-sm font-medium text-[#0f172a]">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              maxLength={150}
              className="px-3 py-2 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]/20 focus:border-[#1c3fc4] text-sm text-[#0f172a]"
            />
          </div>

          {/* Avatar URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="avatar_url" className="text-sm font-medium text-[#0f172a]">
              Avatar URL
            </label>
            <input
              id="avatar_url"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              maxLength={255}
              className="px-3 py-2 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]/20 focus:border-[#1c3fc4] text-sm text-[#0f172a]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-5 py-2.5 rounded-lg bg-[#1c3fc4] text-white text-sm font-medium hover:bg-[#1636b0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProfileSettingsPage;
