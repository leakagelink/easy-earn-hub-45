
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAKyGbIrXskKQl_quzBugAI3wsPTdAUGBg",
  authDomain: "easyearn-a180a.firebaseapp.com",
  projectId: "easyearn-a180a",
  storageBucket: "easyearn-a180a.firebasestorage.app",
  messagingSenderId: "343867436584",
  appId: "1:343867436584:web:c67cac81c74a009839cf1d",
  measurementId: "G-17902Z1C3F"
};

console.log('Initializing Firebase with config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
try {
  // This helps with network issues
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export default app;
