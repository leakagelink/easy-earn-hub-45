
// Environment Configuration Template
// Copy this file to environment.ts and fill in your actual values

export const ENVIRONMENT_CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "your-firebase-api-key",
    authDomain: "your-project.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  },

  // Supabase Configuration (if using)
  supabase: {
    url: "your-supabase-url",
    anonKey: "your-supabase-anon-key"
  },

  // API Endpoints
  api: {
    baseUrl: "https://your-api-domain.com",
    timeout: 10000,
  },

  // Development Settings
  development: {
    enableDebugMode: true,
    enableConsoleLogging: true,
    enableNetworkDiagnostics: true,
  }
};

export default ENVIRONMENT_CONFIG;
