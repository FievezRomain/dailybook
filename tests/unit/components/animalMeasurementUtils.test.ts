import { getMeasurementSummary } from '../../../features/animals/animalMeasurementUtils';

describe('getMeasurementSummary', () => {
  it('uses the newest dated measure and compares only the two latest real values', () => {
    const summary = getMeasurementSummary([
      { id: 1, idanimal: 7, value: 10, unity: 'kg', datemodification: '2026-01-01' },
      { id: 2, idanimal: 7, value: 12, unity: 'kg', datemodification: '2026-02-01' },
    ], 'kg');
    expect(summary.value).toBe('12 kg');
    expect(summary.trend).toBe('up');
    expect(summary.trendLabel).toContain('2026');
  });

  it('does not invent a trend when only one measure exists', () => {
    const summary = getMeasurementSummary([{ id: 1, idanimal: 7, value: 48, unity: 'cm', datemodification: '2026-02-01' }], 'cm');
    expect(summary).toMatchObject({ value: '48 cm', trend: 'stable' });
    expect(summary.trendLabel).toContain('Mesuré le');
  });

  it('returns an explicit empty summary', () => {
    expect(getMeasurementSummary([], 'kg')).toEqual({ value: '—', trend: 'stable', trendLabel: 'Aucune mesure' });
  });
});
