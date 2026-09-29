import { z } from 'zod';

export const groupDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Le nom du groupe est requis').max(120, 'Le nom du groupe est trop long'),
  informations: z.string().trim().max(500, 'Les informations sont limitées à 500 caractères'),
});

export const groupMemberEmailSchema = z.string().trim().email('Saisissez un e-mail valide').max(254, 'L’e-mail est trop long');

export type GroupDetailsValues = z.infer<typeof groupDetailsSchema>;