import * as Sentry from '@sentry/react-native';

class LoggerService {
  static log(text: string): void {
    // Sentry.captureMessage(text);
  }
}

export default LoggerService;
