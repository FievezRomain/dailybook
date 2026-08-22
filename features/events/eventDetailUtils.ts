import type { Event } from '../../models/Event';
import { EXPENSE_CATEGORY_LIST } from './constants';
import { getEventDetailsConfig } from './eventDetailsConfig';
import { getRecurrenceLabel } from './eventCreationUtils';

export interface EventDetailRow {
  label: string;
  value: string;
}

type EventValues = Event & Record<string, unknown>;

export function getEventDetailRows(event: Event, animalNames: readonly string[]): EventDetailRow[] {
  const source = event as EventValues;
  const formKeys = new Set(getEventDetailsConfig(event.eventtype).fields.map((field) => field.key));
  const supports = (key: string) => formKeys.has(key);
  const rows: EventDetailRow[] = [];
  const add = (label: string, value: unknown, formatter: (value: unknown) => string = (item) => String(item)) => {
    if (value === undefined || value === null || value === '') return;
    rows.push({ label, value: formatter(value) });
  };

  add('Type', getEventDetailsConfig(event.eventtype).title);
  add('État', event.state, formatState);
  add('Date et heure', event.dateevent, () => formatDateAndTime(event.dateevent, event.heuredebutevent));
  if (animalNames.length) add('Animaux', animalNames.join(' et '));
  if (supports('lieu')) add('Lieu', event.lieu);
  if (supports('specialiste')) add('Spécialiste', source.specialiste);
  if (supports('traitement')) add('Traitement', source.traitement);
  if (supports('datefinsoins')) add('Fin du traitement', source.datefinsoins, formatDate);
  if (supports('datefinbalade') || supports('heurefinbalade')) {
    if (source.datefinbalade || source.heurefinbalade) rows.push({ label: 'Fin de la balade', value: formatOptionalDateAndTime(source.datefinbalade, source.heurefinbalade) });
  }
  if (supports('discipline')) add('Discipline', source.discipline);
  if (supports('epreuve')) add('Épreuve', source.epreuve);
  if (supports('dossart')) add('Dossard', source.dossart);
  if (supports('placement')) add('Classement', source.placement);
  if (supports('note')) add('Note', source.note, formatRating);
  if (supports('depense')) add('Dépense', event.depense, formatExpense);
  if (supports('categoriedepense')) add('Catégorie de dépense', source.categoriedepense, formatExpenseCategory);
  if (event.frequencevalue && event.frequencevalue !== 'none') add('Répétition', event.frequencevalue, getRecurrenceLabel);
  add('Rappel', event.optionnotif ?? event.optionnotification ?? event.notif);
  add('Rappel annuel', event.rappelnotification, formatAnnualReminder);
  if ((event.eventtype === 'soins' || event.eventtype === 'rdv') && event.todisplay !== undefined) add('Dossier médical', event.todisplay, formatMedicalVisibility);
  if (event.shared_groups?.length) add('Partagé avec', event.shared_groups, formatSharedGroups);
  if (event.documents?.length) add('Documents', event.documents, formatDocuments);
  add('Créé par', event.created_by, formatUserReference);
  add('Réalisé par', event.made_by, formatUserReference);
  add('Description', event.commentaire);
  return rows;
}

function formatDate(value: unknown) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`));
}

function formatTime(value: unknown) {
  return String(value).replace(':', ' h ');
}

function formatDateAndTime(date: string, time?: string) {
  return `${formatDate(date)}${time ? ` · ${formatTime(time)}` : ''}`;
}

function formatOptionalDateAndTime(date: unknown, time: unknown) {
  const dateLabel = date ? formatDate(date) : '';
  const timeLabel = time ? formatTime(time) : '';
  return [dateLabel, timeLabel].filter(Boolean).join(' · ');
}

function formatState(value: unknown) {
  return ['completed', 'Terminé', 'Terminée'].includes(String(value)) ? 'Terminé' : 'À faire';
}

function formatRating(value: unknown) {
  const rating = Math.max(1, Math.min(5, Number(value)));
  return `${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))} · ${rating}/5`;
}

function formatExpense(value: unknown) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value));
}

function formatExpenseCategory(value: unknown) {
  return EXPENSE_CATEGORY_LIST.find((category) => category.id === value)?.title ?? String(value);
}

function formatAnnualReminder(value: unknown) {
  return String(value).toLowerCase() === 'annee' ? 'Dans un an' : String(value);
}

function formatMedicalVisibility(value: unknown) {
  return value ? 'Affiché dans le dossier médical' : 'Masqué du dossier médical';
}

function formatSharedGroups(value: unknown) {
  const groups = value as Event['shared_groups'];
  const names = (groups ?? []).flatMap((group) => typeof group === 'object' && group.name ? [group.name] : []);
  return names.length === groups?.length ? names.join(', ') : `${groups?.length ?? 0} groupe${(groups?.length ?? 0) > 1 ? 's' : ''}`;
}

function formatDocuments(value: unknown) {
  return (value as Event['documents'] ?? []).map((document) => document.name).join(', ');
}

function formatUserReference(value: unknown) {
  if (!value || typeof value !== 'object') return '';
  const user = value as { name?: string; email?: string };
  return user.name?.trim() || user.email?.trim() || '';
}
