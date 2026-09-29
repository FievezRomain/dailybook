import { z } from 'zod';

const optionalUrl = z.string().trim().max(500, 'Le lien est trop long').refine(
  (value) => value === '' || z.string().url().safeParse(value).success,
  'Saisissez un lien valide',
);

const optionalPrice = z.string().trim().max(30, 'Le prix est trop long').refine(
  (value) => value === '' || /^\d+(?:[.,]\d{1,2})?$/.test(value.replaceAll(' ', '')),
  'Saisissez un montant, par exemple 89,00',
);

export const wishFormSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis').max(120, 'Le nom est trop long'),
  url: optionalUrl,
  prix: optionalPrice,
  destinataire: z.string().trim().max(120, 'Le destinataire est trop long'),
});

export type WishFormValues = z.infer<typeof wishFormSchema>;