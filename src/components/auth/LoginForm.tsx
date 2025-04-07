
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordField from './PasswordField';
import RememberMeCheckbox from './RememberMeCheckbox';
import EmailInput from './EmailInput';
import PhoneInput from './PhoneInput';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
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
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-easyearn-purple to-easyearn-darkpurple p-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Welcome Back
        </h2>
        <p className="text-white/80 text-center mt-2">
          Sign in to access your account
        </p>
      </div>
      
      <div className="p-8">
        <Tabs defaultValue="email" className="mb-6" onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <form onSubmit={handleLogin} className="space-y-6">
              <EmailInput email={email} setEmail={setEmail} />
              
              <PasswordField 
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                id="password-email"
              />
              
              <div className="flex items-center justify-between">
                <RememberMeCheckbox 
                  rememberMe={rememberMe} 
                  setRememberMe={setRememberMe}
                  id="remember-me-email"
                />
                <a 
                  href="#" 
                  className="text-sm text-easyearn-purple hover:text-easyearn-darkpurple hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="phone">
            <form onSubmit={handleLogin} className="space-y-6">
              <PhoneInput phone={phone} setPhone={setPhone} />
              
              <PasswordField 
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                id="password-phone"
              />
              
              <div className="flex items-center justify-between">
                <RememberMeCheckbox 
                  rememberMe={rememberMe} 
                  setRememberMe={setRememberMe}
                  id="remember-me-phone"
                />
                <a 
                  href="#" 
                  className="text-sm text-easyearn-purple hover:text-easyearn-darkpurple hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <a href="/register" className="text-easyearn-purple font-medium hover:underline">
              Create account
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Want to explore the site first? {' '}
            <a href="/home" className="text-easyearn-purple hover:underline">
              Visit homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
