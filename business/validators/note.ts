import { z } from 'zod';
import { STORAGE_TEXT_LIMITS } from './storageLimits';

export const noteFormSchema = z.object({
  id: z.number().optional(),
  titre: z.string().trim().min(1, 'Ajoutez un titre.').max(STORAGE_TEXT_LIMITS.noteTitle, `Le titre ne peut pas dépasser ${STORAGE_TEXT_LIMITS.noteTitle} caractères.`),
  note: z.string().trim().min(1, 'Ajoutez le contenu de la note.').max(500, 'La note ne peut pas dépasser 500 caractères.'),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
