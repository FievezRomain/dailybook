import type { Notification } from '../../models/Notification';
import type { NotificationType } from '../../shared/components/ui';

export function toNotificationType(type?: string | null): NotificationType {
  if (type === 'group_member' || type === 'group_animal') return 'group';
  if (type === 'system') return 'system';
  return 'reminder';
}

export function formatNotificationTime(value?: string | null, now = new Date()): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 1) return 'À l’instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function isMemberInvitation(notification: Notification): boolean {
  return notification.type === 'group_member' && Boolean(notification.object_id) && notification.action_available === true;
}

export function isAnimalInvitation(notification: Notification): boolean {
  return notification.type === 'group_animal' && Boolean(notification.object_id) && notification.action_available === true;
}
