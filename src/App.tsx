
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import { initializeFirebaseAuth } from "./utils/firebaseAuth";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Recharge from "./pages/Recharge";
import Withdraw from "./pages/Withdraw";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Invest from "./pages/Invest";
import Admin from "./pages/Admin";
import MaintenancePage from "./pages/MaintenancePage";
import Payment from "./pages/Payment";

// Admin pages
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInvestments from "./pages/admin/AdminInvestments";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";

const queryClient = new QueryClient();

// MaintenanceCheck Component
const MaintenanceCheck = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMaintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isMaintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }
  
  return <>{children}</>;
};

// AppRoutes component that contains all routes
const AppRoutes = () => {
  // Initialize Firebase auth system on app start
  React.useEffect(() => {
    initializeFirebaseAuth();
  }, []);
  
  return (
    <MaintenanceCheck>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/investments" element={<AdminInvestments />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route path="/admin/security" element={<AdminSecurity />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomBar />
    </MaintenanceCheck>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
