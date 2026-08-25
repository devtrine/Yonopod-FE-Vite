"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationService from "../services/notification.service";
import type { PaginatedResponse } from "../types/api";
import type {
  Notification,
  ListNotificationsParams,
  CreateNotificationPayload,
  TestNotificationPayload,
} from "../types/notification";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

/**
 * Hook to fetch paginated list of notifications
 */
export function useNotifications(params?: ListNotificationsParams) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params ?? {}],
    queryFn: () => notificationService.listNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to get count of unread notifications
 */
export function useUnreadNotificationsCount() {
  const { data, isLoading } = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "unread-count"],
    queryFn: () => notificationService.listNotifications({ is_read: false, limit: 100 }),
    staleTime: 1000 * 15,
  });

  const unreadCount = data?.pagination?.total ?? (data?.data ? data.data.filter((n) => !n.is_read).length : 0);

  return {
    count: unreadCount,
    isLoading,
  };
}

/**
 * Hook to mark a specific notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      // Optimistically update all notifications queries in cache
      queryClient.setQueriesData<PaginatedResponse<Notification>>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === id
                ? { ...item, is_read: true, read_at: new Date().toISOString() }
                : item
            ),
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      queryClient.setQueriesData<PaginatedResponse<Notification>>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) => ({
              ...item,
              is_read: true,
              read_at: item.read_at || new Date().toISOString(),
            })),
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a single notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      queryClient.setQueriesData<PaginatedResponse<Notification>>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== id),
            pagination: oldData.pagination
              ? {
                  ...oldData.pagination,
                  total: Math.max(0, oldData.pagination.total - 1),
                }
              : oldData.pagination,
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to create a notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) =>
      notificationService.createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to trigger a test notification
 */
export function useTestNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: TestNotificationPayload) =>
      notificationService.testNotification(payload),
    onSuccess: (res) => {
      // Optimistically push the returned notification into query cache
      if (res?.notification) {
        queryClient.setQueriesData<PaginatedResponse<Notification>>(
          { queryKey: NOTIFICATIONS_QUERY_KEY },
          (oldData) => {
            if (!oldData || !oldData.data) return oldData;
            // Prevent duplicates
            if (oldData.data.some((n) => n.id === res.notification.id)) return oldData;
            return {
              ...oldData,
              data: [res.notification, ...oldData.data],
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: oldData.pagination.total + 1,
                  }
                : oldData.pagination,
            };
          }
        );
      }
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}
