import type { Animal } from '../../models/Animal';
import type { AnimalWizardFormData } from '../../stores/useAnimalWizardStore';
import type { AnimalHistoryItem, AnimalHistoryPayload, CreateAnimalPayload, UpdateAnimalPayload } from './types';
import { AppErrorCode } from '../../types/AppErrorCode';
import { parseApiError } from '../../utils/errorParser';

const optionalStrings = ['datenaissance', 'datearrivee', 'datedepart', 'datedeces', 'race', 'sexe', 'couleur', 'nompere', 'nommere', 'numeroidentification', 'food', 'unity', 'informations', 'image'] as const;

export function apiDate(value?: string) {
  if (!value) return undefined;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value.slice(0, 10);
}

export function pickerDate(value?: string) {
  const normalized = apiDate(value);
  return normalized && /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : undefined;
}

export function formDateLabel(value?: string) {
  const normalized = pickerDate(value);
  if (!normalized) return undefined;
  const [year, month, day] = normalized.split('-');
  return `${day}/${month}/${year}`;
}

export function animalToWizardForm(animal: Animal): AnimalWizardFormData {
  const form: AnimalWizardFormData = { nom: animal.nom, espece: animal.espece };
  optionalStrings.forEach((key) => {
    const value = animal[key];
    if (value != null) form[key] = key.startsWith('date') ? apiDate(String(value)) : String(value);
  });
  if (animal.poids != null) form.poids = String(animal.poids);
  if (animal.taille != null) form.taille = String(animal.taille);
  if (animal.quantity != null) form.quantity = String(animal.quantity);
  return form;
}

function numberValue(value?: string) {
  if (!value?.trim()) return undefined;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function buildAnimalPayload(form: AnimalWizardFormData): CreateAnimalPayload {
  const payload: CreateAnimalPayload = { nom: form.nom?.trim() ?? '', espece: form.espece?.trim() ?? '' };
  optionalStrings.forEach((key) => {
    const value = form[key]?.trim();
    if (value) Object.assign(payload, { [key]: key.startsWith('date') ? apiDate(value) : value });
  });
  payload.poids = numberValue(form.poids);
  payload.taille = numberValue(form.taille);
  payload.quantity = numberValue(form.quantity);
  return payload;
}

export function buildAnimalUpdatePayload(form: AnimalWizardFormData, id: number): UpdateAnimalPayload {
  return { ...buildAnimalPayload(form), id };
}

export function isAnimalProfileValid(form: AnimalWizardFormData) {
  return Boolean(form.nom?.trim() && form.espece?.trim());
}

export function isAnimalBodyValid(form: AnimalWizardFormData) {
  return ['poids', 'taille', 'quantity'].every((key) => {
    const value = form[key as keyof AnimalWizardFormData];
    return !value || Number.isFinite(Number(value.replace(',', '.')));
  });
}

export function animalFormFingerprint(form: AnimalWizardFormData) {
  return JSON.stringify(Object.keys(form).sort().reduce<Record<string, string>>((result, key) => {
    const value = form[key as keyof AnimalWizardFormData];
    if (value != null && value.trim() !== '') result[key] = value.trim();
    return result;
  }, {}));
}

export function buildChangedAnimalHistory(form: AnimalWizardFormData, animal: Animal, date: string): AnimalHistoryPayload[] {
  const candidates: { item: AnimalHistoryItem; current: string | number | undefined; next: string | undefined; unity?: string }[] = [
    { item: 'poids', current: animal.poids, next: form.poids },
    { item: 'taille', current: animal.taille, next: form.taille },
    { item: 'food', current: animal.food, next: form.food },
    { item: 'quantity', current: animal.quantity, next: form.quantity, unity: form.unity },
  ];
  return candidates.flatMap(({ item, current, next, unity }) => {
    const valueUnchanged = String(current ?? '').replace(',', '.') === next?.trim().replace(',', '.');
    const unitUnchanged = item !== 'quantity' || (animal.unity ?? '') === (unity ?? '');
    if (!next?.trim() || (valueUnchanged && unitUnchanged)) return [];
    const value = item === 'food' ? next.trim() : Number(next.replace(',', '.'));
    if (typeof value === 'number' && !Number.isFinite(value)) return [];
    return [{ idAnimal: animal.id, item, value, unity, datemodification: date }];
  });
}

export function getAnimalSaveError(error: unknown, mode: 'create' | 'edit') {
  const parsed = parseApiError(error);
  if (parsed.code === AppErrorCode.NOT_FOUND) return { title: 'Animal introuvable', message: 'Ce profil n’existe plus. Revenez à la liste puis réessayez.' };
  if (parsed.code === AppErrorCode.NETWORK_ERROR) return { title: 'Connexion interrompue', message: 'Le serveur ne répond pas. Vérifiez votre connexion puis réessayez.' };
  if (parsed.code === AppErrorCode.VALIDATION_ERROR) return { title: 'Informations à vérifier', message: parsed.message };
  if (parsed.code === AppErrorCode.INTERNAL_ERROR) return { title: 'Enregistrement impossible', message: 'Le serveur a rencontré un problème. Vos informations sont conservées.' };
  return { title: mode === 'edit' ? 'Modification impossible' : 'Création impossible', message: parsed.message };
}
