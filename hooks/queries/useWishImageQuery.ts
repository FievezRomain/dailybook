import { useQuery } from '@tanstack/react-query';

import { FileService } from '@services/api/FileService';

export function useWishImageQuery(wishId: number, filename?: string) {
  return useQuery({
    queryKey: ['wish-image', wishId, filename],
    queryFn: () => FileService.getDownloadUrl(filename ?? '', 'wish', wishId),
    enabled: Boolean(filename),
    staleTime: 4 * 60 * 1000,
  });
}