import { filterLoggerEvent, technicalBreadcrumb, technicalLogLabel } from '../../services/logs/logEvent';

describe('LoggerService event privacy', () => {
  it('does not forward arbitrary breadcrumb labels to the native bridge', () => {
    expect(technicalBreadcrumb('private@example.invalid', 'private note')).toEqual({ category: 'application', message: 'application_action' });
    expect(technicalBreadcrumb('events', 'create_started')).toEqual({ category: 'events', message: 'create_started' });
  });
  it('removes raw exception details and request attachments, preserving stack coordinates', () => {
    const event = filterLoggerEvent({
      message: 'private email', logentry: { params: ['private note'] },
      request: { url: 'https://private.invalid' }, extra: { token: 'private' },
      breadcrumbs: [{ message: 'private' }],
      exception: { values: [{ type: 'TypeError', value: 'private',
        mechanism: { type: 'generic', handled: true, data: { secret: 'private' } },
        stacktrace: { frames: [{ filename: 'app:///index.android.bundle?token=private', abs_path: 'https://private@assets.example.invalid/app.js#private',
          lineno: 4, colno: 20, function: 'save', in_app: true, vars: { token: 'private' }, context_line: 'private', module_metadata: { private: true } }] } }] },
    }, 'Note form submit failed');
    expect(JSON.stringify(event)).not.toContain('private');
    expect(event.exception?.values?.[0].stacktrace?.frames?.[0]).toMatchObject({ filename: 'app:///index.android.bundle', lineno: 4, colno: 20, function: 'save' });
    expect(event.exception?.values?.[0].type).toBe('TypeError');
  });
  it('uses fixed fallback labels and does not trust custom exception names', () => {
    expect(technicalLogLabel('Upload failed for private@example.invalid')).toBe('Application operation failed');
    const event = filterLoggerEvent({ exception: { values: [{ type: 'private@example.invalid', value: 'secret' }] } }, 'secret');
    expect(event.exception?.values?.[0]).toMatchObject({ type: 'Error', value: 'Application operation failed' });
    expect(JSON.stringify(event)).not.toContain('secret');
  });
});
