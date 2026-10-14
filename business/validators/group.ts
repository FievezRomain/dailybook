import { z } from 'zod';
import { STORAGE_TEXT_LIMITS } from './storageLimits';

export const groupDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Le nom du groupe est requis').max(STORAGE_TEXT_LIMITS.groupName, 'Le nom du groupe est trop long'),
  informations: z.string().trim().max(STORAGE_TEXT_LIMITS.groupInformation, 'Les informations sont trop longues'),
});

export const groupMemberEmailSchema = z.string().trim().email('Saisissez un e-mail valide').max(STORAGE_TEXT_LIMITS.accountEmail, 'L’e-mail est trop long');

export type GroupDetailsValues = z.infer<typeof groupDetailsSchema>;
