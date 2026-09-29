export type CreateGroupPayload = {
  name: string;
  informations?: string;
};

export type UpdateGroupPayload = CreateGroupPayload & { id: number };

export type InviteMembersPayload = {
  members: string[];
};

export type RespondInvitationPayload = {
  status: 'accepted' | 'declined';
  email?: string;
};

export type ProposeAnimalPayload = {
  animals: number[];
};

export type RespondAnimalSharePayload = {
  status: 'accepted' | 'declined';
  animaux?: number[];
};

export type RemoveMemberPayload = {
  email: string;
};

export type GroupInvitation = {
  id: number;
  group_id: number;
  email: string;
  status: 'pending';
  proposed_by?: number | null;
  group_name?: string | null;
  proposed_by_name?: string | null;
  created_at?: string | null;
};

export type PendingAnimalShare = {
  id: number;
  group_id: number;
  animal_id: number;
  status: 'pending';
  animal_name?: string | null;
  proposed_by?: number | null;
  proposed_by_name?: string | null;
};
