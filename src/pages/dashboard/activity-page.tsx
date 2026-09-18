import { useState } from "react";
import {
  Clock,
  FileText,
  Folder,
  Trash2,
  Upload,
  Download,
  Edit2,
  ArrowRightLeft,
  Eye,
  Activity,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { useRecent, useClearRecentHistory } from "@/hooks/use-recent";
import { useFileLogs, useFolderLogs } from "@/hooks/use-audit-logs";
import { toast } from "@/components/ui/toaster";
import { getErrorMessage } from "@/lib/api/client";
import { formatDate, formatFileSize } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import type { AuditEvent, AuditLogItem } from "@/types/audit";
import type { RecentFile } from "@/types/recent";

type TabType = "files" | "folders" | "recent";

const PAGE_SIZE = 15;

function getEventBadgeVariant(event: AuditEvent): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (event) {
    case "CREATE":
      return "success";
    case "UPDATE":
      return "warning";
    case "DELETE":
      return "danger";
    case "DOWNLOAD":
      return "info";
    case "MOVE":
      return "info";
    case "READ":
    default:
      return "neutral";
  }
}

function getEventIcon(event: AuditEvent) {
  switch (event) {
    case "CREATE":
      return <Upload size={14} className="text-emerald-600" />;
    case "DOWNLOAD":
      return <Download size={14} className="text-blue-600" />;
    case "UPDATE":
      return <Edit2 size={14} className="text-amber-600" />;
    case "DELETE":
      return <Trash2 size={14} className="text-rose-600" />;
    case "MOVE":
      return <ArrowRightLeft size={14} className="text-indigo-600" />;
    case "READ":
    default:
      return <Eye size={14} className="text-slate-500" />;
  }
}

