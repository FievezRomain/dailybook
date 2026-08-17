import { useEffect, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { DataVisualization, DetailScreen, EmptyState, ErrorState, EventCard, MetricCard, PeriodRangeNavigator, PeriodSelector, Skeleton, StatisticHistoryGroup, TopBar } from '../../../shared/components/ui';
import { generateDistinctChartColors } from '../../../shared/components/ui/charts/colorUtils';
import { useStatisticsQuery } from '../../../hooks/queries/useStatisticsQuery';
import type { Material } from '../../../theme/materials';
import type { HistoryEntry } from '../../../models/Statistics';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { toEventCardType } from '../../home/homeUtils';
import { buildStatisticsQuery, formatStatisticDate, formatStatisticHistoryDate, formatStatisticNumber, getActivityHeatmapData, getEventChartData, getEventHistory, getExpenseCategoryData, getHistoryTrend, getLatestNumericHistory, getPhysicalChartData, groupExpenseEvents, groupStatisticEventsByDate, statisticsPeriodOptions } from '../statisticsUtils';
import type { StatisticDetailType, StatisticsPeriod } from '../types';

interface StatisticDetailScreenProps {
  type: StatisticDetailType;
  animalIds: readonly number[];
  animalSelector?: ReactNode;
  period: StatisticsPeriod;
  periodAnchor: Date;
  periodLabel: string;
  periodNextDisabled: boolean;
  material?: Material;
  onPeriodChange: (period: StatisticsPeriod) => void;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
  onOpenEvent: (id: number) => void;
  onBack: () => void;
}

const config = { poids: { title: 'Poids', unit: 'kg', chart: 'Évolution du poids' }, taille: { title: 'Taille', unit: 'cm', chart: 'Évolution de la taille' }, alimentation: { title: 'Alimentation', unit: '', chart: 'Évolution des quantités' }, balades: { title: 'Balades', unit: '', chart: 'Fréquence des balades' }, depenses: { title: 'Dépenses', unit: '€', chart: 'Répartition des dépenses' }, entrainements: { title: 'Entraînements', unit: '', chart: 'Fréquence des entraînements' }, concours: { title: 'Concours', unit: '', chart: 'Fréquence des concours' } } as const;

export function StatisticDetailScreen({ type, animalIds, animalSelector, period, periodAnchor, periodLabel, periodNextDisabled, material = 'solid', onPeriodChange, onPreviousPeriod, onNextPeriod, onOpenEvent, onBack }: StatisticDetailScreenProps) {
  const { colors } = useAppTheme();
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState<string>();
  const [historySelectionVersion, setHistorySelectionVersion] = useState(0);
  useEffect(() => setSelectedHistoryPeriod(undefined), [period]);
  const labels = config[type];
  const parameters = buildStatisticsQuery(period, animalIds, periodAnchor);
  const weightQuery = useStatisticsQuery('poids', parameters, type === 'poids' && animalIds.length === 1);
  const sizeQuery = useStatisticsQuery('tailles', parameters, type === 'taille' && animalIds.length === 1);
  const foodQuery = useStatisticsQuery('alimentations', parameters, type === 'alimentation' && animalIds.length === 1);
  const walksQuery = useStatisticsQuery('balades', parameters, type === 'balades');
  const expensesQuery = useStatisticsQuery('depenses', parameters, type === 'depenses');
  const trainingQuery = useStatisticsQuery('entrainements', parameters, type === 'entrainements');
  const competitionQuery = useStatisticsQuery('concours', parameters, type === 'concours');
  const query = type === 'poids' ? weightQuery : type === 'taille' ? sizeQuery : type === 'alimentation' ? foodQuery : type === 'balades' ? walksQuery : type === 'depenses' ? expensesQuery : type === 'entrainements' ? trainingQuery : competitionQuery;
  const isPhysical = type === 'poids' || type === 'taille' || type === 'alimentation';
  if (isPhysical && animalIds.length !== 1) return <DetailScreen header={<TopBar title={labels.title} context="detail" onBack={onBack} material={material} />} contentContainerStyle={{ gap: spacing.lg }}>{animalSelector}<EmptyState title="Sélectionnez un seul animal" message="Le poids, la taille et l’alimentation sont des suivis individuels qui ne peuvent pas être mélangés entre plusieurs animaux." /></DetailScreen>;
  if (query.isLoading) return <DetailScreen header={<TopBar title={labels.title} context="detail" onBack={onBack} material={material} />}><Skeleton type="card" density="comfortable" /></DetailScreen>;
  if (query.isError) return <DetailScreen header={<TopBar title={labels.title} context="detail" onBack={onBack} material={material} />}><ErrorState message={`Impossible de charger ${labels.title.toLowerCase()}.`} onRetry={() => void query.refetch()} /></DetailScreen>;

  const physical = type === 'poids' ? weightQuery.data : type === 'taille' ? sizeQuery.data : type === 'alimentation' ? foodQuery.data : undefined;
  const eventData = type === 'balades' ? walksQuery.data : type === 'depenses' ? expensesQuery.data : type === 'entrainements' ? trainingQuery.data : type === 'concours' ? competitionQuery.data : undefined;
  const physicalHistory = [...(physical?.history ?? [])].sort((left, right) => right.date.localeCompare(left.date));
  const history = isPhysical ? physicalHistory.map((entry) => ({ date: entry.date, value: Number(entry.value), detail: entry.type === 'food' ? String(entry.value) : entry.unity })) : getEventHistory(type, eventData);
  const chartData = isPhysical ? getPhysicalChartData(physical) : getEventChartData(type, eventData);
  const physicalLatest = isPhysical ? getLatestNumericHistory(physical) : undefined;
  const latest = physicalLatest ?? history[0];
  const trend = isPhysical ? getHistoryTrend(physical) : 0;
  const selectedPoint = chartData.at(-1);
  const eventGroups = type === 'depenses' ? groupExpenseEvents(eventData) : groupStatisticEventsByDate(eventData);
  const expenseData = getExpenseCategoryData(eventData);
  const expenseColors = generateDistinctChartColors(expenseData.length);
  const coloredExpenseData = expenseData.map((item, index) => ({ ...item, color: expenseColors[index] }));
  const expenseTotal = expenseData.reduce((total, item) => total + item.value, 0);
  const heatmapData = isPhysical || type === 'depenses' ? [] : getActivityHeatmapData(eventData, period, parameters);
  const latestDate = history[0] ? formatStatisticHistoryDate(history[0].date) : undefined;
  const valueLabel = type === 'alimentation' ? 'Dernière quantité' : isPhysical ? 'Dernière mesure' : type === 'depenses' ? 'Dernière dépense' : 'Dernière valeur';
  const valueSupportingText = isPhysical ? `Évolution sur la période : ${formatStatisticNumber(Math.abs(trend), labels.unit)}` : latestDate ? `Enregistrée le ${latestDate}` : 'Aucune donnée';
  const selectHistoryGroup = (key?: string) => { if (!key) return; setSelectedHistoryPeriod(key); setHistorySelectionVersion((version) => version + 1); };

  return <DetailScreen header={<TopBar title={labels.title} context="detail" onBack={onBack} material={material} />} contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }} testID={`statistic-detail-${type}`}>
    {animalSelector}
    <PeriodSelector options={statisticsPeriodOptions} value={period} onChange={onPeriodChange} />
    <PeriodRangeNavigator label={periodLabel} onPrevious={onPreviousPeriod} onNext={onNextPeriod} nextDisabled={periodNextDisabled} />
    {type === 'depenses' ? <MetricCard label="Total des dépenses" value={formatStatisticNumber(expenseTotal, '€')} supportingText={`Sur la période · ${periodLabel}`} density="compact" material={material} style={{ width: '100%' }} /> : null}
    <View style={{ flexDirection: 'row', gap: spacing.md }}><View style={{ flex: 1 }}><MetricCard label={valueLabel} value={latest ? `${formatStatisticNumber(Number(latest.value), labels.unit)}${type === 'alimentation' && physicalLatest?.unity ? ` ${physicalLatest.unity}` : ''}` : '—'} trend={isPhysical ? trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable' : undefined} supportingText={valueSupportingText} density="compact" material={material} /></View><View style={{ flex: 1 }}><MetricCard label="Nombre d’entrées" value={String(history.length)} supportingText={latestDate ? `Dernière entrée : ${latestDate}` : 'Aucune entrée sur la période'} density="compact" material={material} /></View></View>
    <DataVisualization title={labels.chart} type={type === 'depenses' ? 'pie' : isPhysical ? 'line' : 'heatmap'} state={(isPhysical ? chartData.length : history.length) ? 'ready' : 'empty'} data={type === 'depenses' ? coloredExpenseData : chartData} heatmapData={heatmapData} onDataPress={type === 'depenses' ? (item) => selectHistoryGroup(item.label) : undefined} onHeatmapPress={isPhysical || type === 'depenses' ? undefined : (item) => selectHistoryGroup(item.periodKey)} valueFormatter={(value) => formatStatisticNumber(value, labels.unit)} selected={selectedPoint ? { label: selectedPoint.label, value: formatStatisticNumber(selectedPoint.value, labels.unit) } : undefined} accessibilitySummary={`${history.length} entrées pour ${labels.title.toLowerCase()}`} testID={`statistic-chart-${type}`} />
    {type === 'alimentation' ? <FoodHistorySections entries={physicalHistory} /> : <View style={{ gap: spacing.sm }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl }}>Historique</Text>{eventGroups.length ? eventGroups.map(([group, events]) => { const selected = Boolean(selectedHistoryPeriod && (type === 'depenses' ? group === selectedHistoryPeriod : group.startsWith(selectedHistoryPeriod))); return <StatisticHistoryGroup key={`${group}-${selectedHistoryPeriod ?? 'initial'}-${historySelectionVersion}`} label={type === 'depenses' ? group : formatStatisticHistoryDate(group)} indicatorColor={type === 'depenses' ? coloredExpenseData.find((item) => item.label === group)?.color : undefined} summary={`${events.length} événement${events.length > 1 ? 's' : ''}`} defaultExpanded={selected}>{events.map((event) => <EventCard key={event.id} type={toEventCardType(event.eventtype)} date={formatStatisticHistoryDate(event.dateevent)} time={event.heuredebutevent} title={event.nom} description={event.commentaire} onPress={() => onOpenEvent(event.id)} />)}</StatisticHistoryGroup>; }) : history.length ? history.map((entry, index) => <HistoryRow key={`${entry.date}-${index}`} date={entry.date} value={formatStatisticNumber(entry.value, labels.unit)} />) : <EmptyState icon="chartColumn" title="Aucune donnée sur cette période" message="Les prochaines entrées apparaîtront ici." />}</View>}
  </DetailScreen>;
}

