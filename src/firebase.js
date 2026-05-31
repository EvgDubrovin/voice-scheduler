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
  apiKey: "AIzaSyD22Sx8OLYEz0YUWjI6xNksmnQHtQbPNRI",
  authDomain: "voice-scheduler-988c4.firebaseapp.com",
  projectId: "voice-scheduler-988c4",
  storageBucket: "voice-scheduler-988c4.firebasestorage.app",
  messagingSenderId: "616021115542",
  appId: "1:616021115542:web:4db46c56e1c36a32ea38b7",
  measurementId: "G-6WRT3MGCH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize GoogleAuthProvider
export const googleProvider = new GoogleAuthProvider();