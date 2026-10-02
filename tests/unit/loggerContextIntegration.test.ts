const mockScope = { setTag: jest.fn(), setContext: jest.fn(), addEventProcessor: jest.fn() };
jest.mock('@sentry/react-native', () => ({
  withScope: (callback: (scope: typeof mockScope) => void) => callback(mockScope),
  captureMessage: jest.fn(), captureException: jest.fn(), addBreadcrumb: jest.fn(),
}));
import * as Sentry from '@sentry/react-native';

// The explicit extension bypasses the application's global LoggerService mock.
const { logger } = jest.requireActual<typeof import('../../services/logs/LoggerService')>('../../services/logs/LoggerService.ts');

describe('LoggerService context boundary', () => {
  beforeEach(() => { jest.clearAllMocks(); Object.defineProperty(globalThis, '__DEV__', { value: false, configurable: true }); });
  afterEach(() => { Reflect.deleteProperty(globalThis, '__DEV__'); });
  it('uses filtered scope context for errors and warning aliases', () => {
    const context = { feature: 'notes', operation: 'create', hasTitle: true, note: 'private content', email: 'private@example.invalid' };
    logger.error('static label', new Error('fixture'), context);
    logger.log('static label', context);
    expect(mockScope.setContext).toHaveBeenCalledTimes(2);
    expect(mockScope.setContext).toHaveBeenNthCalledWith(1, 'additional_context', { hasTitle: true });
    expect(mockScope.setContext).toHaveBeenNthCalledWith(2, 'additional_context', { hasTitle: true });
    expect(mockScope.setTag).toHaveBeenCalledWith('feature', 'notes');
    expect(mockScope.addEventProcessor).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(mockScope.setContext.mock.calls)).not.toContain('private');
  });
  it('filters breadcrumb data through the same policy', () => {
    logger.breadcrumb('events', 'create_started', { hasAnimals: false, token: 'secret', animals: [{ name: 'private' }] });
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({ category: 'events', message: 'create_started', data: { hasAnimals: false }, level: 'info' });
  });
});
