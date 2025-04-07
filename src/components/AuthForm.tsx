
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';

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
  
  const validateForm = () => {
    if (mode === 'login') {
      if (loginMethod === 'email' && !email) {
        toast({
          title: "Email is required",
          variant: "destructive",
        });
        return false;
      }
      
      if (loginMethod === 'phone' && !phone) {
        toast({
          title: "Phone number is required",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Register mode
      if (!phone) {
        toast({
          title: "Phone number is required",
          variant: "destructive",
        });
        return false;
      }
      
      if (!email) {
        toast({
          title: "Email is required",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (!password) {
      toast({
        title: "Password is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              type="button"
              variant={loginMethod === 'email' ? 'default' : 'outline'}
              className={loginMethod === 'email' ? 'bg-easyearn-purple' : ''}
              onClick={() => setLoginMethod('email')}
            >
              Email
            </Button>
            <Button
              type="button"
              variant={loginMethod === 'phone' ? 'default' : 'outline'}
              className={loginMethod === 'phone' ? 'bg-easyearn-purple' : ''}
              onClick={() => setLoginMethod('phone')}
            >
              Phone
            </Button>
          </div>
        )}
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                id="phone" 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="pl-10"
              />
            </div>
          </div>
        )}
        
        {(mode === 'register' || (mode === 'login' && loginMethod === 'email')) && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        )}
        
        {(mode === 'login' && loginMethod === 'phone') && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                id="phone" 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="pl-10"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        
        {mode === 'register' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input 
                id="referralCode" 
                type="text" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
              />
            </div>
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            mode === 'login' ? 'Login' : 'Register'
          )}
        </Button>
        
        <div className="text-center mt-4">
          {mode === 'login' ? (
            <p className="text-sm text-gray-600">
              Don't have an account? {' '}
              <a href="/register" className="text-easyearn-purple hover:underline">
                Register
              </a>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account? {' '}
              <a href="/login" className="text-easyearn-purple hover:underline">
                Login
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
