export type SessionPayload = {
  firstName?: string;
  timezone: string;
  expotoken?: string;
};

export type UpdateUserPayload = {
  newEmail?: string;
  prenom?: string;
  image?: string;
};
