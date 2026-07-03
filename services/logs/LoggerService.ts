import * as Sentry from '@sentry/react-native';

class LoggerService {
  error(message: string, error: unknown, context?: Record<string, unknown>): void {
    if (__DEV__) {
      console.error(`[Logger] ${message}`, error);
      return;
    }
    Sentry.withScope((scope) => {
      if (context) scope.setContext('additional_context', context);
      scope.setTag('logger', 'LoggerService');
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
  }

  /**
   * Generic log — alias for warn(), retained for legacy callers that use .log().
   */
  log(message: string, data?: Record<string, unknown>): void {
    this.warn(message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (__DEV__) {
      console.warn(`[Logger] ${message}`, data);
      return;
    }
    Sentry.captureMessage(message, { level: 'warning', extra: data });
  }

  breadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    Sentry.addBreadcrumb({ category, message, data, level: 'info' });
  }
}

export const logger = new LoggerService();
export default logger;

