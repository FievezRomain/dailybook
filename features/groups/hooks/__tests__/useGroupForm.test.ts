/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGroupForm } from '../useGroupForm';
import { createQueryWrapper } from '../../../../tests/utils/queryWrapper';

jest.mock('../../../../hooks/queries/useGroupsQuery', () => ({
  useGroupMutations: () => ({
    create: { isPending: false, mutateAsync: jest.fn().mockResolvedValue({ id: 1, nom: 'Groupe test' }) },
    update: { isPending: false, mutateAsync: jest.fn().mockResolvedValue({ id: 1 }) },
    inviteMembers: { isPending: false },
    respondInvitation: { isPending: false, mutateAsync: jest.fn().mockResolvedValue(undefined) },
    proposeAnimal: { isPending: false },
    respondAnimalShare: { isPending: false },
    removeMember: { isPending: false },
  }),
}));

jest.mock('../../../../hooks/queries/useAnimalsQuery', () => ({
  useAnimalsQuery: () => ({ data: [] }),
}));

describe('useGroupForm', () => {
  const mockSetValue = jest.fn();
  const mockOnModify = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with empty members array and loading=false', () => {
    const { result } = renderHook(
      () => useGroupForm(mockSetValue, mockOnModify, mockCloseModal),
      { wrapper: createQueryWrapper() },
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.members).toEqual(['']);
    expect(result.current.animaux).toEqual([]);
  });

  it('addMember adds an empty string to members', () => {
    const { result } = renderHook(
      () => useGroupForm(mockSetValue, mockOnModify, mockCloseModal),
      { wrapper: createQueryWrapper() },
    );

    act(() => { result.current.addMember(); });
    expect(result.current.members).toHaveLength(2);
  });

  it('removeMember removes the member at given index', () => {
    const { result } = renderHook(
      () => useGroupForm(mockSetValue, mockOnModify, mockCloseModal),
      { wrapper: createQueryWrapper() },
    );

    act(() => { result.current.addMember(); });
    act(() => { result.current.updateMembers(0, 'alice@test.com'); });
    act(() => { result.current.removeMember(0); });

    expect(result.current.members).toHaveLength(1);
    expect(result.current.members[0]).toBe('');
  });

  it('updateMembers updates the member at given index', () => {
    const { result } = renderHook(
      () => useGroupForm(mockSetValue, mockOnModify, mockCloseModal),
      { wrapper: createQueryWrapper() },
    );

    act(() => { result.current.updateMembers(0, 'bob@test.com'); });
    expect(result.current.members[0]).toBe('bob@test.com');
  });

  it('submitGroup (create) calls create.mutateAsync', async () => {
    const { result } = renderHook(
      () => useGroupForm(mockSetValue, mockOnModify, mockCloseModal),
      { wrapper: createQueryWrapper() },
    );

    await act(async () => {
      await result.current.submitGroup({ nom: 'Écurie du Soleil', members: [] }, 'create');
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
