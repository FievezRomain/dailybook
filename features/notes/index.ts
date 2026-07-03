// Notes feature — public API
export { default as NoteScreen } from './screens/NoteScreen';
export { default as NoteAIScreen } from './screens/NoteAIScreen';

export { default as NoteCard } from './components/NoteCard';
export { default as ModalNote } from './components/ModalNote';

export { useNoteForm } from './hooks/useNoteForm';

export type { CreateNotePayload, UpdateNotePayload } from './types';
