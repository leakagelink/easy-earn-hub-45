
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/contexts/auth';
import LoginHeader from './LoginHeader';
import LoginOptions from './LoginOptions';
import EmailLoginForm from './EmailLoginForm';
import PhoneLoginForm from './PhoneLoginForm';
import LoginFooter from './LoginFooter';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useSupabaseAuth();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const getErrorMessage = (error: any) => {
    if (error.message?.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (error.message?.includes('Email not confirmed')) {
      return 'Please check your email and confirm your account before logging in.';
    }
    return error.message || 'Something went wrong. Please try again.';
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', { loginMethod, email, phone });
    
    // Basic validation
    if (loginMethod === 'email' && !email) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
      return;
    }
    
    if (loginMethod === 'phone' && !phone) {
      toast({
        title: "Phone number is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Password is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
      console.log('Attempting login with email:', loginEmail);
      
      await login(loginEmail, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Check if user was trying to buy a plan
      const selectedPlan = localStorage.getItem('selectedPlan');
      if (selectedPlan) {
        console.log('Redirecting to payment page with plan:', selectedPlan);
        navigate('/payment');
      } else {
        console.log('Redirecting to invest page');
        navigate('/invest');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md mx-auto">
      <LoginHeader />
      
      <div className="p-6">
        <LoginOptions loginMethod={loginMethod} setLoginMethod={setLoginMethod} />
        
        {loginMethod === 'email' ? (
          <EmailLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            handleLogin={handleLogin}
          />
        ) : (
          <PhoneLoginForm
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            handleLogin={handleLogin}
          />
        )}
        
        <LoginFooter />
      </div>
    </div>
  );
};

export default LoginForm;
