import { emailSchema, signUpSchema } from '../../../business/validators/auth';
import { contactFormSchema } from '../../../business/validators/contact';
import { groupDetailsSchema } from '../../../business/validators/group';
import { noteFormSchema } from '../../../business/validators/note';
import { STORAGE_TEXT_LIMITS } from '../../../business/validators/storageLimits';
import { wishFormSchema } from '../../../business/validators/wish';
import { getEventTextLimitError } from '../../../features/events/eventCreationUtils';
import { objectiveDetailsSchema } from '../../../features/objectifs/objectiveFormUtils';

describe('database-aligned text limits', () => {
  it('aligns contacts with varchar(50)', () => {
    const base = { profession: '', telephone: '', email: '' };
    expect(contactFormSchema.safeParse({ ...base, nom: 'a'.repeat(STORAGE_TEXT_LIMITS.contact) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, nom: 'a'.repeat(STORAGE_TEXT_LIMITS.contact + 1) }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, nom: 'Alice', profession: 'a'.repeat(51) }).success).toBe(false);
  });

  it('aligns notes, wishes and objectives with their persisted columns', () => {
    expect(noteFormSchema.safeParse({ titre: 'a'.repeat(50), note: 'Contenu' }).success).toBe(true);
    expect(noteFormSchema.safeParse({ titre: 'a'.repeat(51), note: 'Contenu' }).success).toBe(false);
    expect(wishFormSchema.safeParse({ nom: 'a'.repeat(50), url: '', prix: '', destinataire: 'a'.repeat(50) }).success).toBe(true);
    expect(wishFormSchema.safeParse({ nom: 'a'.repeat(51), url: '', prix: '', destinataire: '' }).success).toBe(false);
    expect(objectiveDetailsSchema.safeParse({ title: 'a'.repeat(200), datedebut: '2026-10-14', datefin: '2026-10-14' }).success).toBe(true);
    expect(objectiveDetailsSchema.safeParse({ title: 'a'.repeat(201), datedebut: '2026-10-14', datefin: '2026-10-14' }).success).toBe(false);
  });

  it('uses the same group limits on every client', () => {
    expect(groupDetailsSchema.safeParse({
      name: 'a'.repeat(STORAGE_TEXT_LIMITS.groupName),
      informations: 'a'.repeat(STORAGE_TEXT_LIMITS.groupInformation),
    }).success).toBe(true);
    expect(groupDetailsSchema.safeParse({ name: 'a'.repeat(STORAGE_TEXT_LIMITS.groupName + 1), informations: '' }).success).toBe(false);
    expect(groupDetailsSchema.safeParse({ name: 'Groupe', informations: 'a'.repeat(STORAGE_TEXT_LIMITS.groupInformation + 1) }).success).toBe(false);
  });

  it('aligns account identity with the user table', () => {
    expect(emailSchema.safeParse(`${'a'.repeat(64)}@example-long.fr`).success).toBe(true);
    expect(emailSchema.safeParse(`${'a'.repeat(64)}@example-long.com`).success).toBe(false);
    expect(signUpSchema.safeParse({ email: 'a@test.fr', prenom: 'a'.repeat(20), password: 'Password!123', password_confirm: 'Password!123' }).success).toBe(true);
    expect(signUpSchema.safeParse({ email: 'a@test.fr', prenom: 'a'.repeat(21), password: 'Password!123', password_confirm: 'Password!123' }).success).toBe(false);
  });

  it('rejects event text beyond the event table limits', () => {
    expect(getEventTextLimitError({ nom: 'a'.repeat(100), lieu: 'a'.repeat(100), state: 'a'.repeat(20) })).toBeUndefined();
    expect(getEventTextLimitError({ nom: 'a'.repeat(101) })).toContain('100');
    expect(getEventTextLimitError({ categoriedepense: 'a'.repeat(51) })).toContain('50');
    expect(getEventTextLimitError({ state: 'a'.repeat(21) })).toContain('20');
  });
});
