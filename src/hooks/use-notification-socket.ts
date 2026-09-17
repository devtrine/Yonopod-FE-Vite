"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

export function useNotificationSocket() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);

  const handleIncomingNotification = useCallback(
    (notification: Notification) => {
      // 1. Show immediate toast alert
      const toastType = mapNotificationTypeToToast(notification.type);
      toast(toastType, `${notification.title}: ${notification.message}`);

      // 2. Prepend to React Query Cache optimistically
      queryClient.setQueriesData<PaginatedResponse<Notification>>(
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

      // 3. Invalidate queries to ensure complete freshness
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    [queryClient]
  );

  useEffect(() => {
    // If no authenticated user, do not connect socket
    if (!user || !user.id) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    function connect() {
      if (!isMounted) return;

      try {
        const wsUrl = getWebSocketUrl();
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;

          // Start ping interval every 25s to keep connection alive
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data: WebSocketEvent = JSON.parse(event.data);
            setLastEvent(data);

            if (data.event === "notification" && data.data) {
              handleIncomingNotification(data.data as Notification);
            }
          } catch (err) {
            console.debug("Non-JSON or unhandled WebSocket message:", event.data, err);
          }
        };

        ws.onclose = (event) => {
          if (!isMounted) return;
          setIsConnected(false);
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

          // Don't auto reconnect if user logged out or explicitly closed
          if (event.code !== 1000 && event.code !== 4001) {
            const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 15000);
            reconnectAttemptsRef.current += 1;
            reconnectTimeoutRef.current = setTimeout(connect, delay);
          }
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setIsConnected(false);
        };
      } catch (err) {
        console.error("Failed to initialize WebSocket:", err);
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
    };
  }, [user, handleIncomingNotification]);

  return {
    isConnected,
    lastEvent,
  };
}
