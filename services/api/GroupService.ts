import httpClient from './httpClient';
import { createCrudService } from './factory';
import {
  CreateGroupPayload,
  UpdateGroupPayload,
  RemoveMemberPayload,
  InviteMembersPayload,
  RespondInvitationPayload,
  ProposeAnimalPayload,
  RespondAnimalSharePayload,
  GroupInvitation,
  PendingAnimalShare,
} from '../../features/groups/types';
import { Group } from '../../models/Group';
import { Animal } from '../../models/Animal';

// ─── Groupes ──────────────────────────────────────────────────────────────────────────────────

const _crud = createCrudService<Group, CreateGroupPayload, UpdateGroupPayload>('/groups');

export const getGroups = _crud.getAll;
export const createGroup = _crud.create;
export const updateGroup = _crud.update;
export const deleteGroup = _crud.remove;

export async function removeMember(groupId: string, body: RemoveMemberPayload): Promise<void> {
  await httpClient.delete(`/groups/${groupId}/members`, { data: body });
}

// ─── Invitations membres ──────────────────────────────────────────────────────

export async function inviteMembers(groupId: string, body: InviteMembersPayload): Promise<void> {
  await httpClient.post(`/groups/${groupId}/invitations`, body);
}

export async function getInvitations(): Promise<GroupInvitation[]> {
  const response = await httpClient.get('/invitations');
  return response.data;
}

export async function respondInvitation(
  invitationId: string,
  body: RespondInvitationPayload,
): Promise<void> {
  await httpClient.patch(`/invitations/${invitationId}`, body);
}

// ─── Partage d'animaux ────────────────────────────────────────────────────────

export async function getGroupAnimals(groupId: string): Promise<Animal[]> {
  const response = await httpClient.get(`/groups/${groupId}/animals`);
  return response.data;
}

export async function proposeAnimal(groupId: string, body: ProposeAnimalPayload): Promise<void> {
  await httpClient.post(`/groups/${groupId}/animals`, body);
}

export async function getPendingAnimalShares(groupId: string): Promise<PendingAnimalShare[]> {
  const response = await httpClient.get(`/groups/${groupId}/animal-shares/pending`);
  return response.data;
}

export async function respondAnimalShare(
  shareId: string,
  body: RespondAnimalSharePayload,
): Promise<void> {
  await httpClient.patch(`/animal-shares/${shareId}`, body);
}

export async function removeGroupAnimal(groupId: string, animalId: string): Promise<void> {
  await httpClient.delete(`/groups/${groupId}/animals/${animalId}`);
}
