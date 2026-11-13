import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { Button, Card } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { WalkPoint, WalkRoutePoint } from '../types';
import { getWalkFollowRegion, getWalkMapCoordinates, getWalkRouteRegion } from '../walkMapUtils';
import { IGN_PLAN_TILE_URL, isIgnPlanAvailable } from '../walkMapTiles';

const MAP_HEIGHT = 320;
const CAMERA_ANIMATION_DURATION = 400;

export function WalkTrackingMap({ points, plannedPoints = [] }: { points: WalkPoint[]; plannedPoints?: WalkRoutePoint[] }) {
  const { colors, resolvedTheme } = useAppTheme();
  const mapRef = useRef<MapView>(null);
  const previousPointCount = useRef(points.length);
  const [following, setFollowing] = useState(true);
  const coordinates = useMemo(() => getWalkMapCoordinates(points), [points]);
  const plannedCoordinates = useMemo(() => getWalkMapCoordinates(plannedPoints), [plannedPoints]);
  const first = coordinates[0];
  const latest = coordinates.at(-1);
  const initialRegion = getWalkFollowRegion(latest) ?? getWalkRouteRegion(plannedCoordinates);
  const useIgnPlan = isIgnPlanAvailable(latest ?? plannedCoordinates[0]);

  useEffect(() => {
    const receivedPoint = points.length !== previousPointCount.current;
    previousPointCount.current = points.length;
    const region = getWalkFollowRegion(latest);
    if (!receivedPoint || !following || !region) return;
    mapRef.current?.animateToRegion(region, CAMERA_ANIMATION_DURATION);
  }, [following, latest, points.length]);

  const recenter = () => {
    const region = getWalkFollowRegion(latest);
    if (!region) return;
    setFollowing(true);
    mapRef.current?.animateToRegion(region, CAMERA_ANIMATION_DURATION);
  };

  if (!initialRegion) {
    return <Card style={{ minHeight: MAP_HEIGHT, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }} accessibilityLabel="Recherche de la position GPS">
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Localisation en cours…</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight, textAlign: 'center' }}>La carte apparaîtra dès la réception du premier point GPS.</Text>
    </Card>;
  }

  return <View style={{ gap: spacing.sm }}>
    <View style={{ height: MAP_HEIGHT, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        mapType={Platform.OS === 'android' && useIgnPlan ? 'none' : 'standard'}
        userInterfaceStyle={resolvedTheme}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        scrollEnabled
        zoomEnabled
        rotateEnabled
        pitchEnabled
        loadingEnabled
        toolbarEnabled={false}
        onTouchStart={() => setFollowing(false)}
        accessibilityLabel="Carte interactive de la balade avec le tracé déjà parcouru"
        testID="walk-tracking-map"
      >
        {useIgnPlan ? <UrlTile urlTemplate={IGN_PLAN_TILE_URL} maximumZ={18} tileSize={256} /> : null}
        {plannedCoordinates.length > 1 ? <Polyline coordinates={plannedCoordinates} strokeColor={colors.textSecondary} strokeWidth={4} lineDashPattern={[10, 7]} lineCap="round" lineJoin="round" /> : null}
        {coordinates.length > 1 ? <Marker coordinate={first} title="Départ de la balade" pinColor={colors.success} /> : null}
        {coordinates.length > 1 ? <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={5} lineCap="round" lineJoin="round" /> : null}
        {latest ? <Marker coordinate={latest} title="Dernière position enregistrée" pinColor={colors.primary} /> : null}
      </MapView>
    </View>
    {useIgnPlan ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Fond cartographique © IGN — Géoplateforme</Text> : null}
    <Card style={{ gap: spacing.sm }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{following ? 'Position suivie automatiquement' : 'Exploration libre de la carte'}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Déplacez ou zoomez la carte pour consulter les chemins autour de vous. Le tracé GPS continue de s’enregistrer.</Text>
      </View>
      <Button label="Recentrer sur ma position" icon="compass" variant="secondary" fullWidth onPress={recenter} disabled={!latest} />
    </Card>
  </View>;
}
