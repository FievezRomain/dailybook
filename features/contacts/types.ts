export type CreateContactPayload = {
  nom: string;
  profession?: string;
  telephone?: string;
  email_contact?: string;
  adresse?: string;
};

export type UpdateContactPayload = CreateContactPayload & { id: number };
