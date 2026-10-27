import type { WalkPoint } from './types';

export const WALK_SHARE_PRIVACY_RADIUS_METERS = 150;

const EARTH_RADIUS_METERS = 6_371_000;

function distanceMeters(from: WalkPoint, to: WalkPoint) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function protectWalkRouteForShare(
  points: WalkPoint[],
  radiusMeters = WALK_SHARE_PRIVACY_RADIUS_METERS,
) {
  if (points.length < 2 || radiusMeters <= 0) return points;

  let startIndex = 0;
  let distanceFromStart = 0;
  while (startIndex < points.length - 1 && distanceFromStart < radiusMeters) {
    distanceFromStart += distanceMeters(points[startIndex], points[startIndex + 1]);
    startIndex += 1;
  }

  let endIndex = points.length - 1;
  let distanceFromEnd = 0;
  while (endIndex > 0 && distanceFromEnd < radiusMeters) {
    distanceFromEnd += distanceMeters(points[endIndex], points[endIndex - 1]);
    endIndex -= 1;
  }

  return endIndex - startIndex >= 1 ? points.slice(startIndex, endIndex + 1) : [];
}
