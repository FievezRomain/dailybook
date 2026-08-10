import type { Animal } from '../../models/Animal';
import type { Event } from '../../models/Event';
import type { EventWizardFormData } from '../../stores/useEventWizardStore';
import type { CreateEventPayload, UpdateEventPayload } from './types';
import { getEventDetailsConfig } from './eventDetailsConfig';

export const reminderOptions = [
  { id: '30m', label: '30 minutes avant' },
  { id: '1h', label: '1 heure avant' },
  { id: '1d', label: '1 jour avant' },
] as const;

export function getReminderLabel(id?: string) {
  return reminderOptions.find((option) => option.id === id)?.label ?? reminderOptions[0].label;
}

export function getSelectedAnimalNames(ids: readonly number[], animals: readonly Animal[]) {
  return ids.map((id) => animals.find((animal) => animal.id === id)?.nom).filter((name): name is string => Boolean(name));
}

export function buildEventCreationPayload(form: EventWizardFormData): CreateEventPayload {
  const eventtype = form.eventType ?? 'autre';
  const fallbackName = getEventDetailsConfig(eventtype).title;
  const payload: CreateEventPayload = {
    nom: form.nom?.trim() || fallbackName,
    dateevent: form.dateevent ?? '',
    animaux: form.animaux ?? [],
    eventtype,
    state: form.state ?? 'pending',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const stringFields = ['lieu', 'heuredebutevent', 'commentaire', 'traitement', 'datefinsoins', 'specialiste', 'discipline', 'epreuve', 'dossart', 'placement', 'categoriedepense', 'heuredebutbalade', 'datefinbalade', 'heurefinbalade', 'frequencetype', 'frequencevalue', 'rappelnotification'] as const;
  stringFields.forEach((key) => { const value = form[key]; if (typeof value === 'string' && value.trim()) Object.assign(payload, { [key]: value.trim() }); });
  if (form.depense !== undefined && form.depense !== '') { const amount = Number(String(form.depense).replace(',', '.')); if (Number.isFinite(amount)) payload.depense = amount; }
  if (form.notif) { payload.notif = 'JourJ'; payload.optionnotif = getReminderLabel(form.optionnotif); }
  if (form.shared_groups?.length) payload.shared_groups = form.shared_groups;
  if (typeof form.idparent === 'number') payload.idparent = form.idparent;
  return payload;
}

export function buildEventUpdatePayload(form: EventWizardFormData, eventId: number): UpdateEventPayload {
  return { ...buildEventCreationPayload(form), id: eventId };
}

export function eventToWizardForm(event: Event): EventWizardFormData {
  const source = event as Event & Record<string, unknown>;
  const fields = ['nom', 'dateevent', 'animaux', 'lieu', 'heuredebutevent', 'commentaire', 'notif', 'optionnotif', 'shared_groups', 'traitement', 'datefinsoins', 'specialiste', 'discipline', 'note', 'epreuve', 'dossart', 'placement', 'depense', 'categoriedepense', 'heuredebutbalade', 'datefinbalade', 'heurefinbalade', 'state', 'idparent', 'frequencetype', 'frequencevalue', 'rappelnotification'] as const;
  const form: EventWizardFormData = { eventType: event.eventtype };
  fields.forEach((key) => { if (source[key] !== undefined && source[key] !== null) Object.assign(form, { [key]: source[key] }); });
  return form;
}

export function eventToDuplicateWizardForm(event: Event): EventWizardFormData {
  const { state: _state, idparent: _idparent, shared_groups: _sharedGroups, ...copy } = eventToWizardForm(event);
  return { ...copy, nom: event.nom ? `Copie de ${event.nom}` : undefined, state: 'pending' };
}

export function formatEventShareMessage(event: Event, animalNames: readonly string[]) {
  const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${event.dateevent}T12:00:00`));
  const time = event.heuredebutevent ? ` à ${event.heuredebutevent}` : '';
  const animals = animalNames.length ? ` — ${animalNames.join(' et ')}` : '';
  return `${event.nom || event.eventtype} · ${date}${time}${animals}`;
}

export function formatEventCreationSummary(form: EventWizardFormData) {
  if (!form.dateevent) return form.nom ?? getEventDetailsConfig(form.eventType).title;
  const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(`${form.dateevent}T12:00:00`));
  return `${form.nom?.trim() || getEventDetailsConfig(form.eventType).title} · ${date}${form.heuredebutevent ? ` à ${form.heuredebutevent}` : ''}`;
}
