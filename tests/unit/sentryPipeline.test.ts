import { BrowserClient, defaultStackParser } from '@sentry/browser';
import { Scope, type Envelope } from '@sentry/core';
import { filterJavaScriptError } from '../../services/logs/sentryPrivacy';

describe('Sentry JavaScript event pipeline without network', () => {
  it('filters the serialized envelope while retaining the real parsed stack', async () => {
    const envelopes: Envelope[] = [];
    const client = new BrowserClient({
      dsn: 'https://fixture@example.invalid/1', integrations: [],
      stackParser: defaultStackParser, beforeSend: filterJavaScriptError,
      release: 'vasco@test-candidate', sendClientReports: false,
      transport: () => ({
        send: async envelope => { envelopes.push(envelope); return { statusCode: 200 }; },
        flush: async () => true,
      }),
    });
    try {
      const scope = new Scope();
      scope.setClient(client);
      scope.setUser({ id: 'fixture-account', email: 'PRIVATE_MARKER@example.invalid' });
      scope.setExtra('token', 'PRIVATE_MARKER');
      scope.setContext('form', { note: 'PRIVATE_MARKER' });
      scope.setTag('feature', 'notes');
      scope.addBreadcrumb({ category: 'http', message: 'PRIVATE_MARKER', data: { url: 'https://example.invalid/?token=PRIVATE_MARKER' } });
      scope.captureException(new TypeError('PRIVATE_MARKER'));
      expect(await client.flush(2000)).toBe(true);
      expect(envelopes).toHaveLength(1);
      const serialized = JSON.stringify(envelopes);
      expect(serialized).not.toContain('PRIVATE_MARKER');
      expect(serialized).toContain('fixture-account');
      expect(serialized).toContain('vasco@test-candidate');
      expect(serialized).toContain('TypeError');
      expect(serialized).toContain('sentryPipeline.test.ts');
      expect(serialized).toContain('"frames":[');
    } finally {
      await client.close(2000);
    }
  });
});
