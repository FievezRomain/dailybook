export interface ChartDatum { label: string; value: number; color?: string }
export function normalizeChartValues(data: readonly ChartDatum[]) {
  if (!data.length) return [];
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return data.map((item) => ({ ...item, normalized: (item.value - min) / range }));
}
export function getChartSummary(data: readonly ChartDatum[]) {
  if (!data.length) return 'Aucune donnée';
  return data.map((item) => `${item.label} : ${item.value}`).join(', ');
}
export function clampIntensity(value: number) { return Math.min(1, Math.max(0, value)); }
