
import { createRoot } from 'react-dom/client'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Use the publishable key you provided
const PUBLISHABLE_KEY = "pk_test_dG91Y2hpbmctZXNjYXJnb3QtMzkuY2xlcmsuYWNjb3VudHMuZGV2JA";

console.log('🔑 Clerk Publishable Key:', PUBLISHABLE_KEY ? 'Found' : 'Missing');

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Create root and render app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#8B5CF6',
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#000000'
          }
        }}
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
