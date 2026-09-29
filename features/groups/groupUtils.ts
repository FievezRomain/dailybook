import type { Group, GroupAnimal, GroupBucket } from '../../models/Group';
import type { GroupMember } from '../../models/GroupMember';
import type { Animal } from '../../models/Animal';

export function getGroupBucketItems<T>(buckets: GroupBucket<T>[] | null | undefined, type: GroupBucket<T>['type']): T[] {
  return buckets?.find((bucket) => bucket.type === type)?.items ?? [];
}

export function getAcceptedMembers(group: Group): GroupMember[] {
  return getGroupBucketItems(group.data?.members, 'accepted');
}

export function getPendingMembers(group: Group): GroupMember[] {
  return getGroupBucketItems(group.data?.members, 'pending');
}

export function getAcceptedAnimals(group: Group): GroupAnimal[] {
  return getGroupBucketItems(group.data?.animals, 'accepted');
}

export function getPendingAnimals(group: Group): GroupAnimal[] {
  return getGroupBucketItems(group.data?.animals, 'pending');
}

export function isGroupManager(group: Group, email?: string | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.trim().toLocaleLowerCase();
  return getAcceptedMembers(group).some((member) => member.email.trim().toLocaleLowerCase() === normalizedEmail && member.role === 'manager');
}

export function getGroupSummary(group: Group): string {
  const memberCount = group.nb_members ?? getAcceptedMembers(group).length;
  const animalCount = group.nb_animaux ?? getAcceptedAnimals(group).length;
  return `${memberCount} membre${memberCount > 1 ? 's' : ''} · ${animalCount} ${animalCount > 1 ? 'animaux' : 'animal'}`;
}

export function getAnimalsAvailableForGroupProposal(animals: readonly Animal[], existingAnimalIds: readonly number[]): Animal[] {
  const existingIds = new Set(existingAnimalIds);
  return animals.filter((animal) => existingIds.has(animal.id) || animal.provenance?.trim().toLocaleLowerCase('fr-FR') !== 'group');
}

export function getGroupManagementPermissions(
  group: Group,
  email: string | null | undefined,
  premium: boolean,
) {
  const manager = isGroupManager(group, email);
  return {
    manager,
    canAddAnimal: true,
    canInviteMember: premium && manager,
  };
}

export function getGroupInitials(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || '?';
}
