import type { Group } from '../../../models/Group';
import { getEligibleEventGroups } from '../eventGroupSharing';

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

  it('does not offer group sharing when no animal is selected', () => {
    expect(getEligibleEventGroups([group(1, [10])], [])).toEqual([]);
  });
});
