import { contactFormSchema } from '@business/validators/contact';

import { buildContactPayload, contactToDraft, getContactInitials, normalizeContactSearch } from '../contactUtils';

describe('contactUtils', () => {
  it('maps the visible email field to the backend email_contact field', () => {
    expect(buildContactPayload({ nom: ' Claire Martin ', profession: ' Vétérinaire ', telephone: '', email: ' claire@clinique.fr ' })).toEqual({
      nom: 'Claire Martin',
      profession: 'Vétérinaire',
      telephone: null,
      email_contact: 'claire@clinique.fr',
    });
  });

  it('hydrates nullable backend fields as editable strings', () => {
    expect(contactToDraft({ id: 4, nom: 'Alex', profession: null, telephone: null, email: null })).toEqual({ nom: 'Alex', profession: '', telephone: '', email: '' });
  });

  it('validates the required name and optional email', () => {
    expect(contactFormSchema.safeParse({ nom: '', profession: '', telephone: '', email: '' }).success).toBe(false);
    expect(contactFormSchema.safeParse({ nom: 'Alex', profession: '', telephone: '', email: 'incorrect' }).success).toBe(false);
    expect(contactFormSchema.safeParse({ nom: 'Alex', profession: '', telephone: '', email: '' }).success).toBe(true);
  });

  it('supports initials and accent-insensitive search', () => {
    expect(getContactInitials('Claire Martin')).toBe('CM');
    expect(normalizeContactSearch(' Vétérinaire ')).toBe('veterinaire');
  });
});