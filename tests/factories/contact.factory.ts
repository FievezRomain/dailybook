let counter = 1;

export function createMockContact(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    nom: `Dupont_${id}`,
    prenom: 'Jean',
    profession: 'Vétérinaire',
    telephone: '0601020304',
    email: `contact_${id}@example.com`,
    emailproprietaire: 'owner@example.com',
    ...overrides,
  };
}

export function resetContactCounter() {
  counter = 1;
}
