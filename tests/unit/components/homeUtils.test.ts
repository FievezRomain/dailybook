import { formatEventOverdueLabel, formatHomeDate, getEventOverdueDays, getFirstName, getInitials, isEventCompleted, isHomeHeaderScrolled, splitHomeEvents, toEventCardType } from '../../../features/home/homeUtils';
import type { Event } from '../../../models/Event';

const event = (id: number, dateevent: string): Event => ({ id, nom: `Event ${id}`, dateevent, animaux: [], eventtype: 'soins' });

describe('homeUtils', () => {
  it('sépare aujourd’hui des prochains jours', () => { const result = splitHomeEvents([event(1, '2026-08-09'), event(2, '2026-08-10')], new Date('2026-08-09T12:00:00')); expect(result.today.map(({ id }) => id)).toEqual([1]); expect(result.upcoming.map(({ id }) => id)).toEqual([2]); });
  it('inclut les événements passés non terminés dans Aujourd’hui', () => { const pending = event(1, '2026-08-06'); const completed = { ...event(2, '2026-08-07'), state: 'completed' }; const today = event(3, '2026-08-09'); const result = splitHomeEvents([pending, completed, today], new Date('2026-08-09T12:00:00')); expect(result.today.map(({ id }) => id)).toEqual([1, 3]); });
  it('calcule un retard en jours calendaires uniquement pour un événement ouvert', () => { expect(getEventOverdueDays(event(1, '2026-08-06'), new Date('2026-08-09T23:00:00'))).toBe(3); expect(getEventOverdueDays({ ...event(2, '2026-08-06'), state: 'completed' }, new Date('2026-08-09T12:00:00'))).toBe(0); expect(formatEventOverdueLabel(1)).toBe('En retard de 1 jour'); expect(formatEventOverdueLabel(3)).toBe('En retard de 3 jours'); });
  it('normalise le prénom et les initiales', () => { expect(getFirstName('Camille Martin')).toBe('Camille'); expect(getInitials('Camille Martin')).toBe('CM'); });
  it('retombe sur le type autre pour une valeur inconnue', () => expect(toEventCardType('inconnu')).toBe('other'));
  it('formate la date du résumé', () => expect(formatHomeDate(new Date('2026-08-09T12:00:00'))).toBe('Dimanche 9 août'));
  it('active la variante de top bar uniquement après le seuil de scroll', () => { expect(isHomeHeaderScrolled(8)).toBe(false); expect(isHomeHeaderScrolled(9)).toBe(true); });
  it('reconnaît les états terminés modernes et historiques', () => { expect(isEventCompleted({ state: 'completed' })).toBe(true); expect(isEventCompleted({ state: 'Terminé' })).toBe(true); expect(isEventCompleted({ state: 'pending' })).toBe(false); });
});
