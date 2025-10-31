// src/apis/notificationApi.ts
import api from "./api";

/* ---------- TYPES ---------- */
export interface Project {
  _id: string;
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  message: string;
  type: "task_assigned" | "task_updated";
  taskId?: Task | null;
  projectId?: Project | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/* API response shapes */
export interface NotificationResponse {
  message: string;
  notifications: NotificationItem[];
  unreadCount: number;
}

export interface MarkReadResponse {
  message: string;
  notification: NotificationItem;
}

export interface GenericMessage {
  message: string;
}

/* ---------- NOTIFICATION APIs ---------- */

/** GET – all notifications for the logged‑in user */
export const getAdminNotifications = async (): Promise<NotificationResponse> => {
  const response = await api.get<NotificationResponse>("/notifications/all");
  return response.data;
};

/** PATCH – mark a single notification as read */
export const markAsRead = async (id: string): Promise<MarkReadResponse> => {
  const response = await api.patch<MarkReadResponse>(`/notifications/${id}/read`);
  return response.data;
};

/** PATCH – mark **all** notifications as read */
export const markAllAsRead = async (): Promise<GenericMessage> => {
  const response = await api.patch<GenericMessage>("/notifications/mark-all-read");
  return response.data;
};

/** DELETE – remove a notification */
export const deleteNotification = async (id: string): Promise<GenericMessage> => {
  const response = await api.delete<GenericMessage>(`/notifications/${id}`);
  return response.data;
};

/** (Optional) GET – unread count only – useful for the badge */
export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await api.get<{ unreadCount: number }>("/notifications/unread-count");
  return response.data;
};