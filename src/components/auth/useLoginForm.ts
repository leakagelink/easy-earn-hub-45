
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type LoginMethod = 'phone' | 'email';

export function useLoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
    
    // Check if admin credentials
    if (loginMethod === 'email' && email === 'admin@easyearn.us' && password === 'Easy@123') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email);
      toast({
        title: "Admin login successful",
        description: "Welcome to admin panel",
      });
      setIsLoading(false);
      navigate('/admin');
      return;
    } 
    
    // Regular user login
    localStorage.setItem('isLoggedIn', 'true');
    
    if (loginMethod === 'email') {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.setItem('userPhone', phone);
    }
    
    localStorage.setItem('userName', 'User Name'); // In a real app, get this from API
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
    setIsLoading(false);
    navigate('/dashboard');
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
