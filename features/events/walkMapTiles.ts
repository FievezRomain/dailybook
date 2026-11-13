import type { WalkMapCoordinate } from './walkMapUtils';

export const IGN_PLAN_TILE_URL = 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';

export function isIgnPlanAvailable(point?: WalkMapCoordinate) {
  if (!point) return false;
  return point.latitude >= 41.2
    && point.latitude <= 51.2
    && point.longitude >= -5.5
    && point.longitude <= 9.8;
}
