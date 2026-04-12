/**
 * Point d'entrée unique pour toutes les variables d'environnement.
 * Aucun autre fichier ne doit accéder directement à process.env.
 *
 * Variables Expo : prefix EXPO_PUBLIC_* obligatoire pour être accessibles côté client.
 * __DEV__ : global React Native injecté automatiquement (true en Expo Go / dev server, false en build production).
 */

const IS_DEV = __DEV__;

export const env = {
  IS_DEV,

  // URL de l'API — commute automatiquement dev/prod
  API_URL: IS_DEV
    ? (process.env.EXPO_PUBLIC_API_URL_DEV ?? 'http://192.168.1.21:8080/api/v1')
    : (process.env.EXPO_PUBLIC_API_URL_PROD ?? 'https://vasco-planner.fr/api/v1'),

  // Firebase
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',

  // Sentry — activer uniquement en production via if (!env.IS_DEV)
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
} as const;
