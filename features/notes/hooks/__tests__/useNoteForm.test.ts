/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNoteForm } from '../useNoteForm';
import * as NoteService from '../../../../services/api/NoteService';
import { createQueryWrapper } from '../../../../tests/utils/queryWrapper';

jest.mock('../../../../services/api/NoteService');

const mockedCreateNote = NoteService.createNote as jest.MockedFunction<typeof NoteService.createNote>;
const mockedUpdateNote = NoteService.updateNote as jest.MockedFunction<typeof NoteService.updateNote>;

describe('useNoteForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns form, loading=false and callbacks on init', () => {
    const { result } = renderHook(() => useNoteForm('create'), { wrapper: createQueryWrapper() });
    expect(result.current.form).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.submit).toBe('function');
    expect(typeof result.current.initValues).toBe('function');
    expect(typeof result.current.resetValues).toBe('function');
  });

  it('submit (create) calls createNote with titre and note fields', async () => {
    mockedCreateNote.mockResolvedValue(undefined as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useNoteForm('create', {}, onSuccess), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ titre: 'Mon observation', note: 'Naya a bien travaillé' }, onClose);
    });

    expect(mockedCreateNote).toHaveBeenCalledWith({
      titre: 'Mon observation',
      note: 'Naya a bien travaillé',
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submit (modify) calls updateNote', async () => {
    const updated = { id: 3, titre: 'Modifiée' };
    mockedUpdateNote.mockResolvedValue(updated as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useNoteForm('modify', { id: 3, is_pinned: true }, onSuccess), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ id: 3, titre: 'Modifiée', note: 'Détail' }, onClose);
    });

    expect(mockedUpdateNote).toHaveBeenCalledWith('3', { id: 3, titre: 'Modifiée', note: 'Détail', is_pinned: true });
    expect(onSuccess).toHaveBeenCalledWith(updated);
  });

  it('sets loading=true during submit then loading=false after', async () => {
    let resolveCreate!: (v: any) => void;
    mockedCreateNote.mockImplementation(() => new Promise((res) => { resolveCreate = res; }));

    const { result } = renderHook(() => useNoteForm('create'), { wrapper: createQueryWrapper() });
    const onClose = jest.fn();

    act(() => {
      result.current.submit({ titre: 'Test', note: 'Corps' }, onClose);
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(mockedCreateNote).toHaveBeenCalled());

    await act(async () => {
      resolveCreate(undefined);
    });

    expect(result.current.loading).toBe(false);
  });

  it('initValues populates titre and note', () => {
    const note = { id: 1, titre: 'Titre test', note: 'Corps de la note' };
    const { result } = renderHook(() => useNoteForm('modify', note), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.initValues();
    });

    expect(result.current.form.getValues('titre')).toBe('Titre test');
    expect(result.current.form.getValues('note')).toBe('Corps de la note');
  });

  it('submit handles error gracefully', async () => {
    mockedCreateNote.mockRejectedValue(new Error('Server error'));
    const onClose = jest.fn();

    const { result } = renderHook(() => useNoteForm('create'), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ titre: 'Test', note: 'Corps' }, onClose);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
