
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      mode,
      loginMethod,
      email,
      phone,
      password,
      confirmPassword
    });
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      if (mode === 'login') {
        // Mock successful login
        localStorage.setItem('isLoggedIn', 'true');
        
        if (loginMethod === 'email') {
          localStorage.setItem('userEmail', email);
        } else {
          localStorage.setItem('userPhone', phone);
        }
        
        localStorage.setItem('userName', 'User Name');
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/dashboard');
      } else {
        // Mock successful registration
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        
        // If a plan was selected, mock purchase
        if (selectedPlan) {
          localStorage.setItem('userPlan', selectedPlan);
        }
        
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        
        navigate('/dashboard');
      }
      
      setIsLoading(false);
    }, 1500);
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
