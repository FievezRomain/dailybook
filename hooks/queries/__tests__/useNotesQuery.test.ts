/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotesQuery, useNoteMutations, NOTES_KEY } from '../useNotesQuery';
import * as NoteService from '../../../services/api/NoteService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockNote } from '../../../tests/factories/note.factory';

jest.mock('../../../services/api/NoteService');

const mockedGetNotes = NoteService.getNotes as jest.MockedFunction<typeof NoteService.getNotes>;
const mockedCreateNote = NoteService.createNote as jest.MockedFunction<typeof NoteService.createNote>;
const mockedDeleteNote = NoteService.deleteNote as jest.MockedFunction<typeof NoteService.deleteNote>;

describe('useNotesQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(NOTES_KEY).toEqual(['notes']);
  });

  it('returns undefined data initially', () => {
    mockedGetNotes.mockResolvedValue([]);
    const { result } = renderHook(() => useNotesQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched notes on success', async () => {
    const notes = [createMockNote(), createMockNote()];
    mockedGetNotes.mockResolvedValue(notes as any);

    const { result } = renderHook(() => useNotesQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetNotes.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNotesQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useNoteMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls NoteService.createNote', async () => {
    mockedCreateNote.mockResolvedValue(createMockNote() as any);
    mockedGetNotes.mockResolvedValue([]);

    const { result } = renderHook(() => useNoteMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ titre: 'Test', note: 'Corps' });
    });

    expect(mockedCreateNote).toHaveBeenCalledWith({ titre: 'Test', note: 'Corps' });
  });

  it('create mutation adds optimistic item with syncing:true', async () => {
    const wrapper = createQueryWrapper();
    mockedGetNotes.mockResolvedValue([createMockNote()] as any);

    let resolveCreate!: (v: any) => void;
    mockedCreateNote.mockImplementation(() => new Promise((res) => { resolveCreate = res; }));

    const { result: queryResult } = renderHook(() => useNotesQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useNoteMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => {
      mutResult.current.create.mutate({ titre: 'Optimiste', note: 'Corps' });
    });

    await waitFor(() =>
      expect(queryResult.current.data?.some((n: any) => n.syncing)).toBe(true),
    );

    resolveCreate(createMockNote({ id: 99 }) as any);
    await waitFor(() => !mutResult.current.create.isPending);
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    mockedGetNotes.mockResolvedValue([createMockNote()] as any);
    mockedCreateNote.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useNotesQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useNoteMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try { await mutResult.current.create.mutateAsync({ titre: 'Fail', note: '' }); } catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useNoteMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls NoteService.deleteNote', async () => {
    mockedDeleteNote.mockResolvedValue(undefined as any);
    mockedGetNotes.mockResolvedValue([]);

    const { result } = renderHook(() => useNoteMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteNote).toHaveBeenCalledWith('1');
  });
});
