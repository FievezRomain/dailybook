import { filterLogContext } from '../../services/logs/logContext';

describe('technical log context', () => {
  it('preserves useful bounded diagnostics without private extras', () => {
    const result = filterLogContext({ feature: 'notes', operation: 'create', hasTitle: true, step: 2,
      errorCode: 'NETWORK_ERROR', email: 'private@example.invalid', note: 'private content',
      request: { headers: { authorization: 'secret' } }, url: 'https://example.invalid/?signature=secret',
      screen: 'private route', userId: 'private-id' });
    expect(result).toEqual({ tags: { feature: 'notes', operation: 'create' }, data: { hasTitle: true, step: 2, errorCode: 'NETWORK_ERROR' } });
  });
  it('does not trust even known keys with arbitrary string or nested values', () => {
    expect(filterLogContext({ feature: 'private name', operation: 'token', app_mode: 'email@example.invalid',
      hasEmail: 'private@example.invalid', hasTitle: {}, errorCode: 'private detail', step: Infinity,
      memberCount: -1, selectedAnimalCount: 1.5 })).toEqual({ tags: {}, data: {} });
  });
  it('reads only own data properties without invoking getters', () => {
    const input = Object.create({ feature: 'notes' }) as Record<string, unknown>;
    Object.defineProperty(input, 'operation', { get: () => { throw new Error('Getter must not run'); } });
    expect(filterLogContext(input)).toEqual({ tags: {}, data: {} });
  });
  it('retains explicit false and zero without changing the caller object', () => {
    const input = Object.freeze({ hasAnimals: false, step: 0, memberCount: 10001 });
    expect(filterLogContext(input).data).toEqual({ hasAnimals: false, step: 0 });
    expect(filterLogContext()).toEqual({ tags: {}, data: {} });
  });
});
