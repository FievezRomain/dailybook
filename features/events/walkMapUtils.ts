export type WalkMapCoordinate = {
  latitude: number;
  longitude: number;
};

export type WalkMapRegion = WalkMapCoordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

const FOLLOW_REGION_DELTA = 0.005;
const ROUTE_REGION_PADDING = 1.4;

export function getWalkMapCoordinates(points: readonly WalkMapCoordinate[]): WalkMapCoordinate[] {
  return points.map(({ latitude, longitude }) => ({ latitude, longitude }));
}

export function getWalkFollowRegion(point?: WalkMapCoordinate): WalkMapRegion | undefined {
  if (!point) return undefined;
  return {
    ...point,
    latitudeDelta: FOLLOW_REGION_DELTA,
    longitudeDelta: FOLLOW_REGION_DELTA,
  };
}

export function getWalkRouteRegion(points: readonly WalkMapCoordinate[]): WalkMapRegion | undefined {
  if (!points.length) return undefined;
  const latitudes = points.map(({ latitude }) => latitude);
  const longitudes = points.map(({ longitude }) => longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * ROUTE_REGION_PADDING, FOLLOW_REGION_DELTA),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * ROUTE_REGION_PADDING, FOLLOW_REGION_DELTA),
  };
}
