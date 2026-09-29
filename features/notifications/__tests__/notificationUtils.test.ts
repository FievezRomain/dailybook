import { formatNotificationTime, isAnimalInvitation, isMemberInvitation, toNotificationType } from '../notificationUtils';

describe('notificationUtils', () => {
  const base = { id: 1, user_id: 2, title: 'Invitation', message: '', is_read: false, created_at: '', proposed_by: 'Camille' };
  it('maps backend notification types to the shared visual variants', () => {
    expect(toNotificationType('group_member')).toBe('group');
    expect(toNotificationType('group_animal')).toBe('group');
    expect(toNotificationType('system')).toBe('system');
    expect(toNotificationType('event')).toBe('reminder');
  });

  it('identifies actionable animal proposals', () => {
    expect(isAnimalInvitation({ ...base, type: 'group_animal', object_id: 4, action_available: true })).toBe(true);
    expect(isAnimalInvitation({ ...base, type: 'group_animal', object_id: 4, action_available: false })).toBe(false);
    expect(isAnimalInvitation({ ...base, type: 'group_member', object_id: 4, action_available: true })).toBe(false);
  });

  it('formats recent timestamps in French', () => {
    const now = new Date('2026-08-13T12:00:00Z');
    expect(formatNotificationTime('2026-08-13T11:55:00Z', now)).toBe('Il y a 5 min');
    expect(formatNotificationTime('2026-08-12T12:00:00Z', now)).toBe('Il y a 1 j');
  });

  it('only exposes direct actions for pending member invitations', () => {
    expect(isMemberInvitation({ ...base, type: 'group_member', object_id: 4, action_available: true })).toBe(true);
    expect(isMemberInvitation({ ...base, type: 'group_member', object_id: 4, action_available: false })).toBe(false);
    expect(isMemberInvitation({ ...base, type: 'group_animal', object_id: 4, action_available: true })).toBe(false);
  });
});