export function ActivityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("files");
  const [filePage, setFilePage] = useState(1);
  const [folderPage, setFolderPage] = useState(1);

  // Queries with auto-refetch interval so logs update automatically in real-time
  const fileLogsQuery = useFileLogs(
    { page: filePage, limit: PAGE_SIZE },
    { enabled: activeTab === "files", refetchInterval: 5000 }
  );

  const folderLogsQuery = useFolderLogs(
    { page: folderPage, limit: PAGE_SIZE },
    { enabled: activeTab === "folders", refetchInterval: 5000 }
  );

  const recentQuery = useRecent(
    { limit: 50 },
    { enabled: activeTab === "recent", refetchInterval: 5000 }
  );

  const clearHistory = useClearRecentHistory();

  const isRefreshing =
    activeTab === "files"
      ? fileLogsQuery.isFetching
      : activeTab === "folders"
        ? folderLogsQuery.isFetching
        : recentQuery.isFetching;

  const handleRefresh = () => {
    if (activeTab === "files") {
      fileLogsQuery.refetch();
    } else if (activeTab === "folders") {
      folderLogsQuery.refetch();
    } else {
      recentQuery.refetch();
    }
  };

  const handleClearRecent = () => {
    clearHistory.mutate(undefined, {
      onSuccess: () => toast("success", "Recent access history cleared"),
      onError: (err) => toast("error", getErrorMessage(err)),
    });
  };

  const isPending =
    activeTab === "files"
      ? fileLogsQuery.isPending
      : activeTab === "folders"
        ? folderLogsQuery.isPending
        : recentQuery.isPending;

  const isError =
    activeTab === "files"
      ? fileLogsQuery.isError
      : activeTab === "folders"
        ? folderLogsQuery.isError
        : recentQuery.isError;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#0f172a]">Activity Log</h1>
              </div>
              <p className="text-sm text-[#64748b] mt-1">
                Detailed audit records of file and folder activities across your workspace.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                title="Refresh activities"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin text-[#0F0A6B]" : "text-[#64748b]"}
                />
                <span>Refresh</span>
              </button>

              {activeTab === "recent" && (recentQuery.data?.data?.length ?? 0) > 0 && (
                <button
                  onClick={handleClearRecent}
                  disabled={clearHistory.isPending}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-medium text-[#ef4444] hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("files")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "files"
                  ? "bg-[#0F0A6B] text-white shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                }`}
            >
              <FileText size={16} />
              <span>File Activities</span>
              {fileLogsQuery.data?.pagination?.total != null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "files"
                      ? "bg-white/20 text-white"
                      : "bg-[#e2e8f0] text-[#475569]"
                    }`}
                >
                  {fileLogsQuery.data.pagination.total}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("folders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "folders"
                  ? "bg-[#0F0A6B] text-white shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                }`}
            >
              <Folder size={16} />
              <span>Folder Activities</span>
              {folderLogsQuery.data?.pagination?.total != null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "folders"
                      ? "bg-white/20 text-white"
                      : "bg-[#e2e8f0] text-[#475569]"
                    }`}
                >
                  {folderLogsQuery.data.pagination.total}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "recent"
                  ? "bg-[#0F0A6B] text-white shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                }`}
            >
              <Clock size={16} />
              <span>Recent Access</span>
            </button>
          </div>

          {/* Main Content Area */}
          <section className="flex flex-col gap-4">
            {isPending ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-[#f1f5f9] animate-pulse border border-[#e2e8f0]"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="py-12 text-center rounded-xl bg-[#fef2f2] border border-[#fecaca] p-6">
                <p className="text-sm font-medium text-red-600">
                  Failed to load activity logs. Please check your connection and try again.
                </p>
              </div>
            ) : activeTab === "files" ? (
              <AuditLogsList
                items={fileLogsQuery.data?.data ?? []}
                type="file"
                emptyMessage="No file activities recorded yet."
              />
            ) : activeTab === "folders" ? (
              <AuditLogsList
                items={folderLogsQuery.data?.data ?? []}
                type="folder"
                emptyMessage="No folder activities recorded yet."
              />
            ) : (
              <RecentAccessList items={recentQuery.data?.data ?? []} />
            )}

            {/* Pagination for Audit Logs */}
            {activeTab === "files" && fileLogsQuery.data?.pagination && (
              <div className="mt-2 pt-4 border-t border-[#e2e8f0]">
                <Pagination
                  page={filePage}
                  totalPages={fileLogsQuery.data.pagination.totalPages || 1}
                  onPageChange={(p) => setFilePage(p)}
                  totalItems={fileLogsQuery.data.pagination.total}
                  itemsPerPage={PAGE_SIZE}
                  itemLabel="file activities"
                />
              </div>
            )}

            {activeTab === "folders" && folderLogsQuery.data?.pagination && (
              <div className="mt-2 pt-4 border-t border-[#e2e8f0]">
                <Pagination
                  page={folderPage}
                  totalPages={folderLogsQuery.data.pagination.totalPages || 1}
                  onPageChange={(p) => setFolderPage(p)}
                  totalItems={folderLogsQuery.data.pagination.total}
                  itemsPerPage={PAGE_SIZE}
                  itemLabel="folder activities"
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function AuditLogsList({
  items,
  type,
  emptyMessage,
}: {
  items: AuditLogItem[];
  type: "file" | "folder";
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FDFEFF] rounded-xl border border-[#e2e8f0] p-6">
        <Activity size={36} className="mx-auto text-[#94a3b8] mb-3 opacity-60" />
        <p className="text-sm font-medium text-[#0f172a]">{emptyMessage}</p>
        <p className="text-xs text-[#64748b] mt-1">
          Actions like creating, updating, downloading, and deleting will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFEFF] rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] shadow-xs">
      {items.map((log) => {
        const targetName =
          type === "file"
            ? log.file?.name ?? "Unnamed File"
            : log.folder?.name ?? "Unnamed Folder";

        const actorName = log.user?.username || log.user?.email || "User";

        return (
          <div
            key={log.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 hover:bg-[#f8fafc] transition-colors gap-3"
          >
            <div className="flex items-start gap-3.5">
              {/* Type & Action Avatar */}
              <div className="relative w-10 h-10 rounded-xl bg-[#0F0A6B]/10 text-[#0F0A6B] flex items-center justify-center flex-shrink-0 mt-0.5">
                {type === "file" ? <FileText size={18} /> : <Folder size={18} />}
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center shadow-xs">
                  {getEventIcon(log.event)}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getEventBadgeVariant(log.event)} showDot={false}>
                    {log.event}
                  </Badge>
                  <span className="text-sm font-semibold text-[#0f172a]">
                    {targetName}
                  </span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {log.message}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mt-0.5">
                  <UserIcon size={12} />
                  <span>By {actorName}</span>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-[#64748b] flex-shrink-0 sm:pl-4">
              <span className="font-medium">{formatDate(log.created_at)}</span>
              <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
                {new Date(log.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentAccessList({
  items,
}: {
  items: RecentFile[];
}) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FDFEFF] rounded-xl border border-[#e2e8f0] p-6">
        <Clock size={36} className="mx-auto text-[#94a3b8] mb-3 opacity-60" />
        <p className="text-sm font-medium text-[#0f172a]">No recent activity</p>
        <p className="text-xs text-[#64748b] mt-1">
          Files you view or access will be recorded here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFEFF] rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] shadow-xs">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F0A6B]/10 text-[#0F0A6B] flex items-center justify-center flex-shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0f172a]">
                Accessed <span className="font-semibold">{item.file.name}</span>
              </p>
              <p className="text-xs text-[#64748b]">
                {item.file.size
                  ? formatFileSize(Number(item.file.size))
                  : item.file.extension
                    ? `${item.file.extension.toUpperCase()} file`
                    : "File"}{" "}
                • {item.file.folder?.name ?? "My Drive"}
              </p>
            </div>
          </div>
          <span className="text-xs text-[#64748b] whitespace-nowrap">
            {formatDate(item.accessed_at)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ActivityPage;
