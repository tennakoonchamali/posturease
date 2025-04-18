import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object containing keys and identifiers for the app
const firebaseConfig = {
  apiKey: "AIzaSyBW8bM5tDuyrHgCnbOiAIGCteiF1vXY_-o",
  authDomain: "posturease-9879c.firebaseapp.com",
  projectId: "posturease-9879c",
  storageBucket: "posturease-9879c.firebasestorage.app",
  messagingSenderId: "161244634793",
  appId: "1:161244634793:web:a9cafdc0a048e3703613b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initializes the Firebase application
const auth = getAuth(app); // Sets up Firebase Authentication for the app
const db = getFirestore(app); // Sets up Firestore database for the app

// Exporting the authentication and database objects for use throughout the app
export { auth, db };