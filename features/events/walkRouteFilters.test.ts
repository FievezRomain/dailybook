import {
  DEFAULT_WALK_ROUTE_FILTERS,
  buildWalkRouteFilterPayload,
  validateWalkRouteFilters,
  walkRouteSortHasOrder,
} from './walkRouteFilters';

describe('walk route filters', () => {
  it('sends only the selected distance range', () => {
    expect(buildWalkRouteFilterPayload(DEFAULT_WALK_ROUTE_FILTERS)).toMatchObject({
      filter_mode: 'distance',
      min_distance_meters: 3_000,
      max_distance_meters: 5_000,
    });
  });

  it('sends only the selected duration range', () => {
    const payload = buildWalkRouteFilterPayload({
      ...DEFAULT_WALK_ROUTE_FILTERS,
      mode: 'duration',
      minDurationSeconds: 1_800,
      maxDurationSeconds: 3_600,
    });
    expect(payload.min_distance_meters).toBeUndefined();
    expect(payload.min_duration_seconds).toBe(1_800);
  });

  it('validates inverted ranges and only orders meaningful sorts', () => {
    expect(validateWalkRouteFilters({
      ...DEFAULT_WALK_ROUTE_FILTERS,
      minDistanceMeters: 6_000,
      maxDistanceMeters: 4_000,
    })).toBe('distance');
    expect(walkRouteSortHasOrder('recommended')).toBe(false);
    expect(walkRouteSortHasOrder('less_roads')).toBe(true);
  });
});
