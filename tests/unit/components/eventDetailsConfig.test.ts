import { canContinueEventDetails, getEventDetailsConfig, getEventQuickFieldKeys } from '../../../features/events/eventDetailsConfig';

describe('event details configuration', () => {
  it('requires a title for care events', () => {
    expect(canContinueEventDetails('soins', '', '2026-08-09')).toBe(false);
    expect(canContinueEventDetails('soins', 'Vaccin', '2026-08-09')).toBe(true);
  });

  it('only requires a date for optional-title event types', () => {
    expect(canContinueEventDetails('rdv', '', '2026-08-09')).toBe(true);
    expect(canContinueEventDetails('rdv', 'Visite', undefined)).toBe(false);
  });

  it('exposes type-specific fields and safely falls back to other', () => {
    expect(getEventDetailsConfig('depense').fields.map((field) => field.key)).toEqual(['depense', 'categoriedepense']);
    expect(getEventDetailsConfig('concours').fields.map((field) => field.key)).toEqual(['discipline', 'epreuve', 'dossart', 'placement', 'note', 'depense']);
    expect(getEventDetailsConfig('balade').fields).toContainEqual(expect.objectContaining({ key: 'note', kind: 'rating' }));
    expect(getEventDetailsConfig('entrainement').fields).toContainEqual(expect.objectContaining({ key: 'note', kind: 'rating' }));
    expect(getEventDetailsConfig('concours').fields).toContainEqual(expect.objectContaining({ key: 'note', kind: 'rating' }));
    expect(getEventDetailsConfig('soins').fields).toContainEqual(expect.objectContaining({ key: 'datefinsoins', kind: 'date' }));
    expect(getEventDetailsConfig('balade').fields).toContainEqual(expect.objectContaining({ key: 'heurefinbalade', kind: 'time' }));
    expect(getEventDetailsConfig('unknown').title).toBe('Autre');
  });

  it.each(['soins', 'rdv', 'balade', 'entrainement', 'concours', 'depense', 'autre'])('offers an expense field for %s events', (eventType) => {
    expect(getEventDetailsConfig(eventType).fields.filter((field) => field.key === 'depense')).toHaveLength(1);
  });

  it.each([
    ['soins', ['depense']],
    ['rdv', ['depense']],
    ['balade', ['note', 'depense']],
    ['entrainement', ['note', 'depense']],
    ['concours', ['placement', 'note', 'depense']],
    ['depense', ['depense']],
    ['autre', ['depense']],
  ])('exposes only quick fields available in the %s form', (eventType, expected) => {
    expect(getEventQuickFieldKeys(eventType as string)).toEqual(expected);
  });
});
