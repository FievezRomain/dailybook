import type { AnimalHistoryRecord } from './types';

export type MeasurementTrend = 'up' | 'down' | 'stable';

export function getMeasurementSummary(history: readonly AnimalHistoryRecord[], unit: string) {
  const ordered = history
    .filter((item) => Number.isFinite(Number(item.value)))
    .slice()
    .sort((a, b) => `${b.datemodification}`.localeCompare(`${a.datemodification}`) || b.id - a.id);
  const latest = ordered[0];
  const previous = ordered[1];
  if (!latest) return { value: '—', trend: 'stable' as const, trendLabel: 'Aucune mesure' };
  const latestValue = Number(latest.value);
  const previousValue = previous ? Number(previous.value) : undefined;
  const trend: MeasurementTrend = previousValue == null || latestValue === previousValue ? 'stable' : latestValue > previousValue ? 'up' : 'down';
  const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${latest.datemodification}T12:00:00`));
  return { value: `${latestValue} ${unit}`, trend, trendLabel: previous ? date : `Mesuré le ${date}` };
}
