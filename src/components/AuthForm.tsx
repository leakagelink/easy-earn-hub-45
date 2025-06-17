
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/contexts/auth/SupabaseAuthProvider';
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
  console.log('🔥 Supabase AuthForm rendering with mode:', mode);
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useSupabaseAuth();
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 Form submission:', { mode, email, phone, loginMethod });
    
    // Enhanced validation
    if (!password || password.length < 6) {
      toast({ title: "Password कम से कम 6 characters का होना चाहिए", variant: "destructive" });
      return;
    }
    
    if (mode === 'login') {
      if (loginMethod === 'email') {
        if (!email || !validateEmail(email)) {
          toast({ title: "सही email address डालें", variant: "destructive" });
          return;
        }
      } else {
        if (!phone || !validatePhone(phone)) {
          toast({ title: "सही phone number डालें (10 digits)", variant: "destructive" });
          return;
        }
      }
    } else {
      if (!email || !validateEmail(email)) {
        toast({ title: "सही email address डालें", variant: "destructive" });
        return;
      }
      if (!phone || !validatePhone(phone)) {
        toast({ title: "सही phone number डालें (10 digits)", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords match नहीं हो रहे", variant: "destructive" });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
        console.log('🔑 Attempting login with:', loginEmail);
        await login(loginEmail, password);
        
        navigate(localStorage.getItem('selectedPlan') ? '/payment' : '/invest');
      } else {
        console.log('📝 Attempting registration...');
        
        await register(email, password, phone, referralCode);
        
        if (selectedPlan) localStorage.setItem('selectedPlan', selectedPlan);
        navigate('/login');
      }
    } catch (error: any) {
      console.error('💥 Auth error:', error);
      
      toast({
        title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
        description: error.message || 'कुछ गलत हुआ है। फिर से कोशिश करें।',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'login' ? 'अपने account में login करें' : 'नया account बनाएं'}
      </h2>
      
      {selectedPlan && (
        <div className="mb-6 p-3 bg-easyearn-purple/10 rounded-md">
          <p className="text-sm text-center text-easyearn-purple">
            आप Plan {selectedPlan} के लिए register कर रहे हैं
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
              label="Password फिर से डालें"
            />
            <ReferralInput referralCode={referralCode} setReferralCode={setReferralCode} />
          </>
        )}
        
        <SubmitButton isLoading={isLoading} mode={mode} />
        <AuthFooter mode={mode} />
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-green-600 font-medium">
          🔄 Supabase Authentication System
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Reliable & Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
