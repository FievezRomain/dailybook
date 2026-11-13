import type {
  GenerateWalkRouteProposalsInput,
  WalkRouteFilterMode,
  WalkRouteSort,
  WalkRouteSortOrder,
} from './types';

export type WalkRouteFilterState = {
  mode: WalkRouteFilterMode;
  minDistanceMeters: number;
  maxDistanceMeters: number;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  sortBy: WalkRouteSort;
  sortOrder: WalkRouteSortOrder;
};

export const DEFAULT_WALK_ROUTE_FILTERS: WalkRouteFilterState = {
  mode: 'distance',
  minDistanceMeters: 3_000,
  maxDistanceMeters: 5_000,
  minDurationSeconds: 2_700,
  maxDurationSeconds: 5_400,
  sortBy: 'recommended',
  sortOrder: 'asc',
};

export function validateWalkRouteFilters(filters: WalkRouteFilterState): string | undefined {
  if (filters.mode === 'distance' && filters.minDistanceMeters > filters.maxDistanceMeters) {
    return 'La distance minimale doit être inférieure ou égale à la distance maximale.';
  }
  if (filters.mode === 'duration' && filters.minDurationSeconds > filters.maxDurationSeconds) {
    return 'La durée minimale doit être inférieure ou égale à la durée maximale.';
  }
  return undefined;
}

export function walkRouteTargetDistance(filters: WalkRouteFilterState) {
  if (filters.mode === 'distance') {
    return Math.round((filters.minDistanceMeters + filters.maxDistanceMeters) / 2);
  }
  return Math.min(30_000, Math.max(1_000,
    Math.round(((filters.minDurationSeconds + filters.maxDurationSeconds) / 2) * 1.2)));
}

export function buildWalkRouteFilterPayload(
  filters: WalkRouteFilterState,
): Pick<GenerateWalkRouteProposalsInput,
  | 'target_distance_meters'
  | 'filter_mode'
  | 'min_distance_meters'
  | 'max_distance_meters'
  | 'min_duration_seconds'
  | 'max_duration_seconds'
  | 'sort_by'
  | 'sort_order'
> {
  return {
    target_distance_meters: walkRouteTargetDistance(filters),
    filter_mode: filters.mode,
    min_distance_meters: filters.mode === 'distance' ? filters.minDistanceMeters : undefined,
    max_distance_meters: filters.mode === 'distance' ? filters.maxDistanceMeters : undefined,
    min_duration_seconds: filters.mode === 'duration' ? filters.minDurationSeconds : undefined,
    max_duration_seconds: filters.mode === 'duration' ? filters.maxDurationSeconds : undefined,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
  };
}

export function walkRouteSortHasOrder(sortBy: WalkRouteSort) {
  return sortBy !== 'recommended';
}
