
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
console.log('Current domain:', window.location.hostname);
console.log('Current protocol:', window.location.protocol);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add auth domain verification
console.log('Auth domain from config:', firebaseConfig.authDomain);
console.log('Current window location:', window.location.origin);

// Test network connectivity
const testNetworkConnectivity = async () => {
  try {
    console.log('Testing network connectivity...');
    const response = await fetch('https://www.google.com/favicon.ico', { 
      mode: 'no-cors',
      cache: 'no-cache'
    });
    console.log('Network test successful');
    return true;
  } catch (error) {
    console.error('Network test failed:', error);
    return false;
  }
};

// Test Firebase API connectivity
const testFirebaseConnectivity = async () => {
  try {
    console.log('Testing Firebase API connectivity...');
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: 'test' })
    });
    console.log('Firebase API connectivity test completed (expected to fail with 400, but reachable)');
    return true;
  } catch (error) {
    console.error('Firebase API connectivity test failed:', error);
    return false;
  }
};

// Run connectivity tests
testNetworkConnectivity();
testFirebaseConnectivity();

// Enable offline persistence for Firestore
try {
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export default app;
