/**
 * Wrapper de chargement dynamique de `@react-native-google-signin/google-signin`.
 *
 * Le module natif n'est PAS bundlé dans Expo Go. Un `require()` direct du package
 * déclenche `TurboModuleRegistry.getEnforcing('RNGoogleSignin')` au top-level,
 * qui logue `ERROR Invariant Violation: ...` dans la console avant de throw.
 *
 * Pour éviter ce log, on sonde d'abord `TurboModuleRegistry.get('RNGoogleSignin')`
 * (variante non-throw). Si le module natif n'est pas enregistré, on ne fait jamais
 * le require — pas de log, pas d'exception.
 *
 *  - Expo Go : Google Sign-In désactivé silencieusement (UI masque le bouton).
 *  - Dev client / EAS build : Google Sign-In pleinement fonctionnel.
 */
import { TurboModuleRegistry } from 'react-native';

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let cached: GoogleSigninModule | null | undefined;

export function getGoogleSigninModule(): GoogleSigninModule | null {
  if (cached !== undefined) return cached;

  // Sonde non-throw : si le TurboModule natif n'est pas enregistré (Expo Go),
  // on n'évalue jamais le package — le require déclencherait un console.error.
  if (TurboModuleRegistry.get('RNGoogleSignin') == null) {
    cached = null;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info('[social-auth] RNGoogleSignin natif absent (Expo Go). Bouton Google masqué.');
    }
    return cached;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    cached = require('@react-native-google-signin/google-signin') as GoogleSigninModule;
  } catch {
    cached = null;
  }
  return cached;
}

export function isGoogleSigninAvailable(): boolean {
  return getGoogleSigninModule() !== null;
}