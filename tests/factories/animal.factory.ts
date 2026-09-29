import type { Animal } from '../../models/Animal';

let counter = 1;

export function createMockAnimal(overrides: Partial<Animal> = {}): Animal {
  const id = counter++;
  return {
    id,
    nom: `Cheval_${id}`,
    espece: 'Cheval',
    race: 'Selle Français',
    sexe: 'Hongre',
    couleur: 'Isabelle',
    datenaissance: '2018-04-01',
    poids: 500,
    taille: 164,
    ...overrides,
  };
}

export function resetAnimalCounter() {
  counter = 1;
}
