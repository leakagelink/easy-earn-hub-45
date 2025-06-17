
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
    console.log('Processing error in AuthForm:', error);
    
    // Network/Connection errors - Hindi messages
    if (error.message?.includes('Failed to fetch') || 
        error.name === 'AuthRetryableFetchError' ||
        error.message?.includes('fetch') ||
        error.message?.includes('NetworkError')) {
      return 'Server से connection नहीं हो पा रहा। Internet connection check करें।';
    }
    
    // Auth-specific errors in Hindi
    if (error.message?.includes('Invalid login credentials')) {
      return 'Email या password गलत है। फिर से try करें।';
    }
    if (error.message?.includes('User already registered')) {
      return 'यह email पहले से registered है। Login करने की कोशिश करें।';
    }
    if (error.message?.includes('Password should be at least 6 characters')) {
      return 'Password कम से कम 6 characters का होना चाहिए।';
    }
    if (error.message?.includes('Invalid email')) {
      return 'सही email address डालें।';
    }
    if (error.message?.includes('Email not confirmed')) {
      return 'Email confirm करने के लिए अपना email check करें।';
    }
    
    // Return original or fallback
    return error.message || 'कुछ गलत हुआ है। फिर से try करें।';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('AuthForm: Form submission started:', { mode, loginMethod, email, phone });
    
    const isValid = validateForm({
      mode,
      loginMethod,
      email,
      phone,
      password,
      confirmPassword
    });
    
    if (!isValid) {
      console.log('AuthForm: Form validation failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
        console.log('AuthForm: Attempting login with email:', loginEmail);
        
        await login(loginEmail, password);
        
        toast({
          title: "Login successful!",
          description: "Welcome back! Redirecting you now...",
        });
        
        setTimeout(() => {
          const selectedPlan = localStorage.getItem('selectedPlan');
          if (selectedPlan) {
            console.log('AuthForm: Redirecting to payment page with plan:', selectedPlan);
            navigate('/payment');
          } else {
            console.log('AuthForm: Redirecting to invest page');
            navigate('/invest');
          }
        }, 1000);
        
      } else {
        console.log('AuthForm: Attempting registration...');
        
        const result = await register(email, password, phone, referralCode);
        
        console.log('AuthForm: Registration result:', result);
        
        toast({
          title: "Registration successful!",
          description: "अपना email check करें account confirm करने के लिए।",
        });
        
        if (selectedPlan) {
          localStorage.setItem('selectedPlan', selectedPlan);
          console.log('AuthForm: Plan saved for after login:', selectedPlan);
        }
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('AuthForm: Auth error occurred:', error);
      
      let errorTitle = mode === 'login' ? "Login failed" : "Registration failed";
      let errorDescription = getErrorMessage(error);
      
      console.log('AuthForm: Showing error toast:', { errorTitle, errorDescription });
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('AuthForm: Form submission completed');
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
