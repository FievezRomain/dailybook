import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Banner, Button, Card, DetailScreen, Dialog, Skeleton, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventsQuery, walkSessionKey } from '../../../hooks/queries/useEventsQuery';
import type { WalkSession } from '../types';
import { finishWalk, getActiveWalk, isExpoGoWalkTracking, startOrResumeWalk, type ActiveWalk } from '../walkTrackingService';
import { WalkRouteVisualization } from '../components/WalkRouteCard';

export interface WalkTrackingScreenProps {
  eventId: number;
  onBack: () => void;
  onFinished: () => void;
}

function elapsedLabel(startedAt?: string) {
  if (!startedAt) return '0 min';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours} h ${String(minutes).padStart(2, '0')}` : `${minutes} min`;
}

export function WalkTrackingScreen({ eventId, onBack, onFinished }: WalkTrackingScreenProps) {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const eventsQuery = useEventsQuery();
  const eventName = eventsQuery.data?.find((event) => event.id === eventId)?.nom || 'Ma balade';
  const [active, setActive] = useState<ActiveWalk>();
  const [error, setError] = useState<string>();
  const [stopOpen, setStopOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [, setTick] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void startOrResumeWalk(eventId).then(setActive).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Le suivi GPS n’a pas pu démarrer.');
    });
  }, [eventId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((value) => value + 1);
      void getActiveWalk(eventId).then((value) => { if (value) setActive(value); });
    }, 2000);
    return () => clearInterval(interval);
  }, [eventId]);

  const stop = async () => {
    setFinishing(true);
    setError(undefined);
    try {
      const session = await finishWalk();
      queryClient.setQueryData<WalkSession>(walkSessionKey(eventId), session);
      setStopOpen(false);
      onFinished();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'La balade n’a pas pu être terminée.');
    } finally {
      setFinishing(false);
    }
  };

  return <>
    <DetailScreen header={<TopBar title="Balade GPS" context="detail" onBack={onBack} />} contentContainerStyle={{ gap: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg }} testID="walk-tracking-screen">
      {isExpoGoWalkTracking ? <Banner tone="warning" title="Test limité dans Expo Go" message="Le tracé est enregistré tant que Vasco reste au premier plan. Pour tester le suivi écran verrouillé, utilisez un development build." /> : null}
      {error ? <Banner tone="error" title="Suivi GPS indisponible" message={error} /> : null}
      {!active && !error ? <Skeleton type="card" density="comfortable" /> : null}
      {active ? <>
        <Card style={{ gap: spacing.sm }} accessibilityLabel={`Balade ${eventName} en cours`}>
          <Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>ENREGISTREMENT EN COURS</Text>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: 26, lineHeight: 32 }}>{eventName}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>Le suivi continue lorsque l’écran est verrouillé. Vous pouvez revenir au détail sans l’interrompre.</Text>
        </Card>
        <WalkRouteVisualization points={active.points} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <LiveMetric label="Durée" value={elapsedLabel(active.startedAt)} />
          <LiveMetric label="Points GPS" value={String(active.points.length)} />
        </View>
        <Button label="Terminer la balade" icon="circleCheck" fullWidth onPress={() => setStopOpen(true)} />
        <Button label="Revenir au détail" variant="ghost" fullWidth onPress={onBack} />
      </> : null}
    </DetailScreen>
    <Dialog open={stopOpen} title="Terminer la balade ?" description="Le tracé sera synchronisé puis ajouté au détail de l’événement. Vous pourrez ensuite le partager." confirmLabel="Terminer et enregistrer" onConfirm={stop} onClose={() => setStopOpen(false)} loading={finishing} />
  </>;
}

function LiveMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return <Card style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl }}>{value}</Text></Card>;
}
