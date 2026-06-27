// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Import Firebase Authentication and GoogleAuthProvider
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize GoogleAuthProvider
export const googleProvider = new GoogleAuthProvider();
// Add scopes for Google Drive and Sheets API to allow saving schedules to the user's Google Drive
// Сommented out because we are now using the Google Identity Services (GIS) library for OAuth2 token management, which handles scopes differently. The GIS library is used in the getGoogleAccessToken function in src/services/googleAuth.js.
// googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
// googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
// Export Firestore instance for use in other parts of the application
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);