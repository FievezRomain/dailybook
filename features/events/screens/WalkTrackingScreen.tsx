import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Banner, Button, Card, DetailScreen, Dialog, Skeleton, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventsQuery, useWalkRoutePlanQuery, walkSessionKey } from '../../../hooks/queries/useEventsQuery';
import type { WalkSession } from '../types';
import { finishWalk, getActiveWalk, isExpoGoWalkTracking, startOrResumeWalk, type ActiveWalk } from '../walkTrackingService';
import { WalkTrackingMap } from '../components/WalkTrackingMap';

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
  const { t } = useTranslation('walkGps');
  const queryClient = useQueryClient();
  const eventsQuery = useEventsQuery();
  const routePlan = useWalkRoutePlanQuery(eventId);
  const eventName = eventsQuery.data?.find((event) => event.id === eventId)?.nom || t('common.defaultWalkName');
  const [active, setActive] = useState<ActiveWalk>();
  const [error, setError] = useState<string>();
  const [stopOpen, setStopOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [, setTick] = useState(0);
  const started = useRef(false);
  const trackingMessages = {
    foregroundPermission: t('errors.foregroundPermission'),
    backgroundPermission: t('errors.backgroundPermission'),
    notificationTitle: t('tracking.notificationTitle'),
    notificationBody: t('tracking.notificationBody'),
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void startOrResumeWalk(eventId, trackingMessages).then(setActive).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : t('tracking.startError'));
    });
  }, [eventId, t]);

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
      const session = await finishWalk(t('errors.noActiveWalk'));
      queryClient.setQueryData<WalkSession>(walkSessionKey(eventId), session);
      setStopOpen(false);
      onFinished();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('tracking.finishError'));
    } finally {
      setFinishing(false);
    }
  };

  return <>
    <DetailScreen header={<TopBar title={t('tracking.title')} context="detail" onBack={onBack} />} contentContainerStyle={{ gap: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg }} testID="walk-tracking-screen">
      {isExpoGoWalkTracking ? <Banner tone="warning" title={t('tracking.expoGoTitle')} message={t('tracking.expoGoMessage')} /> : null}
      {error ? <Banner tone="error" title={t('tracking.unavailableTitle')} message={error} /> : null}
      {!active && !error ? <Skeleton type="card" density="comfortable" /> : null}
      {active ? <>
        <Card style={{ gap: spacing.sm }} accessibilityLabel={t('tracking.cardAccessibility', { name: eventName })}>
          <Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{t('tracking.recording')}</Text>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: 26, lineHeight: 32 }}>{eventName}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{t('tracking.backgroundMessage')}</Text>
        </Card>
        <WalkTrackingMap points={active.points} plannedPoints={routePlan.data?.points} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <LiveMetric label={t('common.duration')} value={elapsedLabel(active.startedAt)} />
          <LiveMetric label={t('common.gpsPoints')} value={String(active.points.length)} />
        </View>
        <Button label={t('tracking.finishButton')} icon="circleCheck" fullWidth onPress={() => setStopOpen(true)} />
        <Button label={t('tracking.backButton')} variant="ghost" fullWidth onPress={onBack} />
      </> : null}
    </DetailScreen>
    <Dialog open={stopOpen} title={t('tracking.finishDialogTitle')} description={t('tracking.finishDialogMessage')} confirmLabel={t('tracking.finishDialogConfirm')} onConfirm={stop} onClose={() => setStopOpen(false)} loading={finishing} />
  </>;
}

function LiveMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return <Card style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl }}>{value}</Text></Card>;
}
