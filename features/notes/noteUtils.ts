import type { Note } from '../../models/Note';

export function filterNotes(notes: readonly Note[], query: string): Note[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-FR');
  if (!normalizedQuery) return [...notes];
  return notes.filter((note) => `${note.titre} ${note.note}`.toLocaleLowerCase('fr-FR').includes(normalizedQuery));
}

export function getNoteExcerpt(note: Note, maxLength = 120): string {
  const content = markdownToPlainText(note.note);
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trimEnd()}…`;
}

export function getNoteMetadata(note: Note): string | undefined {
  const value = note.updated_at ?? note.created_at;
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const label = note.updated_at ? 'Modifiée' : 'Créée';
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${label} le ${formatted}`;
}

export function markdownToPlainText(value: string): string {
  return value
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:|tel:)[^)]+\)/gi, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
