/**
 * Initialise les SDK OAuth (Google) au démarrage de l'app.
 *
 * Doit être appelé une seule fois, le plus tôt possible (dans App.tsx).
 * Aucune action si `GOOGLE_WEB_CLIENT_ID` n'est pas configuré (logs en dev).
 */
import { Platform } from 'react-native';
import { env } from '../../config/env';
import { getGoogleSigninModule } from './googleSigninModule';

let initialized = false;

export function initSocialAuth(): void {
  if (initialized) return;
  initialized = true;

  if (!env.GOOGLE_WEB_CLIENT_ID) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[social-auth] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID manquant — Google Sign-In désactivé');
    }
    return;
  }

  const mod = getGoogleSigninModule();
  if (!mod) {
    // Module natif absent (Expo Go) : skip la configuration, le bouton sera masqué côté UI.
    return;
  }

  mod.GoogleSignin.configure({
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: env.GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: false,
    forceCodeForRefreshToken: Platform.OS === 'android',
  });
}
