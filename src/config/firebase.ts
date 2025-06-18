
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIJlP15H-JcSU7cq9J2AIbmMHO3ZrfTMg",
  authDomain: "easy-ca82b.firebaseapp.com",
  projectId: "easy-ca82b",
  storageBucket: "easy-ca82b.firebasestorage.app",
  messagingSenderId: "348227225543",
  appId: "1:348227225543:web:63e12619f95f8105e63be2",
  measurementId: "G-K54ZQ4Z552"
};

// Initialize Firebase - prevent duplicate app error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
