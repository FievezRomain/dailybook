import { CalendarFilter } from '../../../features/events/models/CalendarFilter';
import type { Event } from '../../../models/Event';

const makeEvent = (overrides: Partial<Event> = {}): Event =>
  ({
    id: 1,
    nom: 'Test event',
    dateevent: '2024-06-15',
    animaux: [1],
    eventtype: 'balade',
    ...overrides,
  } as unknown as Event);

describe('CalendarFilter.filter', () => {
  const events = [
    makeEvent({ id: 1, dateevent: '2024-06-15', animaux: [1], eventtype: 'balade', nom: 'Balade en forêt' }),
    makeEvent({ id: 2, dateevent: '2024-06-20', animaux: [2], eventtype: 'concours', nom: 'Grand concours' }),
    makeEvent({ id: 3, dateevent: '2024-06-10', animaux: [1, 2], eventtype: 'soins', nom: 'Soins vétérinaire' }),
  ];

  it('returns all events with no filters', () => {
    const filter = new CalendarFilter();
    expect(filter.filter(events)).toHaveLength(3);
  });

  it('filters by date', () => {
    const filter = new CalendarFilter(new Date('2024-06-15'));
    const result = filter.filter(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('filters by animal', () => {
    const filter = new CalendarFilter(undefined, [2]);
    const result = filter.filter(events);
    expect(result.map((e) => e.id)).toEqual(expect.arrayContaining([2, 3]));
    expect(result).toHaveLength(2);
  });

  it('filters by multiple animals (OR)', () => {
    const filter = new CalendarFilter(undefined, [1, 2]);
    expect(filter.filter(events)).toHaveLength(3);
  });

  it('filters by eventType', () => {
    const filter = new CalendarFilter(undefined, undefined, [{ id: 'balade', title: 'Balade' }]);
    const result = filter.filter(events);
    expect(result).toHaveLength(1);
    expect(result[0].eventtype).toBe('balade');
  });

  it('filters by text (case-insensitive)', () => {
    const filter = new CalendarFilter(undefined, undefined, undefined, 'GRAND');
    const result = filter.filter(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('filters by text with diacritics', () => {
    const filter = new CalendarFilter(undefined, undefined, undefined, 'foret');
    const result = filter.filter(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('returns empty array when no events match', () => {
    const filter = new CalendarFilter(undefined, undefined, undefined, 'inexistant');
    expect(filter.filter(events)).toHaveLength(0);
  });

  it('sorts descending by date', () => {
    const filter = new CalendarFilter();
    const result = filter.filter(events);
    const dates = result.map((e) => e.dateevent);
    expect(dates).toEqual(['2024-06-20', '2024-06-15', '2024-06-10']);
  });

  it('returns empty array for empty input', () => {
    const filter = new CalendarFilter();
    expect(filter.filter([])).toHaveLength(0);
  });
});
