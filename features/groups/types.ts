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
  user_id: number;
};
