import { clampIntensity, getChartSummary, normalizeChartValues } from '../../../shared/components/ui/charts/chartUtils';

describe('chart utilities', () => {
  const data = [{ label: 'Lun', value: 10 }, { label: 'Mar', value: 20 }];
  it('normalizes chart values', () => {
    expect(normalizeChartValues(data).map((item) => item.normalized)).toEqual([0, 1]);
  });
  it('produces a non-visual accessible summary', () => {
    expect(getChartSummary(data)).toBe('Lun : 10, Mar : 20');
    expect(getChartSummary([])).toBe('Aucune donnée');
  });
  it('clamps heatmap intensity', () => {
    expect(clampIntensity(-1)).toBe(0);
    expect(clampIntensity(2)).toBe(1);
  });
});
