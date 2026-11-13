import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, type MapPressEvent } from 'react-native-maps';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { WalkMapCoordinate } from '../walkMapUtils';
import type { WalkRouteHighlight } from '../types';
import { getWalkMapCoordinates, getWalkRouteRegion } from '../walkMapUtils';
import { IGN_PLAN_TILE_URL, isIgnPlanAvailable } from '../walkMapTiles';

export const WALK_ROUTE_MAP_HEIGHT = 220;

export type WalkRouteMapHandle = {
  takeSnapshot: () => Promise<string | undefined>;
};

type WalkRouteMapProps = {
  points: WalkMapCoordinate[];
  highlights?: WalkRouteHighlight[];
  onSnapshotReady?: () => void;
  onPress?: (point: WalkMapCoordinate) => void;
  editPoint?: WalkMapCoordinate;
  planned?: boolean;
};

export const WalkRouteMap = forwardRef<WalkRouteMapHandle, WalkRouteMapProps>(function WalkRouteMap({ points, highlights = [], onSnapshotReady, onPress, editPoint, planned = false }, ref) {
  const { colors, resolvedTheme } = useAppTheme();
  const mapRef = useRef<MapView>(null);
  const coordinates = useMemo(() => getWalkMapCoordinates(points), [points]);
  const region = useMemo(() => getWalkRouteRegion(coordinates), [coordinates]);
  const first = coordinates[0];
  const latest = coordinates.at(-1);
  const useIgnPlan = isIgnPlanAvailable(first);

  useImperativeHandle(ref, () => ({
    takeSnapshot: () => mapRef.current?.takeSnapshot({
      format: 'png',
      quality: 1,
      result: 'file',
      ...(Platform.OS === 'ios' && region ? { region } : {}),
    }) ?? Promise.resolve(undefined),
  }), [region]);

  return <View style={{ gap: spacing.xs }}>
    <View
      accessibilityLabel="Carte interactive du tracé GPS de la balade"
      style={{ height: WALK_ROUTE_MAP_HEIGHT, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant }}
    >
      {region && first && latest ? <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={region}
      mapType={Platform.OS === 'android' && useIgnPlan ? 'none' : 'standard'}
      userInterfaceStyle={resolvedTheme}
      showsCompass
      showsScale
      scrollEnabled
      zoomEnabled
      rotateEnabled
      pitchEnabled
      toolbarEnabled={false}
      loadingEnabled
      onPress={onPress ? (event: MapPressEvent) => onPress(event.nativeEvent.coordinate) : undefined}
      onMapReady={Platform.OS === 'ios' ? onSnapshotReady : undefined}
      onMapLoaded={Platform.OS === 'android' ? onSnapshotReady : undefined}
      accessibilityLabel="Carte interactive du tracé GPS de la balade"
      testID="walk-route-map"
    >
      {useIgnPlan ? <UrlTile urlTemplate={IGN_PLAN_TILE_URL} maximumZ={18} tileSize={256} /> : null}
      {coordinates.length > 1 ? <Marker coordinate={first} title="Départ de la balade" pinColor={colors.success} /> : null}
      <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={planned ? 3 : 4} lineDashPattern={planned ? [10, 7] : undefined} lineCap="round" lineJoin="round" tappable={Boolean(onPress)} />
      {highlights.map((highlight) => <Marker
        key={`${highlight.name}-${highlight.latitude}-${highlight.longitude}`}
        coordinate={{ latitude: highlight.latitude, longitude: highlight.longitude }}
        title={highlight.name}
        description={highlight.category}
        pinColor={colors.warning}
      />)}
      {editPoint ? <Marker coordinate={editPoint} title="Point de modification" pinColor={colors.warning} /> : null}
      <Marker coordinate={latest} title="Arrivée de la balade" pinColor={colors.primary} />
    </MapView> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, textAlign: 'center' }}>Le tracé apparaîtra dès les premiers mètres.</Text>
    </View>}
    </View>
    {useIgnPlan ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Fond cartographique © IGN — Géoplateforme</Text> : null}
  </View>;
});
