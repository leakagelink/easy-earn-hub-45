
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from 'lucide-react';
import { simpleRegister, simpleLogin } from '@/utils/simpleAuth';

interface SimpleAuthFormProps {
  mode: 'login' | 'register';
  selectedPlan?: string;
}

const SimpleAuthForm: React.FC<SimpleAuthFormProps> = ({ mode, selectedPlan }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !email.includes('@')) {
      toast({ 
        title: "Error", 
        description: "सही email address डालें",
        variant: "destructive" 
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({ 
        title: "Error", 
        description: "Password कम से कम 6 characters का होना चाहिए",
        variant: "destructive" 
      });
      return;
    }
    
    if (mode === 'register') {
      if (!phone || phone.length < 10) {
        toast({ 
          title: "Error", 
          description: "सही phone number डालें",
          variant: "destructive" 
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({ 
          title: "Error", 
          description: "Passwords match नहीं हो रहे",
          variant: "destructive" 
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (mode === 'login') {
        result = await simpleLogin(email, password);
      } else {
        result = await simpleRegister(email, password, phone, referralCode);
      }
      
      if (result.success) {
        toast({
          title: mode === 'login' ? "Login Successful!" : "Registration Successful!",
          description: mode === 'login' ? "Welcome back!" : "Account successfully created!",
        });
        
        if (mode === 'login') {
          setTimeout(() => navigate('/invest'), 1000);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        toast({
          title: mode === 'login' ? "Login Failed" : "Registration Failed",
          description: result.error || 'कुछ तकनीकी समस्या है।',
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "कुछ अनपेक्षित समस्या है। फिर कोशिश करें।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'login' ? '🔑 Login करें' : '📝 नया Account बनाएं'}
      </h2>
      
      {selectedPlan && (
        <div className="mb-6 p-3 bg-easyearn-purple/10 rounded-md">
          <p className="text-sm text-center text-easyearn-purple font-medium">
            📦 Plan {selectedPlan} के लिए registration
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">📧 Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full"
          />
        </div>
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">📱 Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
              className="w-full"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">🔒 Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="कम से कम 6 characters"
            required
            className="w-full"
          />
        </div>
        
        {mode === 'register' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">🔒 Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Password दोबारा डालें"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-sm font-medium">🎁 Referral Code (Optional)</Label>
              <Input 
                id="referralCode" 
                type="text" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Referral code (optional)"
                className="w-full"
              />
            </div>
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {mode === 'login' ? 'Login हो रहा है...' : 'Account बन रहा है...'}
            </span>
          ) : (
            mode === 'login' ? '🚀 Login करें' : '🎯 Register करें'
          )}
        </Button>
      </form>
      
      <div className="text-center mt-6">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Account नहीं है? {' '}
            <a href="/register" className="text-easyearn-purple hover:underline font-medium">
              Register करें
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            पहले से account है? {' '}
            <a href="/login" className="text-easyearn-purple hover:underline font-medium">
              Login करें
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleAuthForm;
