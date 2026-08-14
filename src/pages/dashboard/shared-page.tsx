import { useMemo, useState } from "react";
import { FileTable, type FileItem } from "@/components/files/file-table";
import { useShares, useDeleteShare } from "@/hooks/use-shares";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import type { Share } from "@/types/shares";
import { Lock } from "lucide-react";
import { PrivateVault } from "@/components/folders/private-vault";

function shareToFileItem(share: Share): FileItem {
  const name = share.file
    ? share.file.name
    : share.folder
    ? share.folder.name
    : "Unknown";
  const isFolder = !!share.folder;
  const dateStr = new Date(share.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    id: String(share.id),
    name,
    isFolder,
    lastModified: dateStr,
    owner: "me",
    tags: share.file?.tags || [],
  };
}

export function SharedPage() {
  const [activeTab, setActiveTab] = useState<"by-me" | "vault">("by-me");
  const { data, isPending, isError } = useShares({ limit: 50 });
  const deleteShare = useDeleteShare();

  const shares: FileItem[] = (data?.data ?? []).map(shareToFileItem);

  const shareById = useMemo(() => {
    const map = new Map<number, Share>();
    for (const share of data?.data ?? []) map.set(share.id, share);
    return map;
  }, [data]);

  const handleCopyLink = (share: Share) => {
    const url = `${window.location.origin}/share/${share.share_token}`;
    navigator.clipboard.writeText(url).then(() =>
      toast("success", "Share link copied to clipboard!")
    );
  };

  const handleDelete = (id: string) => {
    deleteShare.mutate(parseInt(id, 10), {
      onSuccess: () => toast("success", "Share link revoked"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const handleCopyFromItem = (item: FileItem) => {
    const share = shareById.get(parseInt(item.id, 10));
    if (share) handleCopyLink(share);
  };

  const handleRevokeFromItem = (item: FileItem) => {
    handleDelete(item.id);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          
          <header className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#0f172a]">Shared</h1>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[#e2e8f0]">
              <button
                onClick={() => setActiveTab("by-me")}
                className={[
                  "pb-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === "by-me"
                    ? "border-[#1c3fc4] text-[#1c3fc4]"
                    : "border-transparent text-[#64748b] hover:text-[#0f172a]",
                ].join(" ")}
              >
                Shared by me
              </button>
              <button
                onClick={() => setActiveTab("vault")}
                className={[
                  "flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === "vault"
                    ? "border-[#1c3fc4] text-[#1c3fc4]"
                    : "border-transparent text-[#64748b] hover:text-[#0f172a]",
                ].join(" ")}
              >
                <Lock size={14} />
                Private Vault
              </button>
            </div>
          </header>

          {activeTab === "vault" ? (
            <section className="flex flex-col gap-4">
              <PrivateVault />
            </section>
          ) : (
          <section className="flex flex-col gap-4">
            {isPending ? (
              <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600">
                  Failed to load shares. Please try again.
                </p>
              </div>
            ) : shares.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#64748b]">
                  You haven&apos;t shared any files or folders yet.
                </p>
              </div>
            ) : (
              <FileTable
                files={shares}
                columns={["name", "lastModified", "owner", "tags"]}
                menuActions={{
                  onCopyLink: handleCopyFromItem,
                  onRevoke: handleRevokeFromItem,
                }}
              />
            )}
          </section>
          )}
        </div>
      </div>
    </div>
  );
}
export default SharedPage;
