import { noteFormSchema } from '../../../business/validators/note';
import type { Note } from '../../../models/Note';
import { filterNotes, getNoteExcerpt, getNoteMetadata, markdownToPlainText } from '../noteUtils';

const notes: Note[] = [
  { id: 1, titre: 'Questions vétérinaire', note: 'Vérifier le traitement de Milo' },
  { id: 2, titre: 'Week-end', note: 'Prendre la longe et le carnet' },
];

describe('noteUtils', () => {
  it('filters title and content without mutating the source order', () => {
    expect(filterNotes(notes, '  MILO ')).toEqual([notes[0]]);
    expect(filterNotes(notes, 'week-end')).toEqual([notes[1]]);
    expect(filterNotes(notes, '')).toEqual(notes);
    expect(notes.map((note) => note.id)).toEqual([1, 2]);
  });

  it('truncates long content with an ellipsis', () => {
    expect(getNoteExcerpt({ id: 3, titre: 'Titre', note: 'Une observation importante' }, 15)).toBe('Une observation…');
  });

  it('keeps Markdown syntax out of list excerpts', () => {
    expect(markdownToPlainText('## Courses\n\n- **Lait**\n- _Pain_')).toBe('Courses Lait Pain');
  });

  it('hides unavailable legacy metadata and formats reliable timestamps', () => {
    expect(getNoteMetadata({ id: 3, titre: 'Historique', note: 'Sans date' })).toBeUndefined();
    expect(getNoteMetadata({ id: 4, titre: 'Datée', note: 'Contenu', created_at: '2026-08-11T10:00:00Z' })).toBe('Créée le 11 août 2026');
    expect(getNoteMetadata({ id: 5, titre: 'Modifiée', note: 'Contenu', created_at: '2026-08-10T10:00:00Z', updated_at: '2026-08-11T10:00:00Z' })).toBe('Modifiée le 11 août 2026');
  });

  it('requires a title and content and enforces their limits', () => {
    expect(noteFormSchema.safeParse({ titre: '', note: '' }).success).toBe(false);
    expect(noteFormSchema.safeParse({ titre: 'Observation', note: 'Tout va bien' }).success).toBe(true);
    expect(noteFormSchema.safeParse({ titre: 'T'.repeat(121), note: 'N'.repeat(501) }).success).toBe(false);
  });
});
