export type LoginPayload = {
  timezone: string;
  expotoken?: string;
};

export type RegisterPayload = {
  email: string;
  prenom: string;
};

export type UpdateUserPayload = {
  newEmail?: string;
  prenom?: string;
  image?: string;
};
