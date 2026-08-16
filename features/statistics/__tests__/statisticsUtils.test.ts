import { buildStatisticsQuery, getActivityHeatmapData, getEventChartData, getEventCount, getEventHistory, getEventTotal, getExpenseCategoryData, getHistoryTrend, getLatestNumericHistory, getPhysicalChartData, statisticsPeriodOptions } from '../statisticsUtils';
import type { EventStatisticsData, PhysiqueStatisticsData } from '../../../models/Statistics';

describe('statisticsUtils', () => {
  const now = new Date(2026, 7, 10, 12);

  it('exposes the four periods from the Statistics design', () => {
    expect(statisticsPeriodOptions.map((option) => option.label)).toEqual([
      'Jour',
      'Mois',
      '1 an',
      '5 ans',
    ]);
  });

  it.each([
    ['day', '2026-08-10'],
    ['month', '2026-07-11'],
    ['year', '2025-08-10'],
    ['fiveYears', '2021-08-10'],
  ] as const)('maps %s to an ISO date range', (period, dateDebut) => {
    expect(buildStatisticsQuery(period, [4, 8], now)).toEqual({
      animaux: [4, 8],
      dateDebut,
      dateFin: '2026-08-10',
    });
  });

  it('maps physical history to the latest value, trend and chart points', () => {
    const data: PhysiqueStatisticsData = {
      statistic: { labels: [], datasets: [] },
      history: [
        { id: 1, idanimal: 4, date: '2026-08-01', value: 13.2 },
        { id: 2, idanimal: 4, date: '2026-08-10', value: 12.8 },
      ],
    };
    expect(getLatestNumericHistory(data)?.value).toBe(12.8);
    expect(getHistoryTrend(data)).toBeCloseTo(-0.4);
    expect(getPhysicalChartData(data)).toEqual([
      { label: '1 août', value: 13.2 },
      { label: '10 août', value: 12.8 },
    ]);
  });

  it('maps walk statistics to totals, counts, history and chart points', () => {
    const data: EventStatisticsData = {
      statistic: [
        { date: '2026-08-02', exact_value: 3.2, count: 1 },
        { date: '2026-08-09', exact_value: 4.1, count: 1 },
      ],
    };
    expect(getEventTotal(data)).toBe(7.3);
    expect(getEventCount(data)).toBe(2);
    expect(getEventHistory('balades', data)[0]).toEqual({ date: '2026-08-09', value: 4.1 });
    expect(getEventChartData('balades', data)).toEqual([
      { label: '2 août', value: 3.2 },
      { label: '9 août', value: 4.1 },
    ]);
  });

  it('uses expense events for dated expense history', () => {
    const data: EventStatisticsData = {
      statistic: [{
        name: 'Vétérinaire',
        value: 45,
        events: [{ id: 7, nom: 'Consultation', dateevent: '2026-08-08', animaux: [4], eventtype: 'depense', depense: 45, categoriedepense: 'Vétérinaire' }],
      }],
    };
    expect(getEventHistory('depenses', data)).toEqual([
      { date: '2026-08-08', value: 45, detail: 'Vétérinaire' },
    ]);
    expect(getExpenseCategoryData(data)).toEqual([{ label: 'Vétérinaire', value: 45 }]);
  });

  it('builds activity heatmap values from dated occurrences, never distances', () => {
    const data: EventStatisticsData = { statistic: [{ date: '2026-08-03', exact_value: 12 }, { date: '2026-08-03', exact_value: 8 }] };
    expect(getActivityHeatmapData(data).find((cell) => cell.row === 'L' && cell.column === '1')?.value).toBe(2);
  });
});
