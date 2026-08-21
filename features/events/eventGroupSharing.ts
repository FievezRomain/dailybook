import type { Group } from '../../models/Group';
import { getAcceptedAnimals } from '../groups/groupUtils';

export function getEligibleEventGroups(groups: readonly Group[], animalIds: readonly number[]) {
  if (!animalIds.length) return [];
  return groups.filter((group) => {
    const acceptedIds = new Set(getAcceptedAnimals(group).map((animal) => animal.id));
    return animalIds.every((animalId) => acceptedIds.has(animalId));
  });
}
