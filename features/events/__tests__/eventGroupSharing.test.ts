import type { Group } from '../../../models/Group';
import type { Animal } from '../../../models/Animal';
import { getAllowedEventAnimals, getEligibleEventGroups } from '../eventGroupSharing';

const group = (id: number, accepted: number[], pending: number[] = []): Group => ({
  id,
  name: `Groupe ${id}`,
  data: {
    animals: [
      { type: 'accepted', items: accepted.map((animalId) => ({ id: animalId, nom: `Animal ${animalId}` })) },
      { type: 'pending', items: pending.map((animalId) => ({ id: animalId, nom: `Animal ${animalId}` })) },
    ],
  },
});

describe('getEligibleEventGroups', () => {
  it('keeps only groups where every event animal is accepted', () => {
    expect(getEligibleEventGroups([
      group(1, [10, 20]),
      group(2, [10], [20]),
      group(3, [10, 20, 30]),
    ], [10, 20]).map(({ id }) => id)).toEqual([1, 3]);
  });

  it('matches numeric animal ids even when the backend serialized a group animal id as text', () => {
    const serializedGroup = group(1, []) as Group;
    serializedGroup.data!.animals![0].items = [{ id: '10', nom: 'Animal 10' } as never];
    expect(getEligibleEventGroups([serializedGroup], [10]).map(({ id }) => id)).toEqual([1]);
  });

  it('does not offer group sharing when no animal is selected', () => {
    expect(getEligibleEventGroups([group(1, [10])], [])).toEqual([]);
  });

  it('offers the originating group for an animal shared with the user', () => {
    const animals = [{ id: 10, nom: 'Partagé', provenance: 'group' }] as Animal[];
    expect(getEligibleEventGroups([group(1, [10]), group(2, [20])], [10]).map(({ id }) => id)).toEqual([1]);
  });

  it('only allows animals accepted by every group already sharing the event', () => {
    const animals = [
      { id: 10, nom: 'Propriétaire', provenance: 'owner' },
      { id: 20, nom: 'Absent du second groupe', provenance: 'owner' },
      { id: 30, nom: 'Partagé', provenance: 'group' },
    ] as Animal[];

    expect(getAllowedEventAnimals(animals, [group(1, [10, 20, 30]), group(2, [10, 30])], [1, 2]).map(({ id }) => id)).toEqual([10, 30]);
  });
});
