import type { Event } from '../../models/Event';
import type { AgendaHighlight } from './types';
import type { VascoColors } from '../../theme/semantic';
import { toEventCardType } from '../home/homeUtils';

const EVENT_TYPE_ALIASES: Record<string, string> = {
  appointment: 'rdv',
  'rendez-vous': 'rdv',
  rendezvous: 'rdv',
  soin: 'soins',
  care: 'soins',
  walk: 'balade',
  training: 'entrainement',
  entraînement: 'entrainement',
  competition: 'concours',
  expense: 'depense',
  dépense: 'depense',
  other: 'autre',
};

export const agendaEventTypeOptions = [
  { id: '__all', label: 'Tous les types' },
  { id: 'balade', label: 'Balade' },
  { id: 'entrainement', label: 'Entraînement' },
  { id: 'concours', label: 'Concours' },
  { id: 'rdv', label: 'Rendez-vous' },
  { id: 'soins', label: 'Soins' },
  { id: 'depense', label: 'Dépense' },
  { id: 'autre', label: 'Autre' },
] as const;

export function canonicalEventType(value: string) {
  const normalized = value.trim().toLocaleLowerCase('fr-FR');
  return EVENT_TYPE_ALIASES[normalized] ?? normalized;
}

export function filterAgendaEvents(events: readonly Event[], date: string, query: string, selectedTypes: readonly string[]) {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-FR');
  const globalFilterActive = Boolean(normalizedQuery || selectedTypes.length);
  const source = globalFilterActive ? events.filter((event) => event.todisplay !== false) : eventsForDate(events, date);
  return source
    .filter((event) => !selectedTypes.length || selectedTypes.includes(canonicalEventType(event.eventtype)))
    .filter((event) => !normalizedQuery || [event.nom, canonicalEventType(event.eventtype), event.commentaire]
      .some((value) => value?.toLocaleLowerCase('fr-FR').includes(normalizedQuery)))
    .sort((a, b) => a.dateevent.localeCompare(b.dateevent) || (a.heuredebutevent ?? '').localeCompare(b.heuredebutevent ?? ''));
}

export function groupAgendaHighlights(highlights: readonly AgendaHighlight[]) {
  return highlights.reduce<Record<string, AgendaHighlight[]>>((byDate, highlight) => {
    (byDate[highlight.date] ??= []).push(highlight);
    return byDate;
  }, {});
}

export function dateKey(date: Date) { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; }
export function eventsForDate(events: readonly Event[], date: string) { return events.filter((event) => event.dateevent.slice(0, 10) === date && event.todisplay !== false).sort((a, b) => (a.heuredebutevent ?? '').localeCompare(b.heuredebutevent ?? '')); }
export function formatAgendaMonth(date: string) { const label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`)); return label.charAt(0).toUpperCase() + label.slice(1); }
export function formatAgendaDay(date: string, full = true) { return new Intl.DateTimeFormat('fr-FR', full ? { weekday: 'long', day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`)); }
export function formatAgendaEmptyMessage(date: string) { return `Rien de prévu pour le ${formatAgendaDay(date).toLocaleLowerCase('fr-FR')}.`; }
export function buildAgendaMarks(events: readonly Event[], colors: VascoColors) { const byDate: Record<string, { dots: { key: string; color: string }[] }> = {}; const tone: Record<ReturnType<typeof toEventCardType>, string> = { care: colors.eventSoins, appointment: colors.eventRdv, walk: colors.eventBalade, training: colors.eventEntrainement, competition: colors.eventConcours, expense: colors.eventDepense, other: colors.eventAutre }; for (const event of events) { const key = event.dateevent.slice(0, 10); const type = toEventCardType(event.eventtype); const dots = byDate[key]?.dots ?? []; if (!dots.some((dot) => dot.key === type)) dots.push({ key: type, color: tone[type] }); byDate[key] = { dots: dots.slice(0, 3) }; } return byDate; }
