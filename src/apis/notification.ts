import type { GenericMessage, MarkReadResponse, NotificationResponse } from "../types/type";
import api from "./api";


/* ---------- NOTIFICATION APIs ---------- */

export const getUserNotifications = async (): Promise<NotificationResponse> => {
  const response = await api.get<NotificationResponse>("/notifications");
  return response.data;
};

export const markAsRead = async (id: string): Promise<MarkReadResponse> => {
  const response = await api.patch<MarkReadResponse>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<GenericMessage> => {
  const response = await api.patch<GenericMessage>("/notifications/mark-all-read");
  return response.data;
};

export const deleteNotification = async (id: string): Promise<GenericMessage> => {
  const response = await api.delete<GenericMessage>(`/notifications/${id}`);
  return response.data;
};

export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await api.get<{ unreadCount: number }>("/notifications/unread-count");
  return response.data;
};