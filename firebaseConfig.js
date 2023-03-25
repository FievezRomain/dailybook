import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlTDoMxPgC39JxELJU5sWHH8krmUN6rYA",
    authDomain: "dailybook-be27d.firebaseapp.com",
    projectId: "dailybook-be27d",
    storageBucket: "dailybook-be27d.appspot.com",
    messagingSenderId: "592615799562",
    appId: "1:592615799562:web:dedd6a7fd5d542bfa8d8f3",
    measurementId: "G-CXT4NY9L53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
