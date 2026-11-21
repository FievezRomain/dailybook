import type { WalkRoutePoint } from './types';

const IGN_GEOCODING_SEARCH_URL = 'https://data.geopf.fr/geocodage/search';

type IgnGeocodingFeature = {
  geometry?: { coordinates?: unknown };
  properties?: { label?: unknown };
};

export type GeocodedWalkRouteStart = WalkRoutePoint & { label: string };

export async function geocodeWalkRouteStartAddress(address: string): Promise<GeocodedWalkRouteStart> {
  const query = address.trim();
  const search = new URLSearchParams({ q: query, limit: '1', autocomplete: '0' });
  const response = await fetch(`${IGN_GEOCODING_SEARCH_URL}?${search.toString()}`);
  if (!response.ok) throw new Error('IGN_GEOCODING_UNAVAILABLE');
  const payload = await response.json() as { features?: IgnGeocodingFeature[] };
  const feature = payload.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) throw new Error('IGN_ADDRESS_NOT_FOUND');
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('IGN_ADDRESS_NOT_FOUND');
  const label = typeof feature?.properties?.label === 'string' && feature.properties.label.trim()
    ? feature.properties.label.trim()
    : query;
  return { latitude, longitude, label };
}
