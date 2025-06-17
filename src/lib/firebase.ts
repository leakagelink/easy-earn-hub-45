
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKyGbIrXskKQl_quzBugAI3wsPTdAUGBg",
  authDomain: "easyearn-a180a.firebaseapp.com",
  projectId: "easyearn-a180a",
  storageBucket: "easyearn-a180a.firebasestorage.app",
  messagingSenderId: "343867436584",
  appId: "1:343867436584:web:c67cac81c74a009839cf1d",
  measurementId: "G-17902Z1C3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Configure auth settings for better connectivity
auth.languageCode = 'en';

// Don't use enableNetwork as it can cause CORS issues in some environments
console.log('Firebase initialized successfully');

export default app;
