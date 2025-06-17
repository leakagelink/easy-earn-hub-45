
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
  const { login, register } = useAuth();
  
  const validateForm = () => {
    if (mode === 'login') {
      if (loginMethod === 'email' && !email.trim()) {
        toast({ title: "Email required", variant: "destructive" });
        return false;
      }
      if (loginMethod === 'phone' && !phone.trim()) {
        toast({ title: "Phone number required", variant: "destructive" });
        return false;
      }
    } else {
      if (!phone.trim()) {
        toast({ title: "Phone number required", variant: "destructive" });
        return false;
      }
      if (!email.trim()) {
        toast({ title: "Email required", variant: "destructive" });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return false;
      }
      if (password.length < 6) {
        toast({ title: "Password must be at least 6 characters", variant: "destructive" });
        return false;
      }
    }
    
    if (!password.trim()) {
      toast({ title: "Password required", variant: "destructive" });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', { mode, loginMethod, email, phone });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const loginEmail = loginMethod === 'email' ? email.trim() : `${phone.trim()}@easyearn.com`;
        console.log('Attempting login...');
        
        toast({
          title: "Logging in...",
          description: "Please wait while we sign you in.",
        });
        
        await login(loginEmail, password);
        
        toast({
          title: "Welcome back! ✅",
          description: "Login successful!",
        });
        
        // Check if user was trying to buy a plan
        const selectedPlan = localStorage.getItem('selectedPlan');
        if (selectedPlan) {
          navigate('/payment');
        } else {
          navigate('/invest');
        }
        
      } else {
        console.log('Attempting registration...');
        
        toast({
          title: "Creating account...",
          description: "Please wait while we create your account.",
        });
        
        await register(email.trim(), password, phone.trim(), referralCode.trim());
        
        toast({
          title: "Account created successfully! ✅",
          description: "Please check your email to verify your account.",
          duration: 5000,
        });
        
        if (selectedPlan) {
          localStorage.setItem('selectedPlan', selectedPlan);
        }
        
        // Clear form
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setReferralCode('');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      
      const errorTitle = mode === 'login' ? "Login failed ❌" : "Registration failed ❌";
      let errorMessage = error.message;
      
      // Handle specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email या password गलत है। कृपया फिर से कोशिश करें।';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'यह email पहले से registered है। Login करने की कोशिश करें।';
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = 'Internet connection problem है। कुछ देर बाद try करें।';
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
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
      
      <div className="mt-4 text-center">
        <p className="text-xs text-green-600 font-medium">
          ✅ Enhanced Supabase integration with retry mechanism
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
