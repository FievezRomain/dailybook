let counter = 1;

export function createMockNote(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    titre: `Note_${id}`,
    note: 'Observation du jour',
    date_creation: '2025-01-15',
    ...overrides,
  };
}

export function resetNoteCounter() {
  counter = 1;
}
