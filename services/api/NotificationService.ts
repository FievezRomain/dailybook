import httpClient from './httpClient';

export async function getNotifications() {
  const response = await httpClient.get('/notifications');
  return response.data;
}

export async function markAllAsRead() {
  const response = await httpClient.patch('/notifications');
  return response.data;
}
