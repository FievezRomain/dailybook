import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as GroupService from '../../services/api/GroupService';
import { ANIMALS_KEY } from './useAnimalsQuery';
import { EVENTS_KEY } from './useEventsQuery';

export const GROUPS_KEY = ['groups'] as const;
export const INVITATIONS_KEY = ['invitations'] as const;

export function useGroupsQuery() {
  return useQuery({
    queryKey: GROUPS_KEY,
    queryFn: GroupService.getGroups,
  });
}

export function useInvitationsQuery() {
  return useQuery({
    queryKey: INVITATIONS_KEY,
    queryFn: GroupService.getInvitations,
  });
}

export function useGroupAnimalsQuery(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'animals'],
    queryFn: () => GroupService.getGroupAnimals(groupId),
    enabled: !!groupId,
  });
}

export function useGroupMutations() {
  const queryClient = useQueryClient();
  const invalidateGroups = () => queryClient.invalidateQueries({ queryKey: GROUPS_KEY });

  /** Invalide groupes + animaux + events (les actions groupe impactent ces données) */
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    queryClient.invalidateQueries({ queryKey: ANIMALS_KEY });
    queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
  };

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) => GroupService.createGroup(body),
    onSuccess: invalidateGroups,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      GroupService.updateGroup(id, body),
    onSuccess: invalidateGroups,
  });

  const remove = useMutation({
    mutationFn: (id: string) => GroupService.deleteGroup(id),
    onSuccess: invalidateAll,
  });

  const inviteMembers = useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: Record<string, unknown> }) =>
      GroupService.inviteMembers(groupId, body),
    onSuccess: invalidateGroups,
  });

  const respondInvitation = useMutation({
    mutationFn: ({ invitationId, body }: { invitationId: string; body: Record<string, unknown> }) =>
      GroupService.respondInvitation(invitationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY });
      invalidateAll();
    },
  });

  const proposeAnimal = useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: Record<string, unknown> }) =>
      GroupService.proposeAnimal(groupId, body),
    onSuccess: invalidateGroups,
  });

  const respondAnimalShare = useMutation({
    mutationFn: ({ shareId, body }: { shareId: string; body: Record<string, unknown> }) =>
      GroupService.respondAnimalShare(shareId, body),
    onSuccess: invalidateAll,
  });

  const removeMember = useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: Record<string, unknown> }) =>
      GroupService.removeMember(groupId, body),
    onSuccess: invalidateAll,
  });

  return { create, update, remove, inviteMembers, respondInvitation, proposeAnimal, respondAnimalShare, removeMember };
}
