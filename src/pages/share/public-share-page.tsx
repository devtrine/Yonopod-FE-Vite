import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePublicShare, useVerifySharePassword, useDownloadSharedFile } from "@/hooks/use-shares";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import { Download, Lock, FileText, Folder, ExternalLink } from "lucide-react";
import type { Share } from "@/types/shares";

function ShareContent({ share, token }: { share: Share; token: string }) {
  const downloadMutation = useDownloadSharedFile();

  const handleDownload = () => {
    downloadMutation.mutate(token, {
      onSuccess: (res) => {
        // Open the presigned download URL
        window.open(res.downloadUrl, "_blank", "noopener,noreferrer");
      },
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const isFile = !!share.file;
  const name = isFile ? share.file!.name : share.folder?.name ?? "Shared Item";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-[#eff1fb] flex items-center justify-center text-[#1c3fc4]">
        {isFile ? <FileText size={36} /> : <Folder size={36} />}
      </div>

      {/* Name */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">{name}</h1>
        {share.file?.extension && (
          <p className="text-sm text-[#64748b] mt-1 uppercase tracking-wider">
            {share.file.extension} file
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="w-full bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col gap-2.5">
        {share.expires_at && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Expires</span>
            <span className="font-medium text-[#0f172a]">
              {new Date(share.expires_at).toLocaleDateString()}
            </span>
          </div>
        )}
        {share.download_limit !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Downloads remaining</span>
            <span className="font-medium text-[#0f172a]">
              {share.download_limit - share.download_count}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748b]">Permission</span>
          <span className="font-medium text-[#0f172a] capitalize">
            {share.permission.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Download button */}
      {isFile && (
        <button
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1c3fc4] text-white font-medium hover:bg-[#1636b0] transition-colors disabled:opacity-60"
        >
          <Download size={18} />
          {downloadMutation.isPending ? "Preparing download…" : "Download File"}
        </button>
      )}
    </div>
  );
}

function PasswordForm({
  token,
  onSuccess,
}: {
  token: string;
  onSuccess: (share: Share) => void;
}) {
  const [password, setPassword] = useState("");
  const verify = useVerifySharePassword(token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify.mutate(
      { password },
      {
        onSuccess: (share) => onSuccess(share),
        onError: (err) => toast("error", getErrorMessage(err)),
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="w-20 h-20 rounded-2xl bg-[#eff1fb] flex items-center justify-center text-[#1c3fc4]">
        <Lock size={36} />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">Password Protected</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Enter the password to access this shared file.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]/20 focus:border-[#1c3fc4] text-sm"
        />
        <button
          type="submit"
          disabled={verify.isPending}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1c3fc4] text-white font-medium hover:bg-[#1636b0] transition-colors disabled:opacity-60"
        >
          {verify.isPending ? "Verifying…" : "Access File"}
        </button>
      </form>
    </div>
  );
}

export function PublicSharePage() {
  const { token = "" } = useParams<{ token: string }>();
  const { data, isPending, isError, error } = usePublicShare(token);
  const [unlockedShare, setUnlockedShare] = useState<Share | null>(null);

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#f1f5f9] animate-pulse" />
          <div className="h-6 w-48 bg-[#f1f5f9] rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (isError) {
    const msg = getErrorMessage(error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
            <ExternalLink size={36} />
          </div>
          <h1 className="text-xl font-bold text-[#0f172a]">Share Unavailable</h1>
          <p className="text-sm text-[#64748b]">{msg}</p>
        </div>
      </main>
    );
  }

  // If password required and not yet unlocked
  const requiresPassword =
    data && "requiresPassword" in data && data.requiresPassword;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-[#1c3fc4]">Yonopod</p>
          <p className="text-sm text-[#64748b]">Shared with you</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
          {requiresPassword && !unlockedShare ? (
            <PasswordForm token={token} onSuccess={setUnlockedShare} />
          ) : (
            <ShareContent
              share={(unlockedShare ?? data) as Share}
              token={token}
            />
          )}
        </div>
      </div>
    </main>
  );
}
export default PublicSharePage;
