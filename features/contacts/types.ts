export type CreateContactPayload = {
  nom: string;
  profession?: string | null;
  telephone?: string | null;
  email_contact?: string;
};

export type UpdateContactPayload = CreateContactPayload & { id: number };
