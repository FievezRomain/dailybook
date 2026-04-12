import httpClient from './httpClient';

// ─── Groupes ──────────────────────────────────────────────────────────────────

export async function getGroups() {
  const response = await httpClient.get('/groups');
  return response.data;
}

export async function createGroup(body: Record<string, unknown>) {
  const response = await httpClient.post('/groups', body);
  return response.data;
}

export async function updateGroup(groupId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/groups/${groupId}`, body);
  return response.data;
}

export async function deleteGroup(groupId: string) {
  const response = await httpClient.delete(`/groups/${groupId}`);
  return response.data;
}

export async function removeMember(groupId: string, body: Record<string, unknown>) {
  const response = await httpClient.delete(`/groups/${groupId}/members`, { data: body });
  return response.data;
}

// ─── Invitations membres ──────────────────────────────────────────────────────

export async function inviteMembers(groupId: string, body: Record<string, unknown>) {
  const response = await httpClient.post(`/groups/${groupId}/invitations`, body);
  return response.data;
}

export async function getInvitations() {
  const response = await httpClient.get('/invitations');
  return response.data;
}

export async function respondInvitation(
  invitationId: string,
  body: Record<string, unknown>,
) {
  const response = await httpClient.patch(`/invitations/${invitationId}`, body);
  return response.data;
}

// ─── Partage d'animaux ────────────────────────────────────────────────────────

export async function getGroupAnimals(groupId: string) {
  const response = await httpClient.get(`/groups/${groupId}/animals`);
  return response.data;
}

export async function proposeAnimal(groupId: string, body: Record<string, unknown>) {
  const response = await httpClient.post(`/groups/${groupId}/animals`, body);
  return response.data;
}

export async function getPendingAnimalShares(groupId: string) {
  const response = await httpClient.get(`/groups/${groupId}/animal-shares/pending`);
  return response.data;
}

export async function respondAnimalShare(
  shareId: string,
  body: Record<string, unknown>,
) {
  const response = await httpClient.patch(`/animal-shares/${shareId}`, body);
  return response.data;
}
