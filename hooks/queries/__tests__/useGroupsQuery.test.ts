/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGroupsQuery, useGroupMutations, GROUPS_KEY } from '../useGroupsQuery';
import * as GroupService from '../../../services/api/GroupService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockGroup } from '../../../tests/factories/group.factory';

jest.mock('../../../services/api/GroupService');
jest.mock('../useAnimalsQuery', () => ({ ANIMALS_KEY: ['animals'] }));
jest.mock('../useEventsQuery', () => ({ EVENTS_KEY: ['events'] }));

const mockedGetGroups = GroupService.getGroups as jest.MockedFunction<typeof GroupService.getGroups>;
const mockedCreateGroup = GroupService.createGroup as jest.MockedFunction<typeof GroupService.createGroup>;
const mockedDeleteGroup = GroupService.deleteGroup as jest.MockedFunction<typeof GroupService.deleteGroup>;

describe('useGroupsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(GROUPS_KEY).toEqual(['groups']);
  });

  it('returns undefined data initially', () => {
    mockedGetGroups.mockResolvedValue([]);
    const { result } = renderHook(() => useGroupsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched groups on success', async () => {
    const groups = [createMockGroup(), createMockGroup()];
    mockedGetGroups.mockResolvedValue(groups as any);

    const { result } = renderHook(() => useGroupsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetGroups.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGroupsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useGroupMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls GroupService.createGroup', async () => {
    const group = createMockGroup() as any;
    mockedCreateGroup.mockResolvedValue(group);
    mockedGetGroups.mockResolvedValue([]);

    const { result } = renderHook(() => useGroupMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Écurie du Soleil', members: [] } as any);
    });

    expect(mockedCreateGroup).toHaveBeenCalledWith({ nom: 'Écurie du Soleil', members: [] });
  });
});

describe('useGroupMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls GroupService.deleteGroup', async () => {
    mockedDeleteGroup.mockResolvedValue(undefined as any);
    mockedGetGroups.mockResolvedValue([]);

    const { result } = renderHook(() => useGroupMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteGroup).toHaveBeenCalledWith('1');
  });
});
