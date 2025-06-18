
# Customization Guide

## 🎨 How to Customize Your Investment Platform

### 1. Basic Branding Changes

All branding is controlled through `src/config/appConfig.ts`:

```typescript
branding: {
  appName: "Your Investment Platform",
  tagline: "Your Custom Tagline", 
  companyName: "Your Company Name",
  supportEmail: "support@yourdomain.com",
  adminEmail: "admin@yourdomain.com",
  websiteUrl: "https://yourdomain.com",
}
```

### 2. Color Scheme Customization

Update the theme colors:

```typescript
theme: {
  primaryColor: "#your-primary-color",   // Main brand color
  secondaryColor: "#your-secondary-color", // Secondary brand color
  accentColor: "#your-accent-color",     // Accent color
  darkMode: false,                       // Enable/disable dark mode
}
```

The colors will automatically update throughout the app using CSS custom properties.

### 3. Investment Plans Configuration

Modify plans in the `investmentPlans` array:

```typescript
{
  id: "unique-id",
  name: "Plan Name",
  price: 1000,           // Investment amount
  dailyProfit: 50,       // Daily profit amount
  validityDays: 30,      // Plan duration in days
  totalIncome: 1500,     // Total expected income
  isPremium: false,      // Premium badge
}
```

### 4. Feature Toggles

Enable/disable features easily:

```typescript
features: {
  maintenanceMode: false,      // Put app in maintenance mode
  registrationEnabled: true,   // Allow new registrations
  withdrawalEnabled: true,     // Enable withdrawal functionality  
  referralSystem: true,        // Enable referral program
  emailLogin: true,           // Allow email login
  phoneLogin: true,           // Allow phone login
  adminPanel: true,           // Enable admin panel access
}
```

### 5. Payment Configuration

Customize payment settings:

```typescript
payment: {
  upiEnabled: true,           // Enable UPI payments
  bankTransferEnabled: true,  // Enable bank transfers
  minimumRecharge: 100,       // Minimum recharge amount
  minimumWithdrawal: 500,     // Minimum withdrawal amount
  withdrawalFee: 0,          // Withdrawal fee (0 = free)
}
```

### 6. Contact Information

Update your business contact details:

```typescript
contact: {
  phone: "+1-XXX-XXX-XXXX",
  email: "contact@yourdomain.com", 
  address: "Your Business Address",
}
```

### 7. Social Media Links

Add your social media presence:

```typescript
socialMedia: {
  facebook: "https://facebook.com/yourpage",
  twitter: "https://twitter.com/yourhandle",
  instagram: "https://instagram.com/yourhandle",
  telegram: "https://t.me/yourchannel",
  whatsapp: "https://wa.me/yournumber",
}
```

## 🔧 Advanced Customizations

### Custom Logo

1. Add your logo to `public/` folder
2. Update the Header component to use your logo
3. Replace favicon.ico with your branded icon

### Custom Styling

The app uses Tailwind CSS. You can:

1. Update `tailwind.config.ts` for custom colors
2. Modify component styles in individual files
3. Add custom CSS classes in `src/index.css`

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in relevant components

### Database Schema Changes

If using Supabase:

1. Create new migration files in `supabase/migrations/`
2. Update TypeScript types as needed
3. Modify API calls in components

### Language Localization

The app currently supports English and Hindi:

1. Create translation files for new languages
2. Update text strings throughout components
3. Add language switcher if needed

## 🎯 Common Customization Scenarios

### Scenario 1: Different Investment Model

Want daily payouts instead of lump sum?

1. Update plan calculations in `appConfig.ts`
2. Modify display logic in `PlanCard` component
3. Adjust database schema if needed

### Scenario 2: Different Payment Methods

Want to add cryptocurrency payments?

1. Add payment method to `payment` config
2. Create new payment components
3. Integrate with crypto payment processors

### Scenario 3: Multi-language Support

Want to support multiple languages?

1. Install i18n library
2. Create translation files
3. Wrap text strings with translation functions

### Scenario 4: White-label Solution

Want to create multiple branded versions?

1. Create environment-specific config files
2. Use build-time variables for branding
3. Deploy separate instances with different configs

## 📝 Best Practices

1. **Always test changes** in development before deploying
2. **Backup your data** before making database changes
3. **Use version control** to track your customizations
4. **Document your changes** for future reference
5. **Test on mobile devices** after UI changes

## 🚨 Important Notes

- Always update both the config and any hard-coded values
- Test all features after making changes
- Consider user experience when modifying flows
- Keep security in mind when adding new features
- Ensure compliance with local regulations

Need help with specific customizations? Check the main README or contact support!
