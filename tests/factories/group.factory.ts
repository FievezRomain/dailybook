let counter = 1;

export function createMockGroup(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    nom: `Groupe_${id}`,
    description: 'Description du groupe',
    members: [],
    animals: [],
    role: 'admin',
    ...overrides,
  };
}

export function resetGroupCounter() {
  counter = 1;
}
