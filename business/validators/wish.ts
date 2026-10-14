import { z } from 'zod';
import { STORAGE_TEXT_LIMITS } from './storageLimits';

const optionalUrl = z.string().trim().max(500, 'Le lien est trop long').refine(
  (value) => value === '' || z.string().url().safeParse(value).success,
  'Saisissez un lien valide',
);

const optionalPrice = z.string().trim().max(30, 'Le prix est trop long').refine(
  (value) => value === '' || /^\d+(?:[.,]\d{1,2})?$/.test(value.replaceAll(' ', '')),
  'Saisissez un montant, par exemple 89,00',
);

export const wishFormSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis').max(STORAGE_TEXT_LIMITS.wish, 'Le nom est trop long'),
  url: optionalUrl,
  prix: optionalPrice,
  destinataire: z.string().trim().max(STORAGE_TEXT_LIMITS.wish, 'Le destinataire est trop long'),
});

export type WishFormValues = z.infer<typeof wishFormSchema>;
