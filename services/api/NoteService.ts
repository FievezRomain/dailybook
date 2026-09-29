import { createCrudService } from './factory';
import { CreateNotePayload, UpdateNotePayload } from '../../features/notes/types';
import { Note } from '../../models/Note';

const _crud = createCrudService<Note, CreateNotePayload, UpdateNotePayload>('/notes');

export const getNotes = _crud.getAll;
export const createNote = _crud.create;
export const updateNote = _crud.update;
export const deleteNote = _crud.remove;
