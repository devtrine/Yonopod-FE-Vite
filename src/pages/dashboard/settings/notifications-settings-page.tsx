"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  Send,
  Wifi,
  WifiOff,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useTestNotification,
} from "../../../hooks/use-notifications";
import { useNotificationSocket } from "../../../hooks/use-notification-socket";
import type { Notification, NotificationType } from "../../../types/notification";

function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return "Just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

function NotificationTypeBadge({ type }: { type: NotificationType }) {
  switch (type) {
    case "success":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} />
          Success
        </span>
      );
    case "warning":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle size={12} />
          Warning
        </span>
      );
    case "error":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle size={12} />
          Error
        </span>
      );
    case "system":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles size={12} />
          System
        </span>
      );
    case "info":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Info size={12} />
          Info
        </span>
      );
  }
}

export function NotificationsSettingsPage() {
  const [page, setPage] = useState(1);
  const [filterReadStatus, setFilterReadStatus] = useState<"all" | "unread" | "read">("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Test form state
  const [testTitle, setTestTitle] = useState("System Alert");
  const [testMessage, setTestMessage] = useState("Your cloud storage space was successfully synced.");
  const [testType, setTestType] = useState<NotificationType>("info");

  // WebSocket status
  const { isConnected } = useNotificationSocket();

  // Queries & mutations
  const isReadParam =
    filterReadStatus === "unread" ? false : filterReadStatus === "read" ? true : undefined;
  const typeParam = filterType !== "all" ? filterType : undefined;

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    limit: 10,
    is_read: isReadParam,
    type: typeParam,
  });

  const { count: unreadCount } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();
  const testNotif = useTestNotification();

  const notifications = notificationsData?.data || [];
  const pagination = notificationsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testMessage.trim()) return;

    testNotif.mutate({
      title: testTitle,
      message: testMessage,
      type: testType,
      data: {
        action_url: "/files",
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#0f172a]">Notification Center</h1>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
              title={isConnected ? "Real-time WebSocket active" : "Connecting to WebSocket"}
            >
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isConnected ? "Live Socket Online" : "Socket Reconnecting"}</span>
            </div>
          </div>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your real-time notification feeds, test broadcasts, and view system alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-[#eff1fb] text-[#1c3fc4] hover:bg-[#e0e4f8] transition-colors disabled:opacity-50"
            >
              <CheckCheck size={16} />
              <span>Mark all read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Broadcast Testing Card */}
      <div className="p-5 rounded-2xl border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-white shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#0f172a]">Test Real-time WebSocket Broadcast</h2>
            <p className="text-xs text-[#64748b]">
              Trigger backend endpoint <code className="bg-[#f1f5f9] px-1 py-0.5 rounded">POST /api/v1/notifications/test</code> to broadcast directly to your active browser socket.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendTest} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-[#475569] mb-1">Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-xl border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]"
              placeholder="Notification Title"
              required
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-[#475569] mb-1">Message</label>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-xl border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4]"
              placeholder="Message body"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-[#475569] mb-1">Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as NotificationType)}
              className="w-full px-3 py-1.5 text-sm rounded-xl border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#1c3fc4] bg-white"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="sm:col-span-12 flex justify-end">
            <button
              type="submit"
              disabled={testNotif.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#1c3fc4] text-white hover:bg-[#16329e] transition-colors disabled:opacity-50 shadow-xs"
            >
              <Send size={15} />
              <span>{testNotif.isPending ? "Broadcasting…" : "Send Test Notification"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and List Container */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3 bg-[#fafbfc]">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#64748b]" />
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Filters
            </span>

            {/* Read status filter */}
            <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-0.5 text-xs">
              <button
                onClick={() => {
                  setFilterReadStatus("all");
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterReadStatus === "all"
                    ? "bg-[#eff1fb] text-[#1c3fc4]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilterReadStatus("unread");
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterReadStatus === "unread"
                    ? "bg-[#eff1fb] text-[#1c3fc4]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => {
                  setFilterReadStatus("read");
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterReadStatus === "read"
                    ? "bg-[#eff1fb] text-[#1c3fc4]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                Read
              </button>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="text-xs rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1 text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#1c3fc4]"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="text-xs text-[#64748b]">
            Total: <span className="font-semibold text-[#0f172a]">{pagination.total}</span>{" "}
            notifications
          </div>
        </div>

        {/* Notifications list */}
        <div className="divide-y divide-[#f1f5f9]">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-[#64748b]">
              Loading notification records…
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mx-auto mb-3">
                <Bell size={22} />
              </div>
              <p className="text-sm font-semibold text-[#0f172a]">No notifications found</p>
              <p className="text-xs text-[#64748b] mt-1">
                Try clearing filters or send a test notification above.
              </p>
            </div>
          ) : (
            notifications.map((item: Notification) => (
              <div
                key={item.id}
                className={`p-4 flex items-start gap-4 transition-colors ${
                  !item.is_read ? "bg-[#f8fafc]/90" : "hover:bg-[#fafbfc]"
                }`}
              >
                <div className="pt-0.5">
                  <NotificationTypeBadge type={item.type} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3
                      className={`text-sm ${
                        !item.is_read ? "font-bold text-[#0f172a]" : "font-medium text-[#334155]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-xs text-[#94a3b8] whitespace-nowrap">
                      {getRelativeTime(item.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed mb-2">{item.message}</p>

                  {item.data && (
                    <div className="flex items-center gap-3">
                      {item.data.action_url && (
                        <a
                          href={String(item.data.action_url)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1c3fc4] hover:underline"
                        >
                          <span>Open link</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  {!item.is_read && (
                    <button
                      onClick={() => markAsRead.mutate(item.id)}
                      disabled={markAsRead.isPending}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#1c3fc4] bg-[#eff1fb] hover:bg-[#e0e4f8] transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotif.mutate(item.id)}
                    disabled={deleteNotif.isPending}
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-[#f1f5f9] flex items-center justify-between bg-[#fafbfc]">
            <p className="text-xs text-[#64748b]">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:text-[#0f172a] disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:text-[#0f172a] disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default NotificationsSettingsPage;
