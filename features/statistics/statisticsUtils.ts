import { format, subDays, subYears } from 'date-fns';
import type { EventStatisticsData, HistoryEntry, PhysiqueStatisticsData } from '../../models/Statistics';
import type { ChartDatum, HeatmapDatum } from '../../shared/components/ui';
import type { PeriodOption } from '../../shared/components/ui';
import type { StatisticDetailType, StatisticsPeriod, StatisticsQueryPayload } from './types';

export interface StatisticHistoryPoint {
  date: string;
  value: number;
  detail?: string;
}

export const statisticsPeriodOptions: readonly PeriodOption<StatisticsPeriod>[] = [
  { value: 'day', label: 'Jour' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: '1 an' },
  { value: 'fiveYears', label: '5 ans' },
];

export function buildStatisticsQuery(
  period: StatisticsPeriod,
  animaux: readonly number[],
  now = new Date(),
): StatisticsQueryPayload {
  const dateDebut = period === 'day'
    ? now
    : period === 'month'
      ? subDays(now, 30)
      : subYears(now, period === 'year' ? 1 : 5);

  return {
    animaux: [...animaux],
    dateDebut: format(dateDebut, 'yyyy-MM-dd'),
    dateFin: format(now, 'yyyy-MM-dd'),
  };
}

export function getLatestNumericHistory(data?: PhysiqueStatisticsData): HistoryEntry | undefined {
  return [...(data?.history ?? [])]
    .filter((entry) => Number.isFinite(Number(entry.value)))
    .sort((left, right) => right.date.localeCompare(left.date))[0];
}

export function getHistoryTrend(data?: PhysiqueStatisticsData): number {
  const values = [...(data?.history ?? [])]
    .filter((entry) => Number.isFinite(Number(entry.value)))
    .sort((left, right) => left.date.localeCompare(right.date));
  return values.length > 1 ? Number(values.at(-1)?.value) - Number(values[0].value) : 0;
}

export function getEventTotal(data?: EventStatisticsData): number {
  return (data?.statistic ?? []).reduce(
    (total, item) => total + Number(item.exact_value ?? item.value ?? item.count ?? 0),
    0,
  );
}

export function getEventCount(data?: EventStatisticsData): number {
  const events = (data?.statistic ?? []).flatMap((item) => item.events ?? []);
  return events.length || (data?.statistic ?? []).length;
}

export function getPhysicalChartData(data?: PhysiqueStatisticsData): ChartDatum[] {
  return (data?.history ?? [])
    .filter((entry) => Number.isFinite(Number(entry.value)))
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((entry) => ({ label: formatStatisticDate(entry.date), value: Number(entry.value) }));
}

export function getEventHistory(type: StatisticDetailType, data?: EventStatisticsData): StatisticHistoryPoint[] {
  if (type === 'depenses') {
    const events = (data?.statistic ?? []).flatMap((item) => item.events ?? []);
    if (events.length) {
      return events.map((event) => ({
        date: event.dateevent,
        value: 'depense' in event ? Number(event.depense ?? 0) : 0,
        detail: 'categoriedepense' in event ? event.categoriedepense : undefined,
      })).sort((left, right) => right.date.localeCompare(left.date));
    }
  }
  return (data?.statistic ?? []).map((item) => ({
    date: item.date ?? '',
    value: Number(item.exact_value ?? item.value ?? item.count ?? 0),
    detail: item.name,
  })).filter((item) => item.date || item.detail).sort((left, right) => right.date.localeCompare(left.date));
}

export function getEventChartData(type: StatisticDetailType, data?: EventStatisticsData): ChartDatum[] {
  return getEventHistory(type, data).slice().reverse().map((item) => ({
    label: item.date ? formatStatisticDate(item.date) : item.detail ?? '',
    value: item.value,
  }));
}

export function formatStatisticNumber(value: number, unit = ''): string {
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value);
  return `${formatted}${unit ? ` ${unit}` : ''}`;
}

export function formatStatisticDate(value: string): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
    .format(new Date(`${value.slice(0, 10)}T12:00:00`));
}

export function getExpenseCategoryData(data?: EventStatisticsData): ChartDatum[] {
  const totals = new Map<string, number>();
  for (const event of (data?.statistic ?? []).flatMap((item) => item.events ?? [])) {
    if (event.eventtype !== 'depense') continue;
    const category = event.categoriedepense?.trim() || 'Autre';
    totals.set(category, (totals.get(category) ?? 0) + Number(event.depense ?? 0));
  }
  if (!totals.size) for (const item of data?.statistic ?? []) totals.set(item.name?.trim() || 'Autre', Number(item.exact_value ?? item.value ?? 0));
  return [...totals].map(([label, value]) => ({ label, value })).filter((item) => item.value > 0);
}

export function getActivityHeatmapData(data?: EventStatisticsData): HeatmapDatum[] {
  const counts = new Map<string, number>();
  const dates = (data?.statistic ?? []).flatMap((item) => item.events?.map((event) => event.dateevent) ?? (item.date ? [item.date] : []));
  for (const value of dates) { const date = new Date(`${value.slice(0, 10)}T12:00:00`); if (!Number.isFinite(date.getTime())) continue; const key = `${date.getDay() || 7}-${Math.ceil(date.getDate() / 7)}`; counts.set(key, (counts.get(key) ?? 0) + 1); }
  const rows = ['L', 'M', 'M ', 'J', 'V', 'S', 'D'];
  return rows.flatMap((row, rowIndex) => [1, 2, 3, 4, 5].map((week) => ({ row, column: String(week), value: counts.get(`${rowIndex + 1}-${week}`) ?? 0 })));
}

export function getStatisticEvents(data?: EventStatisticsData) {
  return (data?.statistic ?? []).flatMap((item) => item.events ?? []).sort((left, right) => right.dateevent.localeCompare(left.dateevent));
}
