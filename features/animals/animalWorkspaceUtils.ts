import type { Animal } from '../../models/Animal';
import type { Event } from '../../models/Event';

export type AnimalPresence = 'present' | 'history';

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
  return events.filter((event) => event.animaux.includes(animalId) && MEDICAL_EVENT_TYPES.includes(event.eventtype as (typeof MEDICAL_EVENT_TYPES)[number]));
}

export function getAnimalMedicalDocuments(events: readonly Event[], animalId: number) {
  return getAnimalMedicalEvents(events, animalId).flatMap((event) =>
    (event.documents ?? []).map((document) => ({ ...document, eventId: event.id, eventDate: event.dateevent })),
  );
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
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

export type AnimalPicture = { id: string; uri: string };

export function normalizeAnimalPictures(value: unknown): AnimalPicture[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') return undefined;
    const source = item as Record<string, unknown>;
    const uri = source.url ?? source.image ?? source.filename;
    return typeof uri === 'string' ? { id: String(source.id ?? index), uri } : undefined;
  }).filter((item): item is AnimalPicture => Boolean(item));
}
