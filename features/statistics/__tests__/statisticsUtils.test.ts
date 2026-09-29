import { buildStatisticsQuery, formatStatisticHistoryDate, formatStatisticsPeriodLabel, getActivityHeatmapData, getEventChartData, getEventCount, getEventHistory, getEventTotal, getExpenseCategoryData, getHistoryTrend, getLatestNumericHistory, getPhysicalChartData, groupExpenseEvents, groupStatisticEventsByDate, shiftStatisticsPeriodAnchor, statisticsPeriodOptions } from '../statisticsUtils';
import type { EventStatisticsData, PhysiqueStatisticsData } from '../../../models/Statistics';

describe('statisticsUtils', () => {
  const now = new Date(2026, 7, 10, 12);

  it('exposes the useful periods without the single-day view', () => {
    expect(statisticsPeriodOptions.map((option) => option.label)).toEqual([
      'Mois',
      'Année',
      '5 ans',
    ]);
  });

  it.each([
    ['month', '2026-08-01', '2026-08-31'],
    ['year', '2026-01-01', '2026-12-31'],
    ['fiveYears', '2022-01-01', '2026-12-31'],
  ] as const)('maps %s to a calendar date range', (period, dateDebut, dateFin) => {
    expect(buildStatisticsQuery(period, [4, 8], now)).toEqual({
      animaux: [4, 8],
      dateDebut,
      dateFin,
    });
  });

  it('labels and moves each selectable range', () => {
    expect(formatStatisticsPeriodLabel('month', now)).toBe('août 2026');
    expect(formatStatisticsPeriodLabel('year', now)).toBe('2026');
    expect(formatStatisticsPeriodLabel('fiveYears', now)).toBe('2022 – 2026');
    expect(shiftStatisticsPeriodAnchor('month', now, -1).getMonth()).toBe(6);
    expect(shiftStatisticsPeriodAnchor('fiveYears', now, -1).getFullYear()).toBe(2021);
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
    expect(groupStatisticEventsByDate(data)[0]?.[0]).toBe('2026-08-08');
  });

  it('builds activity heatmap values from dated occurrences, never distances', () => {
    const data: EventStatisticsData = { statistic: [{ date: '2026-08-03', exact_value: 12 }, { date: '2026-08-03', exact_value: 8 }] };
    const heatmap = getActivityHeatmapData(data, 'month', { dateDebut: '2026-08-01', dateFin: '2026-08-31' });
    expect(heatmap).toHaveLength(31);
    expect(new Set(heatmap.map((cell) => cell.row))).toEqual(new Set(['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5', 'Sem. 6']));
    expect(heatmap.find((cell) => cell.column === 'lundi' && cell.periodKey === '2026-08-03')?.value).toBe(2);
    expect(heatmap.at(-1)?.periodKey).toBe('2026-08-31');
  });

  it.each([
    ['2025-01-01', '2025-12-31', 365],
    ['2024-01-01', '2024-12-31', 366],
  ] as const)('builds one annual heatmap cell per calendar day from %s', (dateDebut, dateFin, expectedDays) => {
    const heatmap = getActivityHeatmapData(undefined, 'year', { dateDebut, dateFin });
    expect(heatmap).toHaveLength(expectedDays);
    expect(heatmap[0]?.periodKey).toBe(dateDebut);
    expect(heatmap.at(-1)?.periodKey).toBe(dateFin);
  });

  it('uses months and years for annual heatmaps', () => {
    const data: EventStatisticsData = { statistic: [{ date: '2025-01-03' }, { date: '2025-01-09' }, { date: '2025-02-02' }] };
    const heatmap = getActivityHeatmapData(data, 'fiveYears', { dateDebut: '2025-01-01', dateFin: '2026-12-31' });
    expect(heatmap.some((cell) => cell.row === '2025' && cell.column.startsWith('janv') && cell.value === 2)).toBe(true);
    expect(heatmap.some((cell) => cell.row === '2026')).toBe(true);
  });

  it('groups expense history by expense category, then by event type', () => {
    const data: EventStatisticsData = { statistic: [{ events: [
      { id: 1, nom: 'Engagement', dateevent: '2026-08-02', animaux: [4], eventtype: 'concours', depense: 30 } as never,
      { id: 2, nom: 'Consultation', dateevent: '2026-08-03', animaux: [4], eventtype: 'depense', depense: 45, categoriedepense: 'Vétérinaire' },
    ] }] };

    expect(groupExpenseEvents(data).map(([label]) => label)).toEqual(['Concours', 'Vétérinaire']);
    expect(getExpenseCategoryData(data)).toEqual([
      { label: 'Concours', value: 30 },
      { label: 'Vétérinaire', value: 45 },
    ]);
  });

  it('merges expense groups regardless of case', () => {
    const data: EventStatisticsData = { statistic: [{ events: [
      { id: 1, nom: 'Soin 1', dateevent: '2026-08-02', animaux: [4], eventtype: 'depense', depense: 20, categoriedepense: 'soins' },
      { id: 2, nom: 'Soin 2', dateevent: '2026-08-03', animaux: [4], eventtype: 'depense', depense: 30, categoriedepense: 'Soins' },
    ] }] };

    expect(groupExpenseEvents(data)).toHaveLength(1);
    expect(groupExpenseEvents(data)[0]?.[0]).toBe('Soins');
    expect(getExpenseCategoryData(data)).toEqual([{ label: 'Soins', value: 50 }]);
  });

  it('keeps the year visible in statistic history dates', () => {
    expect(formatStatisticHistoryDate('2024-03-08')).toContain('2024');
  });
});
