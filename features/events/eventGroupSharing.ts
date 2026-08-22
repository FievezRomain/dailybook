import type { Group } from '../../models/Group';
import type { Animal } from '../../models/Animal';
import { getAcceptedAnimals } from '../groups/groupUtils';

export function getEligibleEventGroups(groups: readonly Group[], animalIds: readonly number[]) {
  const selectedIds = [...new Set(animalIds.map(Number).filter(Number.isInteger))];
  if (!selectedIds.length) return [];
  return groups.filter((group) => {
    const acceptedIds = new Set(getAcceptedAnimals(group).map((animal) => Number(animal.id)).filter(Number.isInteger));
    return selectedIds.every((animalId) => acceptedIds.has(animalId));
  });
}

export function getAllowedEventAnimals(animals: readonly Animal[], groups: readonly Group[], sharedGroupIds: readonly number[]) {
  if (!sharedGroupIds.length) return [...animals];
  const selectedGroups = groups.filter((group) => sharedGroupIds.includes(group.id));
  if (selectedGroups.length !== sharedGroupIds.length) return [];
  return animals.filter((animal) => {
    return selectedGroups.every((group) => getAcceptedAnimals(group).some((accepted) => accepted.id === animal.id));
  });
}
