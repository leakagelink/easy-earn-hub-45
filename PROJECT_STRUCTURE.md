
# Project Structure

## 📁 Directory Overview

```
easy-earn-hub/
├── public/                          # Static assets
│   ├── favicon.ico                  # App favicon
│   └── lovable-uploads/            # Uploaded images
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── auth/                   # Authentication components
│   │   ├── admin/                  # Admin panel components
│   │   ├── dashboard/              # Dashboard components
│   │   └── recharge/               # Recharge/payment components
│   ├── config/                     # Configuration files
│   │   ├── appConfig.ts            # Main app configuration
│   │   ├── firebase.ts             # Firebase configuration
│   │   └── environment.template.ts  # Environment template
│   ├── hooks/                      # Custom React hooks
│   ├── integrations/               # Third-party integrations
│   │   └── supabase/              # Supabase client and types
│   ├── lib/                       # Utility libraries
│   ├── pages/                     # Page components
│   │   ├── admin/                 # Admin panel pages
│   │   ├── Dashboard.tsx          # User dashboard
│   │   ├── Login.tsx              # Login page
│   │   ├── Register.tsx           # Registration page
│   │   ├── Invest.tsx             # Investment plans page
│   │   └── ...                    # Other pages
│   ├── utils/                     # Utility functions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   └── index.css                  # Global styles
├── supabase/                      # Supabase configuration
│   ├── config.toml               # Supabase project config
│   └── migrations/               # Database migrations
├── SETUP_GUIDE.md               # Setup instructions
├── CUSTOMIZATION_GUIDE.md       # Customization guide
├── PROJECT_STRUCTURE.md         # This file
└── README.md                    # Project overview
```

## 🏗️ Component Architecture

### Core Components

- **Header.tsx** - Main navigation header
- **Footer.tsx** - App footer with links
- **BottomBar.tsx** - Mobile bottom navigation
- **PlanCard.tsx** - Investment plan display card

### Authentication System

```
src/components/auth/
├── EmailInput.tsx          # Email input field
├── PhoneInput.tsx          # Phone input field  
├── PasswordField.tsx       # Password input with visibility toggle
├── LoginActionSection.tsx  # Login buttons and actions
├── EmailLoginForm.tsx      # Complete email login form
├── PhoneLoginForm.tsx      # Complete phone login form
└── ...                     # Other auth components
```

### Admin Panel

```
src/components/admin/
└── PaymentRequestsTable.tsx  # Payment requests management

src/pages/admin/
├── AdminUsers.tsx          # User management
├── AdminInvestments.tsx    # Investment management
├── AdminTransactions.tsx   # Transaction history
├── AdminWithdrawals.tsx    # Withdrawal requests
├── AdminPlans.tsx          # Investment plan management
├── AdminSecurity.tsx       # Security settings
├── AdminSettings.tsx       # App settings
└── AdminReports.tsx        # Analytics and reports
```

### Dashboard Components

```
src/components/dashboard/
├── DashboardStats.tsx      # Stats cards (balance, earnings, etc.)
├── DashboardActions.tsx    # Quick action buttons
├── InvestmentsTable.tsx    # User's investments table
└── TransactionsTable.tsx   # Transaction history table
```

## 🔧 Configuration System

### Main Configuration (`src/config/appConfig.ts`)

This is the heart of customization:

```typescript
export const APP_CONFIG = {
  branding: { /* App name, tagline, etc. */ },
  theme: { /* Colors and styling */ },
  investmentPlans: [ /* All investment plans */ ],
  features: { /* Feature toggles */ },
  payment: { /* Payment settings */ },
  socialMedia: { /* Social links */ },
  contact: { /* Contact information */ }
};
```

### Environment Configuration

- `environment.template.ts` - Template for environment variables
- `firebase.ts` - Firebase configuration
- Users create their own `environment.ts` from the template

## 🗄️ Database Structure (Supabase)

### Tables

1. **profiles** - User profile information
2. **investment_plans** - Available investment plans
3. **user_investments** - User's active investments
4. **transactions** - All financial transactions
5. **withdrawals** - Withdrawal requests
6. **payment_requests** - Payment verification requests

### Security

- Row Level Security (RLS) enabled on all tables
- Admin function for elevated permissions
- User-specific data access policies

## 🎨 Styling System

### Tailwind CSS Configuration

- Custom colors defined in `tailwind.config.ts`
- CSS custom properties in `src/index.css`
- Responsive design patterns throughout

### Theme System

- Primary/secondary colors configurable
- CSS custom properties for easy theming
- Dark mode support (configurable)

## 🔌 Integration Points

### Firebase Integration

- Authentication (Email/Phone)
- Real-time database (if needed)
- Cloud functions (if needed)

### Supabase Integration

- PostgreSQL database
- Real-time subscriptions
- Row Level Security
- Auto-generated TypeScript types

## 📱 Mobile Optimization

### Responsive Design

- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens

### PWA Features

- Installable app
- Offline support (partial)
- Fast loading times

## 🚀 Build and Deployment

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment Options

1. **Lovable** - One-click deployment
2. **Netlify** - Connect GitHub repository
3. **Vercel** - Import from GitHub
4. **Other hosts** - Build and upload `dist` folder

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] User registration/login
- [ ] Investment plan selection
- [ ] Payment processing
- [ ] Dashboard functionality
- [ ] Admin panel access
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Key Test Scenarios

1. Complete user journey (signup → invest → dashboard)
2. Admin operations (user management, payment approval)
3. Error handling (network issues, invalid data)
4. Mobile device testing
5. Different screen sizes

## 🔒 Security Considerations

### Frontend Security

- Input validation and sanitization
- Secure authentication flows
- Protected admin routes
- Environment variable protection

### Backend Security

- Database RLS policies
- API rate limiting (recommended)
- Secure password handling
- Admin privilege verification

## 📈 Performance Optimization

### Code Splitting

- Route-based code splitting
- Component lazy loading
- Bundle size optimization

### Asset Optimization

- Image optimization
- CSS/JS minification
- Gzip compression

## 🛠️ Development Workflow

### Getting Started

1. Clone/remix the project
2. Follow SETUP_GUIDE.md
3. Customize using CUSTOMIZATION_GUIDE.md
4. Test thoroughly
5. Deploy

### Best Practices

- Use TypeScript for type safety
- Follow component composition patterns
- Keep components focused and reusable
- Use custom hooks for business logic
- Maintain clean file organization

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

Need help understanding any part of the structure? Check the setup guide or reach out for support!
