import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ObjectifService from '../../services/api/ObjectifService';
import { CreateObjectifPayload, UpdateObjectifPayload } from '../../features/objectifs/types';

export const OBJECTIFS_KEY = ['objectifs'] as const;

export function useObjectifsQuery() {
  return useQuery({
    queryKey: OBJECTIFS_KEY,
    queryFn: ObjectifService.getObjectifs,
  });
}

export function useObjectifMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: OBJECTIFS_KEY });

  const create = useMutation({
    mutationFn: (body: CreateObjectifPayload) => ObjectifService.createObjectif(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateObjectifPayload }) =>
      ObjectifService.updateObjectif(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => ObjectifService.deleteObjectif(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
