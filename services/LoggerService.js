import * as Sentry from '@sentry/react-native';

class LoggerService {

    static log ( text ) {
        Sentry.captureMessage( text );
    }
}

export default LoggerService;