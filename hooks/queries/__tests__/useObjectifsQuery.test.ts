/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useObjectifsQuery, useObjectifMutations, OBJECTIFS_KEY } from '../useObjectifsQuery';
import * as ObjectifService from '../../../services/api/ObjectifService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockObjectif } from '../../../tests/factories/objectif.factory';

jest.mock('../../../services/api/ObjectifService');

const mockedGetObjectifs = ObjectifService.getObjectifs as jest.MockedFunction<typeof ObjectifService.getObjectifs>;
const mockedCreateObjectif = ObjectifService.createObjectif as jest.MockedFunction<typeof ObjectifService.createObjectif>;
const mockedDeleteObjectif = ObjectifService.deleteObjectif as jest.MockedFunction<typeof ObjectifService.deleteObjectif>;

describe('useObjectifsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(OBJECTIFS_KEY).toEqual(['objectifs']);
  });

  it('returns undefined data initially', () => {
    mockedGetObjectifs.mockResolvedValue([]);
    const { result } = renderHook(() => useObjectifsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched objectifs on success', async () => {
    const objectifs = [createMockObjectif(), createMockObjectif()];
    mockedGetObjectifs.mockResolvedValue(objectifs as any);

    const { result } = renderHook(() => useObjectifsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetObjectifs.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useObjectifsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useObjectifMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls ObjectifService.createObjectif', async () => {
    mockedCreateObjectif.mockResolvedValue(createMockObjectif() as any);
    mockedGetObjectifs.mockResolvedValue([]);

    const { result } = renderHook(() => useObjectifMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({
        title: 'Améliorer le galop',
        animaux: [1],
        datedebut: '2025-01-01',
        datefin: '2025-12-31',
        temporalityobjectif: 'Mensuel',
        etapes: ['Étape 1'],
      } as any);
    });

    expect(mockedCreateObjectif).toHaveBeenCalled();
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    mockedGetObjectifs.mockResolvedValue([createMockObjectif()] as any);
    mockedCreateObjectif.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useObjectifsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useObjectifMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try {
        await mutResult.current.create.mutateAsync({
          title: 'Fail', animaux: [], datedebut: '', datefin: '', temporalityobjectif: '', etapes: [],
        } as any);
      } catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useObjectifMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls ObjectifService.deleteObjectif', async () => {
    mockedDeleteObjectif.mockResolvedValue(undefined as any);
    mockedGetObjectifs.mockResolvedValue([]);

    const { result } = renderHook(() => useObjectifMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteObjectif).toHaveBeenCalledWith('1');
  });
});
