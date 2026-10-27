import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Button, Card, Switch } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { WalkPoint, WalkSession } from '../types';
import { protectWalkRouteForShare, WALK_SHARE_PRIVACY_RADIUS_METERS } from '../walkSharePrivacy';

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
  const line = useMemo(() => geometry(points), [points]);
  const pairs = line.split(' ');
  return <View accessibilityRole="image" accessibilityLabel="Tracé GPS de la balade" style={{ height: 220, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.surfaceVariant }}>
    {line ? <Svg width="100%" height="100%" viewBox="0 0 100 100"><Polyline points={line} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={Number(pairs[0]?.split(',')[0])} cy={Number(pairs[0]?.split(',')[1])} r={2.5} fill={colors.primary} /><Circle cx={Number(pairs.at(-1)?.split(',')[0])} cy={Number(pairs.at(-1)?.split(',')[1])} r={3} fill={colors.primary} stroke={colors.surface} strokeWidth={1} /></Svg> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>Le tracé apparaîtra dès les premiers mètres.</Text></View>}
  </View>;
}

export function WalkRouteCard({ name, session }: { name: string; session: WalkSession }) {
  const { colors } = useAppTheme();
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const [hideShareEndpoints, setHideShareEndpoints] = useState(true);
  const sharedPoints = useMemo(
    () => hideShareEndpoints ? protectWalkRouteForShare(session.points) : session.points,
    [hideShareEndpoints, session.points],
  );
  const distance = `${(session.distance_meters / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} km`;
  const share = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Partager ma balade Vasco' });
    } finally {
      setSharing(false);
    }
  };
  return <View style={{ gap: spacing.sm }}>
    <View ref={cardRef} collapsable={false}><Card style={{ gap: spacing.md }}><View style={{ gap: spacing.xs }}><Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>MA BALADE VASCO</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{name}</Text>{sharing && hideShareEndpoints && <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>Départ et arrivée masqués</Text>}</View><WalkRouteVisualization points={sharing && hideShareEndpoints ? sharedPoints : session.points} /><View style={{ flexDirection: 'row', gap: spacing.sm }}><Metric label="Distance" value={distance} /><Metric label="Durée" value={duration(session.duration_seconds)} /><Metric label="Moyenne" value={`${(session.average_speed_mps * 3.6).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km/h`} /></View></Card></View>
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>Masquer le départ et l’arrivée</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Retire {WALK_SHARE_PRIVACY_RADIUS_METERS} m de chaque côté uniquement sur l’image partagée.</Text></View><Switch value={hideShareEndpoints} onValueChange={setHideShareEndpoints} accessibilityLabel="Masquer le départ et l’arrivée sur l’image partagée" /></Card>
    <Button label="Partager le tracé" icon="share" variant="secondary" fullWidth loading={sharing} onPress={() => void share()} />
  </View>;
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return <View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{label}</Text><Text numberOfLines={1} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{value}</Text></View>;
}
