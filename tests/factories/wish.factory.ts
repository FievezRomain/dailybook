let counter = 1;

export function createMockWish(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    nom: `Voeu_${id}`,
    description: 'Description du voeu',
    acquis: false,
    priorite: 1,
    ...overrides,
  };
}

export function resetWishCounter() {
  counter = 1;
}
