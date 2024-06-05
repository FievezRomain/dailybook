import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBlTDoMxPgC39JxELJU5sWHH8krmUN6rYA",
    authDomain: "dailybook-be27d.firebaseapp.com",
    projectId: "dailybook-be27d",
    storageBucket: "dailybook-be27d.appspot.com",
    messagingSenderId: "592615799562",
    appId: "1:592615799562:web:dedd6a7fd5d542bfa8d8f3",
    measurementId: "G-CXT4NY9L53"  
};

let app; // Déclarez une variable pour stocker l'instance Firebase
let auth; // Déclarez une variable pour stocker l'instance auth

const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

const getFirebaseAuth = () => {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
  return auth;
};

export { getFirebaseApp, getFirebaseAuth };
