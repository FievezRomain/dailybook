import { addMonths, addYears, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subYears } from 'date-fns';
import type { EventStatisticsData, HistoryEntry, PhysiqueStatisticsData } from '../../models/Statistics';
import type { Event } from '../../models/Event';
import type { ChartDatum, HeatmapDatum } from '../../shared/components/ui';
import type { PeriodOption } from '../../shared/components/ui';
import type { StatisticDetailType, StatisticsPeriod, StatisticsQueryPayload } from './types';

export interface StatisticHistoryPoint {
  date: string;
  value: number;
  detail?: string;
}

export const statisticsPeriodOptions: readonly PeriodOption<StatisticsPeriod>[] = [
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année' },
  { value: 'fiveYears', label: '5 ans' },
];

export function buildStatisticsQuery(
  period: StatisticsPeriod,
  animaux: readonly number[],
  now = new Date(),
): StatisticsQueryPayload {
  const range = getStatisticsPeriodRange(period, now);

  return {
    animaux: [...animaux],
    dateDebut: format(range.start, 'yyyy-MM-dd'),
    dateFin: format(range.end, 'yyyy-MM-dd'),
  };
}

export function getStatisticsPeriodRange(period: StatisticsPeriod, anchor = new Date()) {
  if (period === 'month') return { start: startOfMonth(anchor), end: endOfMonth(anchor) };
  if (period === 'year') return { start: startOfYear(anchor), end: endOfYear(anchor) };
  return { start: subYears(startOfYear(anchor), 4), end: endOfYear(anchor) };
}

export function shiftStatisticsPeriodAnchor(period: StatisticsPeriod, anchor: Date, direction: -1 | 1): Date {
  return period === 'month' ? addMonths(anchor, direction) : addYears(anchor, direction * (period === 'fiveYears' ? 5 : 1));
}

export function formatStatisticsPeriodLabel(period: StatisticsPeriod, anchor: Date): string {
  if (period === 'month') return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(anchor);
  if (period === 'year') return String(anchor.getFullYear());
  return `${anchor.getFullYear() - 4} – ${anchor.getFullYear()}`;
}

export function isCurrentStatisticsPeriod(period: StatisticsPeriod, anchor: Date, now = new Date()): boolean {
  const current = getStatisticsPeriodRange(period, now);
  const selected = getStatisticsPeriodRange(period, anchor);
  return selected.end.getTime() >= current.end.getTime();
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

export function formatStatisticHistoryDate(value: string): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${value.slice(0, 10)}T12:00:00`));
}

export function getExpenseCategoryData(data?: EventStatisticsData): ChartDatum[] {
  const totals = new Map<string, number>();
  for (const event of (data?.statistic ?? []).flatMap((item) => item.events ?? [])) {
    const category = getExpenseGroupLabel(event);
    totals.set(category, (totals.get(category) ?? 0) + Number('depense' in event ? event.depense ?? 0 : 0));
  }
  if (!totals.size) for (const item of data?.statistic ?? []) totals.set(item.name?.trim() || 'Autre', Number(item.exact_value ?? item.value ?? 0));
  return [...totals].map(([label, value]) => ({ label, value })).filter((item) => item.value > 0);
}

export function getExpenseGroupLabel(event: Event): string {
  const category = 'categoriedepense' in event ? event.categoriedepense?.trim() : undefined;
  return canonicalExpenseGroupLabel(category || event.eventtype);
}

function canonicalExpenseGroupLabel(value: string): string {
  const normalized = value.trim().toLocaleLowerCase('fr-FR');
  const known = { concours: 'Concours', rdv: 'Rendez-vous', 'rendez-vous': 'Rendez-vous', entrainement: 'Entraînement', entraînement: 'Entraînement', balade: 'Balade', soins: 'Soins', soin: 'Soins', depense: 'Dépense', dépense: 'Dépense', autre: 'Autre' } as Record<string, string>;
  return known[normalized] ?? `${normalized.charAt(0).toLocaleUpperCase('fr-FR')}${normalized.slice(1)}`;
}

export function groupExpenseEvents(data?: EventStatisticsData): Array<[string, Event[]]> {
  const groups = getStatisticEvents(data).reduce<Record<string, Event[]>>((result, event) => {
    const label = getExpenseGroupLabel(event);
    (result[label] ??= []).push(event);
    return result;
  }, {});
  const chartOrder = getExpenseCategoryData(data).map((item) => item.label);
  return chartOrder.flatMap((label) => groups[label] ? [[label, groups[label]] as [string, Event[]]] : []);
}

export function getActivityHeatmapData(data: EventStatisticsData | undefined, period: StatisticsPeriod, range?: Pick<StatisticsQueryPayload, 'dateDebut' | 'dateFin'>): HeatmapDatum[] {
  const eventDates = (data?.statistic ?? []).flatMap((item) => item.events?.map((event) => event.dateevent.slice(0, 10)) ?? (item.date ? [item.date.slice(0, 10)] : []));
  const startValue = range?.dateDebut ?? eventDates.slice().sort()[0];
  const endValue = range?.dateFin ?? eventDates.slice().sort().at(-1);
  if (!startValue || !endValue) return [];
  const start = new Date(`${startValue}T12:00:00`);
  const end = new Date(`${endValue}T12:00:00`);
  const monthly = period === 'year' || period === 'fiveYears';
  const counts = new Map<string, number>();
  for (const value of eventDates) {
    const key = monthly ? value.slice(0, 7) : value;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (monthly) {
    const rows: HeatmapDatum[] = [];
    for (let year = start.getFullYear(); year <= end.getFullYear(); year += 1) {
      for (let month = 0; month < 12; month += 1) {
        const point = new Date(year, month, 1, 12);
        if (point < new Date(start.getFullYear(), start.getMonth(), 1, 12) || point > new Date(end.getFullYear(), end.getMonth(), 1, 12)) continue;
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;
        rows.push({ row: String(year), column: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(point).replace('.', ''), value: counts.get(key) ?? 0, periodKey: key });
      }
    }
    return rows;
  }
  const rows: HeatmapDatum[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = format(cursor, 'yyyy-MM-dd');
    rows.push({ row: new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(cursor).replace('.', ''), column: String(cursor.getDate()), value: counts.get(key) ?? 0, periodKey: key });
  }
  return rows;
}

export function getStatisticEvents(data?: EventStatisticsData) {
  return (data?.statistic ?? []).flatMap((item) => item.events ?? []).sort((left, right) => right.dateevent.localeCompare(left.dateevent));
}

export function groupStatisticEventsByDate(data?: EventStatisticsData): Array<[string, Event[]]> {
  const groups = getStatisticEvents(data).reduce<Record<string, Event[]>>((result, event) => {
    const date = event.dateevent.slice(0, 10);
    (result[date] ??= []).push(event);
    return result;
  }, {});
  return Object.entries(groups).sort(([left], [right]) => right.localeCompare(left));
}
