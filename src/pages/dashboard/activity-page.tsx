import { useRecent, useClearRecentHistory } from "@/hooks/use-recent";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import { Clock, FileText, Trash2 } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/formatters";

export function ActivityPage() {
  const { data, isPending, isError } = useRecent({ limit: 50 });
  const clearHistory = useClearRecentHistory();

  const handleClear = () => {
    clearHistory.mutate(undefined, {
      onSuccess: () => toast("success", "Activity history cleared"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const activities = data?.data ?? [];

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">Activity Log</h1>
              <p className="text-sm text-[#64748b] mt-1">
                Recent access and interaction history across your files.
              </p>
            </div>
            {activities.length > 0 && (
              <button
                onClick={handleClear}
                disabled={clearHistory.isPending}
                className="flex items-center gap-2 text-sm text-[#ef4444] hover:text-[#dc2626] font-medium disabled:opacity-50"
              >
                <Trash2 size={16} />
                Clear History
              </button>
            )}
          </header>

          <section className="flex flex-col gap-4">
            {isPending ? (
              <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600">
                  Failed to load activity history. Please try again.
                </p>
              </div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0]">
                <Clock size={32} className="mx-auto text-[#94a3b8] mb-3" />
                <p className="text-sm font-medium text-[#0f172a]">No recent activity</p>
                <p className="text-xs text-[#64748b] mt-1">
                  Actions you perform on files will be recorded here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
                {activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center flex-shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">
                          Accessed <span className="font-semibold">{item.file.name}</span>
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {item.file.size ? formatFileSize(Number(item.file.size)) : (item.file.extension ? `${item.file.extension.toUpperCase()} file` : "File")} •{" "}
                          {item.file.folder?.name ?? "My Drive"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#64748b] whitespace-nowrap">
                      {formatDate(item.accessed_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
export default ActivityPage;
