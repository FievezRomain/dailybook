import { agendaEventTypeOptions, canonicalEventType, eventsForDate, filterAgendaEvents, formatAgendaDay, formatAgendaEmptyMessage, formatAgendaMonth, groupAgendaHighlights } from '../../../features/events/agendaUtils';
import { tabs } from '../../../features/home/mainTabs';
import type { Event } from '../../../models/Event';
const event = (id: number, dateevent: string, time: string): Event => ({ id, nom: `E${id}`, dateevent, heuredebutevent: time, animaux: [], eventtype: 'soins' });
describe('agendaUtils', () => { it('filtre et trie une journée', () => expect(eventsForDate([event(2, '2026-08-09', '11:00'), event(1, '2026-08-09', '09:00'), event(3, '2026-08-10', '08:00')], '2026-08-09').map(({ id }) => id)).toEqual([1, 2])); it('formate le mois, le jour et l’état vide en français', () => { expect(formatAgendaMonth('2026-08-09')).toBe('Août 2026'); expect(formatAgendaDay('2026-08-09')).toBe('Dimanche 9 août'); expect(formatAgendaEmptyMessage('2026-08-09')).toBe('Rien de prévu pour le dimanche 9 août.'); }); it('conserve l’ordre Figma de la navigation principale', () => { expect(tabs.map(({ id }) => id)).toEqual(['home', 'tracking', 'agenda', 'animals', 'more']); }); });

it('conserve dans l’agenda un événement masqué de l’historique santé', () => {
  expect(eventsForDate([{ ...event(4, '2026-08-09', '10:00'), todisplay: false }], '2026-08-09').map(({ id }) => id)).toEqual([4]);
});

it('recherche sur tous les événements sans tenir compte de la date sélectionnée', () => {
  const events = [event(1, '2026-08-09', '09:00'), { ...event(2, '2026-08-10', '08:00'), nom: 'Vaccin annuel' }];
  expect(filterAgendaEvents(events, '2026-08-09', 'vaccin', []).map(({ id }) => id)).toEqual([2]);
});

it('filtre par type sur tous les événements sans tenir compte de la date sélectionnée', () => {
  const events: Event[] = [event(1, '2026-08-09', '09:00'), { ...event(2, '2026-08-10', '08:00'), eventtype: 'rdv' }];
  expect(filterAgendaEvents(events, '2026-08-09', '', ['rdv']).map(({ id }) => id)).toEqual([2]);
});

it('combine les filtres animal, type et recherche', () => {
  const events: Event[] = [
    { ...event(1, '2026-08-09', '09:00'), animaux: [1], eventtype: 'soins', nom: 'Cure' },
    { ...event(2, '2026-08-10', '08:00'), animaux: [2], eventtype: 'rdv', nom: 'Vaccin annuel' },
  ];
  expect(filterAgendaEvents(events, '2026-08-09', 'vaccin', ['rdv'], [2]).map(({ id }) => id)).toEqual([2]);
  expect(filterAgendaEvents(events, '2026-08-09', '', [], [1]).map(({ id }) => id)).toEqual([1]);
});

it('canonise et déduplique les types présentés par le filtre', () => {
  expect(canonicalEventType('Rdv')).toBe('rdv');
  expect(canonicalEventType('other')).toBe('autre');
  expect(agendaEventTypeOptions.filter(({ label }) => label === 'Autre')).toHaveLength(1);
  expect(agendaEventTypeOptions.find(({ id }) => id === 'rdv')?.label).toBe('Rendez-vous médical');
});

it('regroupe les événements marquants fournis par le backend par date', () => {
  const highlights = groupAgendaHighlights([
    { id: 'birthday-1', date: '2026-08-12', kind: 'animal_birthday', title: 'Anniversaire de Milo', animal_ids: [1] },
    { id: 'reminder-2', date: '2026-08-12', kind: 'annual_reminder', title: 'Il y a un an : Vaccin', animal_ids: [1], source_event_id: 2 },
  ]);
  expect(highlights['2026-08-12'].map(({ id }) => id)).toEqual(['birthday-1', 'reminder-2']);
});
