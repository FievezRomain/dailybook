import type { ContactFormValues } from '@business/validators/contact';
import type { Contact } from '@models/Contact';

import type { CreateContactPayload, UpdateContactPayload } from './types';

export const emptyContactDraft: ContactFormValues = {
  nom: '',
  profession: '',
  telephone: '',
  email: '',
};

export function contactToDraft(contact?: Contact): ContactFormValues {
  return {
    nom: contact?.nom ?? '',
    profession: contact?.profession ?? '',
    telephone: contact?.telephone ?? '',
    email: contact?.email ?? '',
  };
}

export function buildContactPayload(values: ContactFormValues): CreateContactPayload {
  return {
    nom: values.nom.trim(),
    profession: optionalValue(values.profession),
    telephone: optionalValue(values.telephone),
    email_contact: optionalValue(values.email) ?? undefined,
  };
}

export function buildContactUpdatePayload(values: ContactFormValues, contact: Contact): UpdateContactPayload {
  return { id: contact.id, ...buildContactPayload(values) };
}

export function getContactInitials(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || '?';
}

export function getContactDetails(contact: Contact): string {
  return contact.profession?.trim() || contact.email?.trim() || 'Contact';
}

export function normalizeContactSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

function optionalValue(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}