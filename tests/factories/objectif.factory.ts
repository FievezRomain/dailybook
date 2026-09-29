let counter = 1;

export function createMockObjectif(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    title: `Objectif_${id}`,
    datedebut: new Date('2025-01-01'),
    datefin: new Date('2025-12-31'),
    temporalityobjectif: 'Mensuel',
    animaux: [1],
    sousetapes: [
      { id: 1, titre: 'Étape 1', done: true },
      { id: 2, titre: 'Étape 2', done: false },
    ],
    ...overrides,
  };
}

export function resetObjectifCounter() {
  counter = 1;
}
