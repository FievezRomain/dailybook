import type { ReactNode } from 'react';
import { View } from 'react-native';
import { EmptyState, ErrorState, MetricCard, PeriodSelector, Skeleton } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { spacing } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useStatisticsDashboard } from '../hooks/useStatisticsDashboard';
import { formatStatisticDate, formatStatisticNumber, getEventCount, getEventTotal, getHistoryTrend, getLatestNumericHistory, statisticsPeriodOptions } from '../statisticsUtils';
import type { StatisticDetailType, StatisticsPeriod } from '../types';
import { StatisticTile } from './StatisticTile';

interface StatisticsOverviewProps {
  animalIds: readonly number[];
  period: StatisticsPeriod;
  material?: Material;
  onPeriodChange: (period: StatisticsPeriod) => void;
  onOpenDetail: (type: StatisticDetailType) => void;
}

export function StatisticsOverview({ animalIds, period, material = 'solid', onPeriodChange, onOpenDetail }: StatisticsOverviewProps) {
  const { colors } = useAppTheme();
  const dashboard = useStatisticsDashboard(period, animalIds);
  if (!animalIds.length) return <EmptyState title="Aucun animal à analyser" message="Ajoutez un animal pour commencer à suivre ses statistiques." />;
  return <View style={{ padding: spacing.md, gap: spacing.md }}>
    <PeriodSelector options={statisticsPeriodOptions} value={period} onChange={onPeriodChange} testID="statistics-period" />
    {dashboard.isLoading ? <LoadingGrid /> : dashboard.isError ? <ErrorState message="Impossible de charger les statistiques." onRetry={() => void dashboard.refetch()} /> : <StatisticsGrid dashboard={dashboard} material={material} onOpenDetail={onOpenDetail} colors={colors} />}
  </View>;
}

type Dashboard = ReturnType<typeof useStatisticsDashboard>;
function StatisticsGrid({ dashboard, material, onOpenDetail, colors }: { dashboard: Dashboard; material: Material; onOpenDetail: (type: StatisticDetailType) => void; colors: ReturnType<typeof useAppTheme>['colors'] }) {
  const weight = getLatestNumericHistory(dashboard.poids.data); const size = getLatestNumericHistory(dashboard.tailles.data);
  const weightTrend = getHistoryTrend(dashboard.poids.data); const walkCount = getEventCount(dashboard.balades.data); const expenses = getEventTotal(dashboard.depenses.data); const expenseCount = getEventCount(dashboard.depenses.data); const trainingCount = getEventCount(dashboard.entrainements.data); const competitionCount = getEventCount(dashboard.concours.data);
  const value = (entry: typeof weight, unit: string) => entry ? formatStatisticNumber(Number(entry.value), unit) : '—';
  return <><View style={{ flexDirection: 'row', gap: spacing.md }}><View style={{ flex: 1 }}><MetricCard label="Poids actuel" value={value(weight, 'kg')} trend={weightTrend > 0 ? 'up' : weightTrend < 0 ? 'down' : 'stable'} trendLabel={`${formatStatisticNumber(Math.abs(weightTrend), 'kg')} sur la période`} density="compact" material={material} onPress={() => onOpenDetail('poids')} testID="statistics-summary-weight" /></View><View style={{ flex: 1 }}><MetricCard label="Activité" value={`${walkCount} balade${walkCount > 1 ? 's' : ''}`} trend="stable" trendLabel="Fréquence sur la période" density="compact" material={material} onPress={() => onOpenDetail('balades')} testID="statistics-summary-activity" /></View></View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      <Tile><StatisticTile label="Poids" value={value(weight, 'kg')} supporting={`${dashboard.poids.data?.history.length ?? 0} mesures`} accent={colors.success} material={material} onPress={() => onOpenDetail('poids')} testID="statistics-weight" /></Tile>
      <Tile><StatisticTile label="Taille" value={value(size, 'cm')} supporting={size ? `Dernière · ${formatStatisticDate(size.date)}` : 'Aucune mesure'} accent={colors.eventBalade} material={material} testID="statistics-size" /></Tile>
      <Tile><StatisticTile label="Balades" value={`${walkCount} balade${walkCount > 1 ? 's' : ''}`} supporting="Fréquence sur la période" accent={colors.primary} material={material} onPress={() => onOpenDetail('balades')} testID="statistics-walks" /></Tile>
      <Tile><StatisticTile label="Dépenses" value={formatStatisticNumber(expenses, '€')} supporting={`${expenseCount} dépense${expenseCount > 1 ? 's' : ''}`} accent={colors.eventDepense} material={material} onPress={() => onOpenDetail('depenses')} testID="statistics-expenses" /></Tile>
      <Tile><StatisticTile label="Entraînements" value={`${trainingCount} séance${trainingCount > 1 ? 's' : ''}`} supporting="Sur la période" accent={colors.success} material={material} onPress={() => onOpenDetail('entrainements')} testID="statistics-training" /></Tile>
      <Tile><StatisticTile label="Concours" value={`${competitionCount} concours`} supporting="Sur la période" accent={colors.eventConcours} material={material} onPress={() => onOpenDetail('concours')} testID="statistics-competitions" /></Tile>
    </View></>;
}

function Tile({ children }: { children: ReactNode }) { return <View style={{ flexBasis: '46%', flexGrow: 1 }}>{children}</View>; }
function LoadingGrid() { return <View style={{ gap: spacing.md }}><Skeleton type="list" /><Skeleton type="list" /><Skeleton type="list" /><Skeleton type="list" /></View>; }
