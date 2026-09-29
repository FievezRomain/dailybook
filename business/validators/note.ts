import { z } from 'zod';

export const noteFormSchema = z.object({
  id: z.number().optional(),
  titre: z.string().trim().min(1, 'Ajoutez un titre.').max(120, 'Le titre ne peut pas dépasser 120 caractères.'),
  note: z.string().trim().min(1, 'Ajoutez le contenu de la note.').max(500, 'La note ne peut pas dépasser 500 caractères.'),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;