import { formatHomeDate, getFirstName, getInitials, isHomeHeaderScrolled, splitHomeEvents, toEventCardType } from '../../../features/home/homeUtils';
import type { Event } from '../../../models/Event';

const event = (id: number, dateevent: string): Event => ({ id, nom: `Event ${id}`, dateevent, animaux: [], eventtype: 'soins' });

describe('homeUtils', () => {
  it('sépare aujourd’hui des prochains jours', () => { const result = splitHomeEvents([event(1, '2026-08-09'), event(2, '2026-08-10')], new Date('2026-08-09T12:00:00')); expect(result.today.map(({ id }) => id)).toEqual([1]); expect(result.upcoming.map(({ id }) => id)).toEqual([2]); });
  it('normalise le prénom et les initiales', () => { expect(getFirstName('Camille Martin')).toBe('Camille'); expect(getInitials('Camille Martin')).toBe('CM'); });
  it('retombe sur le type autre pour une valeur inconnue', () => expect(toEventCardType('inconnu')).toBe('other'));
  it('formate la date du résumé', () => expect(formatHomeDate(new Date('2026-08-09T12:00:00'))).toBe('Dimanche 9 août'));
  it('active la variante de top bar uniquement après le seuil de scroll', () => { expect(isHomeHeaderScrolled(8)).toBe(false); expect(isHomeHeaderScrolled(9)).toBe(true); });
});
