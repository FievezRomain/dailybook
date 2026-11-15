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

export type WalkRouteFilterValidationError = 'distance' | 'duration';

export function validateWalkRouteFilters(filters: WalkRouteFilterState): WalkRouteFilterValidationError | undefined {
  if (filters.mode === 'distance' && filters.minDistanceMeters > filters.maxDistanceMeters) {
    return 'distance';
  }
  if (filters.mode === 'duration' && filters.minDurationSeconds > filters.maxDurationSeconds) {
    return 'duration';
  }
  return undefined;
}

export function buildWalkRouteFilterPayload(
  filters: WalkRouteFilterState,
): Pick<GenerateWalkRouteProposalsInput,
  | 'filter_mode'
  | 'min_distance_meters'
  | 'max_distance_meters'
  | 'min_duration_seconds'
  | 'max_duration_seconds'
  | 'sort_by'
  | 'sort_order'
> {
  return {
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
