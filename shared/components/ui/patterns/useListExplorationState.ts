import { useCallback, useState } from 'react';
import { useListExplorationStore } from '../../../../stores/useListExplorationStore';

export function useListExplorationState<TFilters>(stateKey: string, initialFilters: TFilters) {
  const stored = useListExplorationStore.getState().entries[stateKey];
  const [filters, setLocalFilters] = useState<TFilters>(() => (stored?.filters as TFilters | undefined) ?? initialFilters);
  const [selectedId, setLocalSelectedId] = useState<string | null>(() => stored?.selectedId ?? null);
  const initialScrollOffset = stored?.scrollOffset ?? 0;

  const setFilters = useCallback((next: TFilters | ((current: TFilters) => TFilters)) => {
    setLocalFilters((current) => { const value = typeof next === 'function' ? (next as (current: TFilters) => TFilters)(current) : next; useListExplorationStore.getState().updateEntry(stateKey, { filters: value }); return value; });
  }, [stateKey]);
  const setSelectedId = useCallback((value: string | null) => { setLocalSelectedId(value); useListExplorationStore.getState().updateEntry(stateKey, { selectedId: value }); }, [stateKey]);
  const saveScrollOffset = useCallback((scrollOffset: number) => useListExplorationStore.getState().updateEntry(stateKey, { scrollOffset }), [stateKey]);
  const reset = useCallback(() => { useListExplorationStore.getState().clearEntry(stateKey); setLocalFilters(initialFilters); setLocalSelectedId(null); }, [initialFilters, stateKey]);

  return { filters, setFilters, selectedId, setSelectedId, initialScrollOffset, saveScrollOffset, reset } as const;
}
