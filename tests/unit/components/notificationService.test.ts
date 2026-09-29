import { normalizeNotifications } from '../../../services/api/NotificationService';

const notification = { id: 1, user_id: 2, type: 'event', title: 'Rappel', message: 'Vaccin', is_read: false, created_at: '2026-08-09T10:00:00Z', action_available: false };

describe('normalizeNotifications', () => {
  it('extracts the current backend envelope', () => {
    expect(normalizeNotifications({ notifications: [notification], unreadCount: 1 })).toEqual([notification]);
  });

  it('keeps legacy array responses compatible', () => {
    expect(normalizeNotifications([notification])).toEqual([notification]);
  });

  it('returns an empty list for malformed responses', () => {
    expect(normalizeNotifications(undefined)).toEqual([]);
    expect(normalizeNotifications({ unreadCount: 0 })).toEqual([]);
  });
});
