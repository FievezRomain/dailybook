import { QueryClient } from '@tanstack/react-query';

import { parseApiError } from '../../utils/errorParser';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const parsed = parseApiError(error);
        return (parsed.isNetworkError || parsed.isAuthError) && failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});

/** Remove every server response tied to the authenticated account. */
export function clearAuthenticatedQueryState() {
  queryClient.clear();
}
