import type { WalkRoutePoint } from './types';

export function buildDraftRoutePoints(
  start: WalkRoutePoint,
  waypoints: WalkRoutePoint[],
  routeType: 'loop' | 'one_way',
): WalkRoutePoint[] {
  if (!waypoints.length) return [start, { ...start }];
  return routeType === 'loop' ? [start, ...waypoints, start] : [start, ...waypoints];
}

export function removeDraftWaypoint(waypoints: WalkRoutePoint[], indexToRemove: number) {
  return waypoints.filter((_, index) => index !== indexToRemove);
}
