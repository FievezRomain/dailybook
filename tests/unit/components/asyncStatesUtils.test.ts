import { resolveAsyncState } from '../../../shared/components/ui/patterns/asyncStatesUtils';

describe('async state resolution', () => {
  it('keeps existing data visible during refresh or refresh error', () => {
    expect(resolveAsyncState({ loading: true, error: false, hasData: true })).toBe('success');
    expect(resolveAsyncState({ loading: false, error: true, hasData: true })).toBe('success');
  });
  it('resolves blocking states without data', () => {
    expect(resolveAsyncState({ loading: true, error: false, hasData: false })).toBe('loading');
    expect(resolveAsyncState({ loading: false, error: true, hasData: false })).toBe('error');
    expect(resolveAsyncState({ loading: false, error: false, hasData: false })).toBe('empty');
  });
});
