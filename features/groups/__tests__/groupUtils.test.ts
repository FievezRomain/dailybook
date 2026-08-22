import type { Group } from '../../../models/Group';
import { getAcceptedAnimals, getAcceptedMembers, getAnimalsAvailableForGroupProposal, getGroupInitials, getGroupManagementPermissions, getGroupSummary, getPendingMembers, isGroupManager } from '../groupUtils';

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
    expect(getGroupSummary({ ...group, nb_members: 2, nb_animaux: 2 })).toBe('2 membres · 2 animaux');
    expect(getGroupInitials(group.name)).toBe('CC');
  });

  it('derives group management actions from subscription and contextual role', () => {
    expect(getGroupManagementPermissions(group, 'owner@example.com', true)).toEqual({
      manager: true,
      canAddAnimal: true,
      canInviteMember: true,
    });
    expect(getGroupManagementPermissions(group, 'owner@example.com', false)).toEqual({
      manager: true,
      canAddAnimal: true,
      canInviteMember: false,
    });
    expect(getGroupManagementPermissions(group, 'member@example.com', false)).toEqual({
      manager: false,
      canAddAnimal: true,
      canInviteMember: false,
    });
    expect(getGroupManagementPermissions(group, 'member@example.com', true)).toEqual({
      manager: false,
      canAddAnimal: true,
      canInviteMember: false,
    });
  });

  it('tolerates missing nested production data', () => {
    const legacy: Group = { id: 2, name: 'Famille' };
    expect(getAcceptedMembers(legacy)).toEqual([]);
    expect(getGroupSummary(legacy)).toBe('0 membre · 0 animal');
  });

  it('only proposes owned animals while keeping existing group animals visible', () => {
    const animals = [
      { id: 1, nom: 'Propriétaire', espece: 'chien', provenance: 'owner' },
      { id: 2, nom: 'Déjà présent', espece: 'chat', provenance: 'group' },
      { id: 3, nom: 'Autre groupe', espece: 'cheval', provenance: 'group' },
    ];
    expect(getAnimalsAvailableForGroupProposal(animals, [2]).map(({ id }) => id)).toEqual([1, 2]);
  });
});
