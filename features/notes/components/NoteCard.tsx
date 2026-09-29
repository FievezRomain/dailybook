import type { Note } from '../../../models/Note';
import { NoteCard as SharedNoteCard } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { getNoteExcerpt, getNoteMetadata } from '../noteUtils';

interface NoteCardProps {
  note: Note;
  material?: Material;
  onPress: () => void;
}

export function NoteCard({ note, material = 'solid', onPress }: NoteCardProps) {
  return (
    <SharedNoteCard
      title={note.titre}
      excerpt={getNoteExcerpt(note)}
      metadata={getNoteMetadata(note)}
      pinned={note.is_pinned ?? false}
      material={material}
      onPress={onPress}
      testID={`note-card-${note.id}`}
    />
  );
}