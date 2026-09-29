import httpClient from './httpClient';
import type { Notification } from '../../models/Notification';

export interface NotificationsResponse {
  notifications?: Notification[];
  unreadCount?: number;
}

export function normalizeNotifications(data: Notification[] | NotificationsResponse | null | undefined): Notification[] {
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.notifications) ? data.notifications : [];
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await httpClient.get('/notifications');
  return normalizeNotifications(response.data);
}

export async function markAllAsRead() {
  const response = await httpClient.patch('/notifications');
  return response.data;
}

export async function setRead(id: number, isRead: boolean): Promise<void> {
  await httpClient.patch(`/notifications/${id}`, { is_read: isRead });
}

export async function deleteNotification(id: number): Promise<void> {
  await httpClient.delete(`/notifications/${id}`);
}
