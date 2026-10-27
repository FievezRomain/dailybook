import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { WalkPoint } from '../types';
import { getWalkMapCoordinates, getWalkRouteRegion } from '../walkMapUtils';

export const WALK_ROUTE_MAP_HEIGHT = 220;

export type WalkRouteMapHandle = {
  takeSnapshot: () => Promise<string | undefined>;
};

export const WalkRouteMap = forwardRef<WalkRouteMapHandle, { points: WalkPoint[]; onSnapshotReady?: () => void }>(function WalkRouteMap({ points, onSnapshotReady }, ref) {
  const { colors, resolvedTheme } = useAppTheme();
  const mapRef = useRef<MapView>(null);
  const coordinates = useMemo(() => getWalkMapCoordinates(points), [points]);
  const region = useMemo(() => getWalkRouteRegion(coordinates), [coordinates]);
  const first = coordinates[0];
  const latest = coordinates.at(-1);

  useImperativeHandle(ref, () => ({
    takeSnapshot: () => mapRef.current?.takeSnapshot({
      format: 'png',
      quality: 1,
      result: 'file',
      ...(Platform.OS === 'ios' && region ? { region } : {}),
    }) ?? Promise.resolve(undefined),
  }), [region]);

  return <View
    accessibilityLabel="Carte interactive du tracé GPS de la balade"
    style={{ height: WALK_ROUTE_MAP_HEIGHT, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant }}
  >
    {region && first && latest ? <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={region}
      userInterfaceStyle={resolvedTheme}
      showsCompass
      showsScale
      scrollEnabled
      zoomEnabled
      rotateEnabled
      pitchEnabled
      toolbarEnabled={false}
      loadingEnabled
      onMapReady={Platform.OS === 'ios' ? onSnapshotReady : undefined}
      onMapLoaded={Platform.OS === 'android' ? onSnapshotReady : undefined}
      accessibilityLabel="Carte interactive du tracé GPS de la balade"
      testID="walk-route-map"
    >
      {coordinates.length > 1 ? <Marker coordinate={first} title="Départ de la balade" pinColor={colors.success} /> : null}
      <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={5} lineCap="round" lineJoin="round" />
      <Marker coordinate={latest} title="Arrivée de la balade" pinColor={colors.primary} />
    </MapView> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, textAlign: 'center' }}>Le tracé apparaîtra dès les premiers mètres.</Text>
    </View>}
  </View>;
});
