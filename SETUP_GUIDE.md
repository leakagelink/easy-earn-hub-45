# Easy Earn Hub - Setup Guide

## 🚀 Quick Start

This is a complete investment platform built with React, Firebase, and Supabase. Follow this guide to set up your own version.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account
- Supabase account (optional)

## 🛠️ Installation Steps

### 1. Clone/Remix the Project

```bash
# If cloning from GitHub
git clone <your-repo-url>
cd easy-earn-hub

# Install dependencies
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Phone authentication
4. Create a Firestore database
5. Get your Firebase configuration from Project Settings

### 3. Configuration Setup

1. Copy the environment template:
   ```bash
   cp src/config/environment.template.ts src/config/environment.ts
   ```

2. Update `src/config/environment.ts` with your Firebase credentials:
   ```typescript
   export const ENVIRONMENT_CONFIG = {
     firebase: {
       apiKey: "your-actual-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       // ... other config values
     }
   };
   ```

3. Update `src/config/firebase.ts` to use your configuration:
   ```typescript
   import { ENVIRONMENT_CONFIG } from './environment';
   
   const firebaseConfig = ENVIRONMENT_CONFIG.firebase;
   ```

### 4. Customize Your App

Edit `src/config/appConfig.ts` to customize:

- **Branding**: App name, tagline, colors
- **Investment Plans**: Prices, profits, validity
- **Features**: Enable/disable functionality
- **Contact Info**: Your business details

### 5. Supabase Setup (Optional)

If you want to use Supabase for additional backend features:

1. Create a Supabase project
2. Run the migrations in the `supabase/migrations/` folder
3. Update the Supabase configuration in `environment.ts`

### 6. Run the Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:8080`

## 🎨 Customization Guide

### Changing Colors and Branding

Edit `src/config/appConfig.ts`:

```typescript
export const APP_CONFIG = {
  branding: {
    appName: "Your App Name",
    tagline: "Your Custom Tagline",
    // ...
  },
  theme: {
    primaryColor: "#your-color",
    secondaryColor: "#your-secondary-color",
    // ...
  }
};
```

### Modifying Investment Plans

Update the `investmentPlans` array in `appConfig.ts`:

```typescript
investmentPlans: [
  {
    id: "1",
    name: "Starter Plan",
    price: 100,
    dailyProfit: 5,
    validityDays: 30,
    totalIncome: 150,
    isPremium: false,
  },
  // Add more plans...
]
```

### Adding/Removing Features

Use the `features` object in `appConfig.ts`:

```typescript
features: {
  maintenanceMode: false,
  registrationEnabled: true,
  withdrawalEnabled: true,
  referralSystem: true,
  emailLogin: true,
  phoneLogin: true,
  adminPanel: true,
}
```

## 🔒 Admin Setup

1. Create an admin account with email: `admin@yourdomain.com`
2. Update the admin email in `appConfig.ts`
3. Access admin panel at `/admin`

## 📱 Mobile Optimization

The app is fully responsive and includes:
- Mobile-first design
- Touch-friendly interface
- Progressive Web App features

## 🚀 Deployment

### Option 1: Lovable (Recommended)
- Click the "Publish" button in Lovable
- Your app will be deployed automatically

### Option 2: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the deployment prompts

## 🔧 Environment Variables

For production deployment, set these environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 📞 Support

For setup help or customization:
- Check the FAQ section
- Review the code documentation
- Contact support if available

## 🎯 Next Steps

1. Set up your Firebase project
2. Customize the branding and colors
3. Configure your investment plans
4. Test the application thoroughly
5. Deploy to production

Happy building! 🚀
