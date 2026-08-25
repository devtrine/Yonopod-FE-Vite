export type NotificationType = "info" | "success" | "warning" | "error" | "system";

export interface NotificationData {
  action_url?: string;
  test?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  read_at: string | null;
  data: NotificationData | null;
  created_at: string;
  updated_at: string;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
  type?: string;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  data?: NotificationData | null;
}

export interface TestNotificationPayload {
  title?: string;
  message?: string;
  type?: NotificationType;
  data?: NotificationData | null;
}

export interface TestNotificationResponse {
  notification: Notification;
  socket_status: {
    user_connected: boolean;
    delivered: boolean;
  };
}

export interface MarkAllAsReadResponse {
  updated_count: number;
}

export interface WebSocketEvent<T = unknown> {
  event: "connected" | "notification" | "ping" | "pong" | string;
  message?: string;
  userId?: string;
  timestamp?: string;
  data?: T;
}
