import { canContinueEventDetails, getEventDetailsConfig } from '../../../features/events/eventDetailsConfig';

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
    expect(getEventDetailsConfig('unknown').title).toBe('Autre');
  });
});
