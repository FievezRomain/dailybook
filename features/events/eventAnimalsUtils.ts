import type { Animal } from '../../models/Animal';

export function toggleEventAnimal(selectedIds: readonly number[], animalId: number) {
  return selectedIds.includes(animalId) ? selectedIds.filter((id) => id !== animalId) : [...selectedIds, animalId];
}

export function formatAnimalAge(dateOfBirth?: string, now = new Date()) {
  if (!dateOfBirth) return undefined;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return undefined;
  let years = now.getFullYear() - birth.getFullYear();
  const beforeBirthday = now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) years -= 1;
  return years >= 0 ? `${years} an${years > 1 ? 's' : ''}` : undefined;
}

export function getAnimalSelectionSubtitle(animal: Animal, now = new Date()) {
  return [animal.espece, formatAnimalAge(animal.datenaissance, now)].filter(Boolean).join(' · ');
}

export function getAnimalSelectionCta(count: number) {
  if (count === 0) return 'Continuer';
  return `Continuer avec ${count} ${count > 1 ? 'animaux' : 'animal'}`;
}
