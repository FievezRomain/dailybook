import type { WalkPoint } from '../../../features/events/types';
import { protectWalkRouteForShare } from '../../../features/events/walkSharePrivacy';

function point(latitude: number): WalkPoint {
  return { latitude, longitude: 2, recorded_at: '2026-11-01T10:00:00Z', accuracy_m: 5 };
}

describe('protectWalkRouteForShare', () => {
  it('removes the configured distance from both ends', () => {
    const points = Array.from({ length: 11 }, (_, index) => point(index * 0.001));

    expect(protectWalkRouteForShare(points, 150)).toEqual(points.slice(2, 9));
  });

  it('hides a route that is too short to protect both endpoints', () => {
    const points = [point(0), point(0.0005), point(0.001)];

    expect(protectWalkRouteForShare(points, 150)).toEqual([]);
  });

  it('keeps the complete route when protection is disabled', () => {
    const points = [point(0), point(0.001)];

    expect(protectWalkRouteForShare(points, 0)).toBe(points);
  });
});
