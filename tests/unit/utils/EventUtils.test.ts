import { getEventTypeDot, convertDateToText, buildMarkedDates } from '../../../shared/utils/EventUtils';

const COLORS = {
  accent: '#aa0000',
  tertiary: '#00aa00',
  primary: '#0000aa',
  text: '#111111',
  neutral: '#888888',
  error: '#ff0000',
  quaternary: '#ffaa00',
  onSurface: '#cccccc',
};

describe('getEventTypeDot', () => {
  it.each([
    ['balade', COLORS.accent],
    ['entrainement', COLORS.tertiary],
    ['concours', COLORS.primary],
    ['rdv', COLORS.text],
    ['soins', COLORS.neutral],
    ['autre', COLORS.error],
    ['depense', COLORS.quaternary],
  ])('returns correct color for eventType "%s"', (type, expected) => {
    expect(getEventTypeDot(type, COLORS)).toEqual({ color: expected });
  });

  it('uses onSurface as fallback for unknown eventType', () => {
    expect(getEventTypeDot('unknown_type', COLORS)).toEqual({ color: COLORS.onSurface });
  });
});

describe('convertDateToText', () => {
  it('returns capitalized French date string for a valid date', () => {
    const result = convertDateToText('2024-06-15');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe(result[0].toUpperCase());
    expect(result.toLowerCase()).toContain('2024');
  });

  it('returns "Date invalide" for an invalid date', () => {
    expect(convertDateToText('not-a-date')).toBe('Date invalide');
  });

  it('returns "Date invalide" for empty string', () => {
    expect(convertDateToText('')).toBe('Date invalide');
  });
});

describe('buildMarkedDates', () => {
  const events = [
    { dateevent: '2024-06-15', eventtype: 'balade' },
    { dateevent: '2024-06-15', eventtype: 'concours' },
    { dateevent: '2024-06-20', eventtype: 'soins' },
  ];

  it('creates entries for each unique date', () => {
    const result = buildMarkedDates(events, '2024-06-01', COLORS, false);
    expect(Object.keys(result)).toEqual(expect.arrayContaining(['2024-06-15', '2024-06-20']));
  });

  it('does not add duplicate dots for the same color on the same date', () => {
    const sameColorEvents = [
      { dateevent: '2024-06-15', eventtype: 'balade' },
      { dateevent: '2024-06-15', eventtype: 'balade' },
    ];
    const result = buildMarkedDates(sameColorEvents, '2024-06-01', COLORS, false) as any;
    expect(result['2024-06-15'].dots).toHaveLength(1);
  });

  it('adds multiple dots for different event types on the same date', () => {
    const result = buildMarkedDates(events, '2024-06-01', COLORS, false) as any;
    expect(result['2024-06-15'].dots).toHaveLength(2);
  });

  it('marks selectedDate as selected when isInit is true', () => {
    const result = buildMarkedDates(events, '2024-06-15', COLORS, true) as any;
    expect(result['2024-06-15'].selected).toBe(true);
  });

  it('creates selectedDate entry if not present when isInit is true', () => {
    const result = buildMarkedDates(events, '2024-07-01', COLORS, true) as any;
    expect(result['2024-07-01']).toBeDefined();
    expect(result['2024-07-01'].selected).toBe(true);
    expect(result['2024-07-01'].dots).toHaveLength(0);
  });

  it('does not mark selected when isInit is false', () => {
    const result = buildMarkedDates(events, '2024-06-15', COLORS, false) as any;
    expect(result['2024-06-15'].selected).toBe(false);
  });

  it('returns empty object for empty events list with isInit false', () => {
    const result = buildMarkedDates([], '2024-06-15', COLORS, false);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('returns selected date entry for empty events list with isInit true', () => {
    const result = buildMarkedDates([], '2024-06-15', COLORS, true) as any;
    expect(result['2024-06-15']).toBeDefined();
    expect(result['2024-06-15'].selected).toBe(true);
  });
});
