let counter = 1;

export function createMockUser(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  const uid = `user_${id}`;
  return {
    uid,
    email: `${uid}@example.com`,
    displayName: `User ${id}`,
    roles: ['free'] as string[],
    internal_id: `internal_${uid}`,
    ...overrides,
  };
}

export function createMockPremiumUser(overrides: Record<string, unknown> = {}) {
  return createMockUser({ roles: ['premium'], ...overrides });
}

export function createMockAdminUser(overrides: Record<string, unknown> = {}) {
  return createMockUser({ roles: ['admin', 'premium'], ...overrides });
}

export function resetUserCounter() {
  counter = 1;
}
