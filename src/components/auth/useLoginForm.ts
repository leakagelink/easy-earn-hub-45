
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type LoginMethod = 'phone' | 'email';

export function useLoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (loginMethod === 'email' && !email) {
        toast({
          title: "Email is required",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (loginMethod === 'phone' && !phone) {
        toast({
          title: "Phone number is required",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!password) {
        toast({
          title: "Password is required",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Use email for login (Firebase Auth doesn't support phone login without SMS)
      const loginEmail = loginMethod === 'email' ? email : `${phone}@easyearn.com`;
      
      await login(loginEmail, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Check if user was trying to buy a plan
      const selectedPlan = localStorage.getItem('selectedPlan');
      if (selectedPlan) {
        navigate('/payment');
      } else {
        navigate('/invest');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    showPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    loginMethod,
    setLoginMethod,
    togglePasswordVisibility,
    handleLogin
  };
}
