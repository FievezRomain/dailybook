import { z } from 'zod';
import { STORAGE_TEXT_LIMITS } from './storageLimits';

const optionalEmail = z.string().trim().max(STORAGE_TEXT_LIMITS.contact, 'L’e-mail est trop long').refine(
  (value) => value === '' || z.string().email().safeParse(value).success,
  'Saisissez un e-mail valide',
);

export const contactFormSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis').max(STORAGE_TEXT_LIMITS.contact, 'Le nom est trop long'),
  profession: z.string().trim().max(STORAGE_TEXT_LIMITS.contact, 'Le rôle est trop long'),
  telephone: z.string().trim().max(STORAGE_TEXT_LIMITS.contact, 'Le téléphone est trop long'),
  email: optionalEmail,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
