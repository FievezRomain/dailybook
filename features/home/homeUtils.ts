import type { Animal } from '../../models/Animal';
import type { Event } from '../../models/Event';
import type { Objectif } from '../../models/Objectif';
import type { EventCardType } from '../../shared/components/ui';

const eventTypes: Record<string, EventCardType> = { soins: 'care', rdv: 'appointment', balade: 'walk', entrainement: 'training', concours: 'competition', depense: 'expense', autre: 'other' };

export const HOME_HEADER_SCROLL_THRESHOLD = 8;
export const isHomeHeaderScrolled = (offsetY: number) => offsetY > HOME_HEADER_SCROLL_THRESHOLD;

export function toEventCardType(value: string): EventCardType { return eventTypes[value.trim().toLowerCase()] ?? 'other'; }

export function getFirstName(value?: string | null) { return value?.trim().split(/\s+/)[0] || 'à vous'; }

export function getInitials(value?: string | null) { const parts = value?.trim().split(/\s+/).filter(Boolean) ?? []; return (parts.slice(0, 2).map((part) => part[0]).join('') || 'VA').toUpperCase(); }

export function formatHomeDate(date = new Date()) { const value = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date); return value.charAt(0).toUpperCase() + value.slice(1); }

export function getEventDate(event: Event) { const raw = `${event.dateevent}${event.heuredebutevent ? `T${event.heuredebutevent}` : 'T00:00:00'}`; const date = new Date(raw); return Number.isNaN(date.getTime()) ? new Date(event.dateevent) : date; }

export function splitHomeEvents(events: readonly Event[], now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const upcomingEnd = new Date(start); upcomingEnd.setDate(upcomingEnd.getDate() + 8);
  const visible = [...events].sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());
  return { today: visible.filter((event) => { const date = getEventDate(event); return date < end && (date >= start || !isEventCompleted(event)); }), upcoming: visible.filter((event) => { const date = getEventDate(event); return date >= end && date < upcomingEnd; }) };
}

export function getEventOverdueDays(event: Event, now = new Date()) {
  if (isEventCompleted(event)) return 0;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = getEventDate(event);
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  return Math.max(0, Math.floor((today.getTime() - eventDay.getTime()) / 86_400_000));
}

export function formatEventOverdueLabel(days: number) { return `En retard de ${days} jour${days > 1 ? 's' : ''}`; }

export function getLinkedAnimals(ids: readonly number[], animals: readonly Animal[]) { return ids.map((id) => animals.find((animal) => animal.id === id)).filter((animal): animal is Animal => Boolean(animal)).map((animal) => ({ id: String(animal.id), name: animal.nom, imageUrl: animal.imageUrl })); }

export function getObjectiveProgress(objective: Objectif) { if (!objective.sousetapes.length) return 0; const complete = objective.sousetapes.filter((step) => ['done', 'completed', 'termine', 'terminé', 'true'].includes(String(step.state).toLowerCase())).length; return complete / objective.sousetapes.length; }

export function formatObjectiveEnd(dateValue: Date) { const date = new Date(dateValue); return `Fin · ${new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)}`; }

export function formatObjectivePeriod(startValue: Date, endValue: Date) { const formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }); return `Du ${formatter.format(new Date(startValue))} au ${formatter.format(new Date(endValue))}`; }

export function getDailyTaskProgress(events: readonly Event[]) { const total = events.length; const done = events.filter((event) => ['done', 'completed', 'termine', 'terminé', 'true'].includes(String(event.state).toLowerCase())).length; return { total, done, progress: total ? done / total : 0 }; }

export function isEventCompleted(event: Pick<Event, 'state'>) { return ['done', 'completed', 'termine', 'terminé', 'true'].includes(String(event.state).toLowerCase()); }
