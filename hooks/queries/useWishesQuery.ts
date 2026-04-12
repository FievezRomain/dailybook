import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as WishService from '../../services/api/WishService';
import { CreateWishPayload, UpdateWishPayload } from '../../features/wishes/types';

export const WISHES_KEY = ['wishes'] as const;

export function useWishesQuery() {
  return useQuery({
    queryKey: WISHES_KEY,
    queryFn: WishService.getWishes,
  });
}

export function useWishMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: WISHES_KEY });

  const create = useMutation({
    mutationFn: (body: FormData | CreateWishPayload) => WishService.createWish(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData | UpdateWishPayload }) =>
      WishService.updateWish(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => WishService.deleteWish(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
