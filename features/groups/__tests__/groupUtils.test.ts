import type { Group } from '../../../models/Group';
import { getAcceptedAnimals, getAcceptedMembers, getGroupInitials, getGroupSummary, getPendingMembers, isGroupManager } from '../groupUtils';

const group: Group = {
  id: 1,
  name: 'Club canin',
  informations: 'Sorties communes',
  data: {
    members: [
      { type: 'pending', items: [{ email: 'invite@example.com' }] },
      { type: 'accepted', items: [{ email: 'owner@example.com', prenom: 'Camille', role: 'manager' }] },
    ],
    animals: [
      { type: 'pending', items: [{ id: 2, nom: 'Plume' }] },
      { type: 'accepted', items: [{ id: 1, nom: 'Milo' }] },
    ],
  },
};

describe('groupUtils', () => {
  it('extracts pending and accepted buckets', () => {
    expect(getAcceptedMembers(group)).toHaveLength(1);
    expect(getPendingMembers(group)[0]?.email).toBe('invite@example.com');
    expect(getAcceptedAnimals(group)[0]?.nom).toBe('Milo');
  });

  it('detects the current manager case-insensitively', () => {
    expect(isGroupManager(group, 'OWNER@example.com')).toBe(true);
    expect(isGroupManager(group, 'invite@example.com')).toBe(false);
  });

  it('builds counts and initials from fallback data', () => {
    expect(getGroupSummary(group)).toBe('1 membre · 1 animal');
    expect(getGroupInitials(group.name)).toBe('CC');
  });

  it('tolerates missing nested production data', () => {
    const legacy: Group = { id: 2, name: 'Famille' };
    expect(getAcceptedMembers(legacy)).toEqual([]);
    expect(getGroupSummary(legacy)).toBe('0 membre · 0 animal');
  });
});