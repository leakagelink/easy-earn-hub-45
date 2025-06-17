
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
  console.log('🔥 Firebase AuthForm rendering with mode:', mode);
  
  // Add safety check for auth context
  let authContext;
  try {
    authContext = useAuth();
    console.log('✅ Firebase Auth context loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load Firebase auth context:', error);
    return (
      <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600">Firebase Auth system loading करने में problem हो रही है...</p>
          <p className="text-sm text-gray-500 mt-2">Page refresh करके try करें</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = authContext;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 Firebase form submission:', { mode, email, phone, loginMethod });
    
    // Validation
    if (!password) {
      toast({ title: "Password जरूरी है", variant: "destructive" });
      return;
    }
    
    if (mode === 'login') {
      if (loginMethod === 'email' && !email) {
        toast({ title: "Email जरूरी है", variant: "destructive" });
        return;
      }
      if (loginMethod === 'phone' && !phone) {
        toast({ title: "Phone number जरूरी है", variant: "destructive" });
        return;
      }
    } else {
      if (!email || !phone) {
        toast({ title: "सभी fields जरूरी हैं", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords match नहीं हो रहे", variant: "destructive" });
        return;
      }
      if (password.length < 6) {
        toast({ title: "Password कम से कम 6 अक्षर का होना चाहिए", variant: "destructive" });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
        console.log('🔑 Attempting Firebase login with:', loginEmail);
        await login(loginEmail, password);
        
        toast({ 
          title: "✅ Login successful!",
          description: "Firebase के साथ आपका login हो गया है"
        });
        navigate(localStorage.getItem('selectedPlan') ? '/payment' : '/invest');
      } else {
        console.log('📝 Attempting Firebase registration...');
        await register(email, password, phone, referralCode);
        
        toast({ 
          title: "✅ Registration successful!", 
          description: "Firebase के साथ account बन गया है" 
        });
        
        if (selectedPlan) localStorage.setItem('selectedPlan', selectedPlan);
        navigate('/login');
      }
    } catch (error: any) {
      console.error('💥 Firebase auth error:', error);
      
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
          🔥 Powered by Firebase - Fast & Reliable
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
