import { Notification } from '../../models/Notification';

export type MarkNotificationsReadPayload = {
  ids?: number[];
};

export type NotificationListProps = {
  notifications: Notification[];
  onRead?: () => void;
};
