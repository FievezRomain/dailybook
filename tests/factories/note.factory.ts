let counter = 1;

export function createMockNote(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    id,
    titre: `Note_${id}`,
    note: 'Observation du jour',
    is_pinned: false,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: null,
    ...overrides,
  };
}

export function resetNoteCounter() {
  counter = 1;
}
