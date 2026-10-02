import * as Sentry from '@sentry/react-native';
import type { AuthUser } from './IAuthService';

/** Diagnostic correlation only; never forward email, name, photo or credentials. */
export function setMonitoringIdentity(user: Pick<AuthUser, 'uid'> | null): void {
  Sentry.setUser(user ? { id: user.uid } : null);
}
