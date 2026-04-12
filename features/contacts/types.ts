export type CreateContactPayload = {
  nom: string;
  profession: string;
  telephone: string;
  email: string;
};

export type UpdateContactPayload = CreateContactPayload & { id: number };
