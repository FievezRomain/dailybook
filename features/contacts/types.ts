export type CreateContactPayload = {
  nom: string;
  profession?: string;
  telephone?: string;
  email?: string;
  email_contact?: string;
  emailproprietaire?: string;
  adresse?: string;
};

export type UpdateContactPayload = CreateContactPayload & { id: number };
