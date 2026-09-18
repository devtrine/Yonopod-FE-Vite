"use client";

import { useEffect, useState } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { toast, ToastType } from "../components/ui/toaster";
import { NOTIFICATIONS_QUERY_KEY } from "./use-notifications";
import type { PaginatedResponse } from "../types/api";
import type { Notification, WebSocketEvent } from "../types/notification";

function getWebSocketUrl(): string {
  const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:6767";
  const url = new URL(rawBase);
  const protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${url.host}/api/v1/ws`;
}

function mapNotificationTypeToToast(type: string): ToastType {
  switch (type) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "error";
    default:
      return "info";
  }
}

// ─── Module-level Singleton State ─────────────────────────────────────────────

interface SocketState {
  isConnected: boolean;
  lastEvent: WebSocketEvent | null;
}

let activeWs: WebSocket | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
let currentUserId: string | null = null;
let activeQueryClient: QueryClient | null = null;

const subscribers = new Set<(state: SocketState) => void>();
const handledNotificationIds = new Set<string>();

let sharedState: SocketState = {
  isConnected: false,
  lastEvent: null,
};

function notifySubscribers() {
  subscribers.forEach((callback) => callback(sharedState));
}

function handleIncomingNotification(notification: Notification) {
  // Deduplicate by notification ID with 10s TTL
  if (notification.id && handledNotificationIds.has(notification.id)) {
    return;
  }
  if (notification.id) {
    handledNotificationIds.add(notification.id);
    setTimeout(() => {
      handledNotificationIds.delete(notification.id);
    }, 10000);
  }

  // 1. Show immediate toast alert
  const toastType = mapNotificationTypeToToast(notification.type);
  toast(toastType, notification.message, notification.title);

  // 2. Optimistically update React Query Cache if activeQueryClient is set
  if (activeQueryClient) {
    activeQueryClient.setQueriesData<PaginatedResponse<Notification>>(
      { queryKey: NOTIFICATIONS_QUERY_KEY },
      (old) => {
        if (!old || !old.data) return old;
        if (old.data.some((item) => item.id === notification.id)) {
          return old;
        }
        return {
          ...old,
          data: [notification, ...old.data],
          pagination: old.pagination
            ? {
                ...old.pagination,
                total: old.pagination.total + 1,
              }
            : old.pagination,
        };
      }
    );

    activeQueryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    activeQueryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    activeQueryClient.invalidateQueries({ queryKey: ["recent"] });
  }
}

function connectWebSocket(userId: string) {
  if (
    activeWs &&
    (activeWs.readyState === WebSocket.OPEN || activeWs.readyState === WebSocket.CONNECTING)
  ) {
    if (currentUserId === userId) {
      return; // Already connecting or connected for this user
    }
    // Disconnect previous user
    activeWs.close(1000, "Switching user");
    activeWs = null;
  }

  currentUserId = userId;

  try {
    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    activeWs = ws;

    ws.onopen = () => {
      sharedState = { ...sharedState, isConnected: true };
      notifySubscribers();
      reconnectAttempts = 0;

      if (pingInterval) clearInterval(pingInterval);
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 25000);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        sharedState = { ...sharedState, lastEvent: data };
        notifySubscribers();

        if (data.event === "notification" && data.data) {
          handleIncomingNotification(data.data as Notification);
        }
      } catch (err) {
        console.debug("Non-JSON or unhandled WebSocket message:", event.data, err);
      }
    };

    ws.onclose = (event) => {
      sharedState = { ...sharedState, isConnected: false };
      notifySubscribers();
      if (pingInterval) clearInterval(pingInterval);

      // Reconnect if not cleanly closed
      if (event.code !== 1000 && event.code !== 4001 && currentUserId) {
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 15000);
        reconnectAttempts += 1;
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          if (currentUserId) connectWebSocket(currentUserId);
        }, delay);
      }
    };

    ws.onerror = () => {
      sharedState = { ...sharedState, isConnected: false };
      notifySubscribers();
    };
  } catch (err) {
    console.error("Failed to initialize WebSocket:", err);
  }
}

function disconnectWebSocket() {
  currentUserId = null;
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  if (pingInterval) clearInterval(pingInterval);
  if (activeWs) {
    activeWs.close(1000, "Logged out");
    activeWs = null;
  }
  sharedState = { isConnected: false, lastEvent: null };
  notifySubscribers();
}

export function useNotificationSocket() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [state, setState] = useState<SocketState>(sharedState);

  useEffect(() => {
    activeQueryClient = queryClient;
  }, [queryClient]);

  useEffect(() => {
    const subscriber = (newState: SocketState) => {
      setState(newState);
    };
    subscribers.add(subscriber);

    if (user?.id) {
      connectWebSocket(user.id);
    } else {
      disconnectWebSocket();
    }

    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && !user?.id) {
        disconnectWebSocket();
      }
    };
  }, [user?.id]);

  return {
    isConnected: state.isConnected,
    lastEvent: state.lastEvent,
  };
}
