import { useMemo, useRef, useState, type ElementRef } from 'react';
import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Button, Card, Switch } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { WalkPoint, WalkSession } from '../types';
import { protectWalkRouteForShare, WALK_SHARE_PRIVACY_RADIUS_METERS } from '../walkSharePrivacy';
import { WALK_ROUTE_MAP_HEIGHT, WalkRouteMap, type WalkRouteMapHandle } from './WalkRouteMap';

const SHARE_MAP_LOAD_TIMEOUT_MS = 10_000;

function duration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours} h ${String(minutes).padStart(2, '0')}` : `${minutes} min`;
}

function geometry(points: WalkPoint[]) {
  if (points.length < 2) return '';
  const minLat = Math.min(...points.map((point) => point.latitude));
  const maxLat = Math.max(...points.map((point) => point.latitude));
  const minLon = Math.min(...points.map((point) => point.longitude));
  const maxLon = Math.max(...points.map((point) => point.longitude));
  const latSpan = Math.max(maxLat - minLat, 0.00001);
  const lonSpan = Math.max(maxLon - minLon, 0.00001);
  return points.map((point) => `${8 + ((point.longitude - minLon) / lonSpan) * 84},${92 - ((point.latitude - minLat) / latSpan) * 84}`).join(' ');
}

export function WalkRouteVisualization({ points }: { points: WalkPoint[] }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('walkGps');
  const line = useMemo(() => geometry(points), [points]);
  const pairs = line.split(' ');
  return <View accessibilityRole="image" accessibilityLabel={t('map.routeAccessibility', { count: points.length })} style={{ height: WALK_ROUTE_MAP_HEIGHT, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.surfaceVariant }}>
    {line ? <Svg width="100%" height="100%" viewBox="0 0 100 100"><Polyline points={line} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={Number(pairs[0]?.split(',')[0])} cy={Number(pairs[0]?.split(',')[1])} r={2.5} fill={colors.primary} /><Circle cx={Number(pairs.at(-1)?.split(',')[0])} cy={Number(pairs.at(-1)?.split(',')[1])} r={3} fill={colors.primary} stroke={colors.surface} strokeWidth={1} /></Svg> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('map.empty')}</Text></View>}
  </View>;
}

export function WalkRouteCard({ name, session }: { name: string; session: WalkSession }) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation('walkGps');
  const cardRef = useRef<ElementRef<typeof View>>(null);
  const mapRef = useRef<WalkRouteMapHandle>(null);
  const mapLoadedResolver = useRef<(() => void) | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareMapUri, setShareMapUri] = useState<string>();
  const [shareMapFallback, setShareMapFallback] = useState(false);
  const [hideShareEndpoints, setHideShareEndpoints] = useState(true);
  const sharedPoints = useMemo(
    () => hideShareEndpoints ? protectWalkRouteForShare(session.points) : session.points,
    [hideShareEndpoints, session.points],
  );
  const distance = `${(session.distance_meters / 1000).toLocaleString(i18n.language, { maximumFractionDigits: 2 })} km`;
  const onMapLoaded = () => {
    mapLoadedResolver.current?.();
    mapLoadedResolver.current = null;
  };
  const share = async () => {
    if (!cardRef.current) return;
    setShareMapUri(undefined);
    setShareMapFallback(false);
    const mapLoaded = sharedPoints.length ? new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        mapLoadedResolver.current = null;
        resolve();
      }, SHARE_MAP_LOAD_TIMEOUT_MS);
      mapLoadedResolver.current = () => { clearTimeout(timeout); resolve(); };
    }) : undefined;
    setSharing(true);
    try {
      if (mapLoaded) {
        await mapLoaded;
        try {
          const mapUri = await mapRef.current?.takeSnapshot();
          if (mapUri) setShareMapUri(mapUri);
          else setShareMapFallback(true);
        } catch {
          setShareMapFallback(true);
        }
      } else {
        setShareMapFallback(true);
      }
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('share.dialogTitle') });
    } finally {
      mapLoadedResolver.current = null;
      setShareMapUri(undefined);
      setShareMapFallback(false);
      setSharing(false);
    }
  };
  return <View style={{ gap: spacing.sm }}>
    <View ref={cardRef} collapsable={false}><Card style={{ gap: spacing.md }} accessibilityLabel={t('share.routeAccessibility', { name, distance, duration: duration(session.duration_seconds) })}><View style={{ gap: spacing.xs }}><Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{t('share.cardTitle')}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{name}</Text>{sharing && hideShareEndpoints && <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{t('share.endpointsHidden')}</Text>}</View>{shareMapUri ? <Image source={{ uri: shareMapUri }} accessibilityRole="image" accessibilityLabel={t('share.mapAccessibility', { name })} resizeMode="cover" style={{ height: WALK_ROUTE_MAP_HEIGHT, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border }} /> : shareMapFallback ? <WalkRouteVisualization points={sharedPoints} /> : <WalkRouteMap key={sharing ? 'share-map' : 'detail-map'} ref={mapRef} points={sharing ? sharedPoints : session.points} onSnapshotReady={sharing ? onMapLoaded : undefined} />}<View style={{ flexDirection: 'row', gap: spacing.sm }}><Metric label={t('common.distance')} value={distance} /><Metric label={t('common.duration')} value={duration(session.duration_seconds)} /><Metric label={t('common.average')} value={`${(session.average_speed_mps * 3.6).toLocaleString(i18n.language, { maximumFractionDigits: 1 })} km/h`} /></View></Card></View>
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{t('share.hideEndpoints')}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{t('share.hideEndpointsDescription', { radius: WALK_SHARE_PRIVACY_RADIUS_METERS })}</Text></View><Switch value={hideShareEndpoints} onValueChange={setHideShareEndpoints} accessibilityLabel={t('share.hideEndpointsAccessibility')} /></Card>
    <Button label={t('share.button')} icon="share" variant="secondary" fullWidth loading={sharing} onPress={() => void share()} />
  </View>;
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return <View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{label}</Text><Text numberOfLines={1} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{value}</Text></View>;
}
