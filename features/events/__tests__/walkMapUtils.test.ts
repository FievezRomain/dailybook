import { getWalkFollowRegion, getWalkMapCoordinates, getWalkRouteRegion } from '../walkMapUtils';
import { isIgnPlanAvailable } from '../walkMapTiles';
import type { WalkPoint } from '../types';

const point = (latitude: number, longitude: number): WalkPoint => ({
  latitude,
  longitude,
  recorded_at: '2026-11-13T10:00:00.000Z',
  accuracy_m: 5,
});

describe('walk map utilities', () => {
  it('keeps the GPS point order for the travelled polyline', () => {
    expect(getWalkMapCoordinates([point(48.85, 2.34), point(48.86, 2.35)])).toEqual([
      { latitude: 48.85, longitude: 2.34 },
      { latitude: 48.86, longitude: 2.35 },
    ]);
  });

  it('builds a close follow region around the latest point', () => {
    expect(getWalkFollowRegion({ latitude: 48.86, longitude: 2.35 })).toEqual({
      latitude: 48.86,
      longitude: 2.35,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  });

  it('does not build a region before the first GPS point', () => {
    expect(getWalkFollowRegion()).toBeUndefined();
  });

  it('frames the complete route with padding for the detail map', () => {
    const region = getWalkRouteRegion([
      { latitude: 48.85, longitude: 2.34 },
      { latitude: 48.86, longitude: 2.36 },
    ]);
    expect(region?.latitude).toBeCloseTo(48.855);
    expect(region?.longitude).toBeCloseTo(2.35);
    expect(region?.latitudeDelta).toBeCloseTo(0.014);
    expect(region?.longitudeDelta).toBeCloseTo(0.028);
  });

  it('keeps a useful zoom level for a route containing one point', () => {
    expect(getWalkRouteRegion([{ latitude: 48.85, longitude: 2.34 }])).toEqual({
      latitude: 48.85,
      longitude: 2.34,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  });

  it('uses the IGN outdoor base map inside metropolitan France', () => {
    expect(isIgnPlanAvailable({ latitude: 48.8566, longitude: 2.3522 })).toBe(true);
  });

  it('falls back to the native map outside the IGN coverage used by the app', () => {
    expect(isIgnPlanAvailable({ latitude: 45.5019, longitude: -73.5674 })).toBe(false);
  });
});
