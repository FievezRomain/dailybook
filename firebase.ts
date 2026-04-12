import { initializeApp, FirebaseApp } from 'firebase/app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – getReactNativePersistence is available at runtime in RN but missing from TS types
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from './config/env';

const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

const getFirebaseAuth = (): Auth => {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
  return auth;
};

export { getFirebaseApp, getFirebaseAuth };
