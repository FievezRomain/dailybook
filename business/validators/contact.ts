import { z } from 'zod';

const optionalEmail = z.string().trim().max(254, 'L’e-mail est trop long').refine(
  (value) => value === '' || z.string().email().safeParse(value).success,
  'Saisissez un e-mail valide',
);

export const contactFormSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis').max(120, 'Le nom est trop long'),
  profession: z.string().trim().max(120, 'Le rôle est trop long'),
  telephone: z.string().trim().max(30, 'Le téléphone est trop long'),
  email: optionalEmail,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;