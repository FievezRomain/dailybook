import type { ErrorEvent } from '@sentry/react-native';
import { filterJavaScriptError } from '../../services/logs/sentryPrivacy';

describe('final JavaScript Sentry error hook', () => {
  it('removes global private context while retaining pseudonymous identity and correlation', () => {
    const event: ErrorEvent = { type: undefined, event_id: 'abc', release: 'vasco@2.0.0', dist: '12',
      message: 'private', user: { id: 'fixture-uid', email: 'private@example.invalid', username: 'private' },
      tags: { feature: 'notes', account: 'private' }, server_name: 'private', transaction: 'private', fingerprint: ['private'],
      contexts: { os: { name: 'iOS', version: '18.1', build: 'private' }, custom: { note: 'private' }, additional_context: { hasTitle: true, note: 'private' },
        trace: { trace_id: 'a'.repeat(32), span_id: 'b'.repeat(16), data: { url: 'private' } } },
      threads: { values: [{ name: 'private' }] },
      exception: { values: [{ type: 'TypeError', value: 'private', stacktrace: { frames: [{ filename: 'index.bundle', lineno: 20, colno: 3 }] } }] },
    };
    const result = filterJavaScriptError(event);
    expect(JSON.stringify(result)).not.toContain('private');
    expect(result).toMatchObject({ release: 'vasco@2.0.0', dist: '12', user: { id: 'fixture-uid' }, tags: { feature: 'notes' },
      contexts: { additional_context: { hasTitle: true }, trace: { trace_id: 'a'.repeat(32), span_id: 'b'.repeat(16) } } });
    expect(result.exception?.values?.[0].stacktrace?.frames?.[0]).toMatchObject({ filename: 'index.bundle', lineno: 20, colno: 3 });
    expect(result.contexts?.os).toEqual({ name: 'iOS', version: '18.1' });
    expect(event.message).toBe('private');
  });
  it('handles empty scopes and rejects arbitrary correlation strings', () => {
    expect(filterJavaScriptError({ type: undefined }).user).toBeUndefined();
    expect(filterJavaScriptError({ type: undefined, contexts: { trace: { trace_id: 'private', span_id: 'private' } } }).contexts?.trace).toBeUndefined();
  });
});
