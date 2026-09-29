/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAnimalsQuery, useAnimalMutations, ANIMALS_KEY } from '../useAnimalsQuery';
import * as AnimalsService from '../../../services/api/AnimalsService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockAnimal } from '../../../tests/factories/animal.factory';

jest.mock('../../../services/api/AnimalsService');

const mockedGetAnimals = AnimalsService.getAnimals as jest.MockedFunction<typeof AnimalsService.getAnimals>;
const mockedCreateAnimal = AnimalsService.createAnimal as jest.MockedFunction<typeof AnimalsService.createAnimal>;
const mockedUpdateAnimal = AnimalsService.updateAnimal as jest.MockedFunction<typeof AnimalsService.updateAnimal>;
const mockedDeleteAnimal = AnimalsService.deleteAnimal as jest.MockedFunction<typeof AnimalsService.deleteAnimal>;

describe('useAnimalsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(ANIMALS_KEY).toEqual(['animals']);
  });

  it('returns undefined data initially', () => {
    mockedGetAnimals.mockResolvedValue([]);
    const { result } = renderHook(() => useAnimalsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched animals on success', async () => {
    const animals = [createMockAnimal({ id: 1 }), createMockAnimal({ id: 2 })];
    mockedGetAnimals.mockResolvedValue(animals);

    const { result } = renderHook(() => useAnimalsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].nom).toBe('Cheval_1');
  });

  it('sets isError when the service throws', async () => {
    mockedGetAnimals.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAnimalsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useAnimalMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls AnimalsService.createAnimal', async () => {
    const animal = createMockAnimal({ id: 10 });
    mockedCreateAnimal.mockResolvedValue(animal);
    mockedGetAnimals.mockResolvedValue([]);

    const { result } = renderHook(() => useAnimalMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Naya', espece: 'Cheval' } as any);
    });

    expect(mockedCreateAnimal).toHaveBeenCalledWith({ nom: 'Naya', espece: 'Cheval' });
  });

  it('create mutation optimistically adds item with syncing:true', async () => {
    const wrapper = createQueryWrapper();
    mockedGetAnimals.mockResolvedValue([createMockAnimal({ id: 1 })]);

    let resolveCreate!: (v: any) => void;
    mockedCreateAnimal.mockImplementation(
      () => new Promise((res) => { resolveCreate = res; }),
    );

    const { result: queryResult } = renderHook(() => useAnimalsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useAnimalMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => {
      mutResult.current.create.mutate({ nom: 'Optimiste', espece: 'Cheval' } as any);
    });

    await waitFor(() =>
      expect(queryResult.current.data?.some((a) => a.syncing)).toBe(true),
    );

    resolveCreate(createMockAnimal({ id: 99 }));
    await waitFor(() => !mutResult.current.create.isPending);
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    const existing = [createMockAnimal({ id: 1 })];
    mockedGetAnimals.mockResolvedValue(existing);
    mockedCreateAnimal.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useAnimalsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useAnimalMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try { await mutResult.current.create.mutateAsync({ nom: 'Fail', espece: 'Cheval' } as any); }
      catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useAnimalMutations — update', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('update mutation calls AnimalsService.updateAnimal', async () => {
    const updated = createMockAnimal({ id: 1, nom: 'Naya modifiée' });
    mockedUpdateAnimal.mockResolvedValue(updated);
    mockedGetAnimals.mockResolvedValue([]);

    const { result } = renderHook(() => useAnimalMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.update.mutateAsync({ id: '1', body: { nom: 'Naya modifiée' } as any });
    });

    expect(mockedUpdateAnimal).toHaveBeenCalledWith('1', { nom: 'Naya modifiée' });
  });
});

describe('useAnimalMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls AnimalsService.deleteAnimal', async () => {
    mockedDeleteAnimal.mockResolvedValue(undefined as any);
    mockedGetAnimals.mockResolvedValue([]);

    const { result } = renderHook(() => useAnimalMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteAnimal).toHaveBeenCalledWith('1');
  });
});
