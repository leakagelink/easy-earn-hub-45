
import { initializeApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAKyGbIrXskKQl_quzBugAI3wsPTdAUGBg",
  authDomain: "easyearn-a180a.firebaseapp.com",
  projectId: "easyearn-a180a",
  storageBucket: "easyearn-a180a.firebasestorage.app",
  messagingSenderId: "343867436584",
  appId: "1:343867436584:web:c67cac81c74a009839cf1d",
  measurementId: "G-17902Z1C3F"
};

console.log('🔥 Initializing Firebase client...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

// Initialize Analytics only if running in browser
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Analytics initialization skipped:', error);
}

export { analytics };

console.log('✅ Firebase initialized successfully');

// Enable network persistence for better offline experience
auth.useDeviceLanguage();

// Set custom timeout for better reliability
auth.settings.appVerificationDisabledForTesting = false;

export default app;
