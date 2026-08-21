import type { Animal } from '../../models/Animal';
import type { Event } from '../../models/Event';

export type AnimalPresence = 'present' | 'history';

export function isSharedAnimal(animal: Animal) {
  return animal.provenance?.trim().toLocaleLowerCase('fr-FR') === 'group';
}

export function getAnimalPresence(animal: Animal): AnimalPresence {
  return animal.datedepart || animal.datedeces ? 'history' : 'present';
}

export function sortAnimalsForWorkspace(animals: readonly Animal[]): Animal[] {
  return [...animals].sort((left, right) => {
    const leftRank = left.datedeces ? 2 : left.datedepart ? 1 : 0;
    const rightRank = right.datedeces ? 2 : right.datedepart ? 1 : 0;
    return leftRank - rightRank || left.nom.localeCompare(right.nom, 'fr');
  });
}

export function resolveAnimalSelection(animals: readonly Animal[], selectedId?: number): number | undefined {
  if (!animals.length) return undefined;
  if (selectedId != null && animals.some((animal) => animal.id === selectedId)) return selectedId;
  return sortAnimalsForWorkspace(animals)[0]?.id;
}

export const MEDICAL_EVENT_TYPES = ['soins', 'rdv'] as const;

export function getAnimalMedicalEvents(events: readonly Event[], animalId: number) {
  return events.filter((event) => !event.idparent && event.todisplay !== false && event.animaux.includes(animalId) && MEDICAL_EVENT_TYPES.includes(event.eventtype as (typeof MEDICAL_EVENT_TYPES)[number]));
}

export function getAnimalMedicalDocuments(events: readonly Event[], animalId: number) {
  return getAnimalMedicalEvents(events, animalId).flatMap((event) =>
    (event.documents ?? []).map((document) => ({ ...document, eventId: event.id, eventDate: event.dateevent })),
  );
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const french = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const parts = iso ? [Number(iso[1]), Number(iso[2]), Number(iso[3])] : french ? [Number(french[3]), Number(french[2]), Number(french[1])] : undefined;
  if (!parts) return undefined;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined;
}

export function formatAnimalDate(value?: string): string | undefined {
  const date = parseDate(value);
  return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatAnimalAge(value?: string, now = new Date()): string | undefined {
  const birth = parseDate(value);
  if (!birth || birth > now) return undefined;
  let years = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) years -= 1;
  return `${years} an${years > 1 ? 's' : ''}`;
}

export function compactAnimalDetails(animal: Animal): string {
  return [animal.espece, animal.race, formatAnimalAge(animal.datenaissance)].filter(Boolean).join(' · ');
}

export type AnimalPicture = { id: string; uri: string; recordedAt?: string };

export function normalizeAnimalPictures(value: unknown): AnimalPicture[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') return undefined;
    const source = item as Record<string, unknown>;
    const uri = source.url ?? source.image ?? source.filename;
    const recordedAt = source.date_enregistrement ?? source.date;
    return typeof uri === 'string' ? { id: String(source.id ?? index), uri, ...(typeof recordedAt === 'string' ? { recordedAt } : {}) } : undefined;
  }).filter((item): item is AnimalPicture => Boolean(item));
}

export function hasAnimalBodyPictureForMonth(pictures: readonly AnimalPicture[], month = new Date()) {
  const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
  return pictures.some((picture) => picture.recordedAt?.slice(0, 7) === key);
}
