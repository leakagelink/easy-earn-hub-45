
export const APP_CONFIG = {
  // Brand Configuration
  branding: {
    appName: "Easy Earn Hub",
    tagline: "Your Gateway to Smart Investment",
    companyName: "Easy Earn Hub",
    supportEmail: "support@easyearn.us",
    adminEmail: "admin@easyearn.us",
    websiteUrl: "https://easyearn.us",
  },

  // Theme Configuration
  theme: {
    primaryColor: "#8053FF",
    secondaryColor: "#6332E8",
    accentColor: "#f3f4f6",
    darkMode: false,
  },

  // Investment Plans Configuration
  investmentPlans: [
    {
      id: "1",
      name: "Plan 1",
      price: 1,
      dailyProfit: 120,
      validityDays: 365,
      totalIncome: 43800,
      isPremium: false,
    },
    {
      id: "2", 
      name: "Plan 2",
      price: 1000,
      dailyProfit: 244,
      validityDays: 365,
      totalIncome: 89060,
      isPremium: false,
    },
    {
      id: "3",
      name: "Plan 3", 
      price: 2000,
      dailyProfit: 504,
      validityDays: 365,
      totalIncome: 183960,
      isPremium: false,
    },
    {
      id: "4",
      name: "Plan 4",
      price: 3000,
      dailyProfit: 765,
      validityDays: 365,
      totalIncome: 279225,
      isPremium: true,
    },
    {
      id: "5",
      name: "Plan 5",
      price: 5000,
      dailyProfit: 1288,
      validityDays: 365,
      totalIncome: 470120,
      isPremium: false,
    },
    {
      id: "6",
      name: "Plan 6",
      price: 6000,
      dailyProfit: 1622,
      validityDays: 365,
      totalIncome: 592030,
      isPremium: false,
    },
    {
      id: "7",
      name: "Plan 7",
      price: 7000,
      dailyProfit: 2100,
      validityDays: 365,
      totalIncome: 766500,
      isPremium: false,
    }
  ],

  // Features Configuration
  features: {
    maintenanceMode: false,
    registrationEnabled: true,
    withdrawalEnabled: true,
    referralSystem: true,
    emailLogin: true,
    phoneLogin: true,
    adminPanel: true,
  },

  // Payment Configuration
  payment: {
    upiEnabled: true,
    bankTransferEnabled: true,
    minimumRecharge: 100,
    minimumWithdrawal: 500,
    withdrawalFee: 0,
  },

  // Social Media Links
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "", 
    telegram: "",
    whatsapp: "",
  },

  // Contact Information
  contact: {
    phone: "+91-XXXXXXXXXX",
    email: "contact@easyearn.us",
    address: "Your Business Address",
  }
};

export default APP_CONFIG;
