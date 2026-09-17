"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useTestNotification,
} from "../../hooks/use-notifications";
import type { Notification, NotificationType } from "../../types/notification";

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
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

function NotificationTypeIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "success":
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
      );
    case "warning":
      return (
        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} />
        </div>
      );
    case "error":
      return (
        <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertCircle size={16} />
        </div>
      );
    case "system":
      return (
        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>
      );
    case "info":
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Info size={16} />
        </div>
      );
  }
}

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData, isLoading } = useNotifications({
    limit: 30,
    is_read: filterUnreadOnly ? false : undefined,
  });

  const { count: unreadCount } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();
  const testNotif = useTestNotification();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const notifications = notificationsData?.data || [];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c3fc4]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#ef4444] rounded-full ring-2 ring-white animate-in zoom-in duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#e2e8f0] overflow-hidden z-50 flex flex-col max-h-[560px] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#f1f5f9] flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#0f172a] text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-[#eff1fb] text-[#1c3fc4] rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  disabled={markAllAsRead.isPending}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#1c3fc4] hover:bg-[#eff1fb] rounded-lg transition-colors disabled:opacity-50"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 border-b border-[#f1f5f9] flex items-center gap-2 bg-[#f8fafc]">
            <button
              onClick={() => setFilterUnreadOnly(false)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                !filterUnreadOnly
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterUnreadOnly(true)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterUnreadOnly
                  ? "bg-white text-[#0f172a] shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              Unread only {unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#64748b]">
                <Loader2 size={24} className="animate-spin text-[#1c3fc4] mb-2" />
                <p className="text-xs">Loading notifications…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mb-3">
                  <Bell size={22} />
                </div>
                <p className="text-sm font-medium text-[#0f172a]">No notifications</p>
                <p className="text-xs text-[#64748b] mt-1 max-w-[220px]">
                  {filterUnreadOnly
                    ? "You don't have any unread notifications right now."
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </div>
            ) : (
              notifications.map((item: Notification) => (
                <div
                  key={item.id}
                  className={`group relative p-3.5 flex items-start gap-3 transition-colors ${
                    !item.is_read ? "bg-[#f8fafc]/80 hover:bg-[#f1f5f9]" : "hover:bg-[#f8fafc]"
                  }`}
                >
                  <NotificationTypeIcon type={item.type} />

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          !item.is_read ? "font-semibold text-[#0f172a]" : "font-medium text-[#334155]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#94a3b8] shrink-0">
                        {getRelativeTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed mb-1.5">
                      {item.message}
                    </p>

                    {item.data?.action_url && (
                      <Link
                        to={String(item.data.action_url)}
                        onClick={() => {
                          setIsOpen(false);
                          if (!item.is_read) markAsRead.mutate(item.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1c3fc4] hover:underline"
                      >
                        <span>View detail</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>

                  {/* Unread indicator / Actions */}
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    {!item.is_read && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#1c3fc4] block group-hover:hidden"
                        title="Unread"
                      />
                    )}

                    <div className="hidden group-hover:flex items-center gap-1 bg-white/90 rounded-lg p-0.5 shadow-xs border border-[#e2e8f0]">
                      {!item.is_read && (
                        <button
                          onClick={() => markAsRead.mutate(item.id)}
                          className="p-1 text-[#64748b] hover:text-[#1c3fc4] hover:bg-[#eff1fb] rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotif.mutate(item.id)}
                        className="p-1 text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 border-t border-[#f1f5f9] bg-white flex items-center justify-between gap-2">
            <button
              onClick={() => {
                testNotif.mutate({
                  title: "Real-time Notification",
                  message: `New update received at ${new Date().toLocaleTimeString()}`,
                  type: "info",
                  data: { action_url: "/settings/notifications" },
                });
              }}
              disabled={testNotif.isPending}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#64748b] hover:text-[#1c3fc4] hover:bg-[#eff1fb] rounded-lg transition-colors disabled:opacity-50"
            >
              <Sparkles size={13} className="text-[#1c3fc4]" />
              <span>{testNotif.isPending ? "Sending…" : "Test WebSocket"}</span>
            </button>

            <Link
              to="/settings/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-[#1c3fc4] hover:underline px-2 py-1"
            >
              Settings & All &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
