/**
 * Point d'entree unique pour toutes les variables d'environnement.
 * Aucun autre fichier ne doit acceder directement a process.env.
 *
 * Variables Expo : prefix EXPO_PUBLIC_* obligatoire pour etre accessibles cote client.
 * __DEV__ : global React Native injecte automatiquement (true en Expo Go / dev server, false en build production).
 */

const IS_DEV = __DEV__;

function requiredInProduction(name: string, value: string | undefined): string {
  if (value) {
    return value;
  }

  if (IS_DEV) {
    return '';
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

export const env = {
  IS_DEV,

  // URL de l'API - commute automatiquement dev/prod.
  API_URL: IS_DEV
    ? (process.env.EXPO_PUBLIC_API_URL_DEV ?? 'http://localhost:8080/api/v1')
    : requiredInProduction('EXPO_PUBLIC_API_URL_PROD', process.env.EXPO_PUBLIC_API_URL_PROD),

  // Firebase
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',

  // Sentry - activer uniquement en production via if (!env.IS_DEV)
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',

  // OAuth - Google webClientId requis pour Google Sign-In via Firebase
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
} as const;
