
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/auth';
import LoginOptions from './auth/LoginOptions';
import PhoneInput from './auth/PhoneInput';
import EmailInput from './auth/EmailInput';
import PasswordInput from './auth/PasswordInput';
import ReferralInput from './auth/ReferralInput';
import SubmitButton from './auth/SubmitButton';
import AuthFooter from './auth/AuthFooter';
import { useAuthFormValidator } from './auth/AuthFormValidator';

interface AuthFormProps {
  mode: 'login' | 'register';
  selectedPlan?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, selectedPlan }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateForm } = useAuthFormValidator();
  const { login, register } = useAuth();
  
  const getErrorMessage = (error: any) => {
    console.log('Processing error:', error);
    
    // Network/Connection errors
    if (error.message?.includes('Failed to fetch') || 
        error.name === 'AuthRetryableFetchError' ||
        error.message?.includes('Network connection error')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }
    
    // Auth-specific errors
    if (error.message?.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (error.message?.includes('User already registered')) {
      return 'This email is already registered. Please use a different email or try logging in instead.';
    }
    if (error.message?.includes('Password should be at least 6 characters')) {
      return 'Password should be at least 6 characters long.';
    }
    if (error.message?.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (error.message?.includes('Email not confirmed')) {
      return 'Please check your email and confirm your account before logging in.';
    }
    
    // Return the original error message or a generic fallback
    return error.message || 'Something went wrong. Please try again.';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', { mode, loginMethod, email, phone });
    
    const isValid = validateForm({
      mode,
      loginMethod,
      email,
      phone,
      password,
      confirmPassword
    });
    
    if (!isValid) {
      console.log('Form validation failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
        console.log('Attempting login with email:', loginEmail);
        
        await login(loginEmail, password);
        
        toast({
          title: "Login successful!",
          description: "Welcome back! Redirecting you now...",
        });
        
        // Small delay to show success message
        setTimeout(() => {
          // Check if user was trying to buy a plan
          const selectedPlan = localStorage.getItem('selectedPlan');
          if (selectedPlan) {
            console.log('Redirecting to payment page with plan:', selectedPlan);
            navigate('/payment');
          } else {
            console.log('Redirecting to invest page');
            navigate('/invest');
          }
        }, 1000);
        
      } else {
        console.log('Attempting registration with:', { email, phone, referralCode });
        
        await register(email, password, phone, referralCode);
        
        toast({
          title: "Registration successful!",
          description: "Please check your email to confirm your account.",
        });
        
        // If a plan was selected, save it for after login
        if (selectedPlan) {
          localStorage.setItem('selectedPlan', selectedPlan);
          console.log('Plan saved for after login:', selectedPlan);
        }
        
        // Small delay before redirect
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorTitle = mode === 'login' ? "Login failed" : "Registration failed";
      let errorDescription = getErrorMessage(error);
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'login' ? 'Login to your account' : 'Create a new account'}
      </h2>
      
      {selectedPlan && (
        <div className="mb-6 p-3 bg-easyearn-purple/10 rounded-md">
          <p className="text-sm text-center text-easyearn-purple">
            You're registering for Plan {selectedPlan}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'login' && (
          <LoginOptions loginMethod={loginMethod} setLoginMethod={setLoginMethod} />
        )}
        
        {mode === 'register' && <PhoneInput phone={phone} setPhone={setPhone} />}
        
        {(mode === 'register' || (mode === 'login' && loginMethod === 'email')) && (
          <EmailInput email={email} setEmail={setEmail} />
        )}
        
        {(mode === 'login' && loginMethod === 'phone') && (
          <PhoneInput phone={phone} setPhone={setPhone} />
        )}
        
        <PasswordInput password={password} setPassword={setPassword} />
        
        {mode === 'register' && (
          <>
            <PasswordInput 
              password={confirmPassword} 
              setPassword={setConfirmPassword}
              id="confirmPassword"
              label="Confirm Password"
            />
            
            <ReferralInput referralCode={referralCode} setReferralCode={setReferralCode} />
          </>
        )}
        
        <SubmitButton isLoading={isLoading} mode={mode} />
        
        <AuthFooter mode={mode} />
      </form>
    </div>
  );
};

export default AuthForm;
