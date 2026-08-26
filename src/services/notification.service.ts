import { api } from "../lib/api/client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Notification,
  ListNotificationsParams,
  CreateNotificationPayload,
  TestNotificationPayload,
  TestNotificationResponse,
  MarkAllAsReadResponse,
} from "../types/notification";

/**
 * Fetch paginated list of notifications
 */
export async function listNotifications(
  params?: ListNotificationsParams
): Promise<PaginatedResponse<Notification>> {
  const { data } = await api.get<PaginatedResponse<Notification>>("/notifications", {
    params,
  });
  return data;
}

/**
 * Fetch single notification by ID
 */
export async function getNotification(id: string): Promise<Notification> {
  const { data } = await api.get<ApiResponse<Notification>>(`/notifications/${id}`);
  return data.data;
}

/**
 * Create a new notification
 */
export async function createNotification(
  payload: CreateNotificationPayload
): Promise<Notification> {
  const { data } = await api.post<ApiResponse<Notification>>("/notifications", payload);
  return data.data;
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
  const { data } = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
  return data.data;
}

/**
 * Mark all notifications as read for current authenticated user
 */
export async function markAllAsRead(): Promise<MarkAllAsReadResponse> {
  const { data } = await api.patch<ApiResponse<MarkAllAsReadResponse>>("/notifications/read-all");
  return data.data;
}

/**
 * Delete a notification by ID
 */
export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/notifications/${id}`);
}

/**
 * Trigger a test notification broadcast via backend WebSocket
 */
export async function testNotification(
  payload?: TestNotificationPayload
): Promise<TestNotificationResponse> {
  const { data } = await api.post<ApiResponse<TestNotificationResponse>>(
    "/notifications/test",
    payload || {}
  );
  return data.data;
}