function FoodHistorySections({ entries }: { entries: readonly HistoryEntry[] }) {
  const foods = entries.filter((entry) => entry.type === 'food');
  const quantities = entries.filter((entry) => entry.type === 'quantity');
  return <View style={{ gap: spacing.lg }}>
    <HistorySection title="Historique des aliments" entries={foods} formatValue={(entry) => String(entry.value)} />
    <HistorySection title="Historique des quantités" entries={quantities} formatValue={(entry) => `${formatStatisticNumber(Number(entry.value))}${entry.unity ? ` ${entry.unity}` : ''}`} />
  </View>;
}

function HistorySection({ title, entries, formatValue }: { title: string; entries: readonly HistoryEntry[]; formatValue: (entry: HistoryEntry) => string }) {
  const { colors } = useAppTheme();
  return <View style={{ gap: spacing.sm }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl }}>{title}</Text>{entries.length ? entries.map((entry) => <HistoryRow key={`${entry.type}-${entry.id}`} date={entry.date} value={formatValue(entry)} />) : <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Aucune entrée sur cette période.</Text>}</View>;
}

function HistoryRow({ date, value }: { date: string; value: string }) {
  const { colors } = useAppTheme();
  return <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{formatStatisticHistoryDate(date)}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{value}</Text></View>;
}
