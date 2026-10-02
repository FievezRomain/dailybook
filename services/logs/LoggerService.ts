import * as Sentry from '@sentry/react-native';
import { filterLogContext } from './logContext';

type LogContext = Record<string, unknown>;

class LoggerService {
  error(message: string, error: unknown, context?: LogContext): void {
    if (__DEV__) {
      console.error(`[Logger] ${message}`, { error, context });
      return;
    }

    Sentry.withScope((scope) => {
      this.applyContext(scope, context);
      scope.setTag('logger', 'LoggerService');
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
  }

  /**
   * Generic log - alias for warn(), retained for legacy callers that use .log().
   */
  log(message: string, data?: LogContext): void {
    this.warn(message, data);
  }

  warn(message: string, data?: LogContext): void {
    if (__DEV__) {
      console.warn(`[Logger] ${message}`, data);
      return;
    }

    Sentry.withScope((scope) => {
      this.applyContext(scope, data);
      scope.setTag('logger', 'LoggerService');
      Sentry.captureMessage(message, 'warning');
    });
  }

  breadcrumb(category: string, message: string, data?: LogContext): void {
    if (__DEV__) return;

    Sentry.addBreadcrumb({ category, message, data: filterLogContext(data).data, level: 'info' });
  }

  private applyContext(scope: Sentry.Scope, context?: LogContext): void {
    if (!context) return;

    const { tags, data } = filterLogContext(context);
    for (const [key, value] of Object.entries(tags)) scope.setTag(key, value);
    if (Object.keys(data).length > 0) scope.setContext('additional_context', data);
  }
}

export const logger = new LoggerService();
export default logger;
