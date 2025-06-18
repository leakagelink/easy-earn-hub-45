
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/contexts/auth/SupabaseAuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useSupabaseAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 Form submission:', { mode, email, phone });
    
    // Basic validation
    if (!email || !email.includes('@')) {
      toast({ 
        title: "सही email address डालें", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({ 
        title: "Password कम से कम 6 characters का होना चाहिए", 
        variant: "destructive" 
      });
      return;
    }
    
    if (mode === 'register') {
      if (!phone || phone.length < 10) {
        toast({ 
          title: "सही phone number डालें (10+ digits)", 
          variant: "destructive" 
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({ 
          title: "Passwords match नहीं हो रहे", 
          variant: "destructive" 
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        console.log('🔑 Attempting login...');
        await login(email, password);
        navigate('/invest');
      } else {
        console.log('📝 Attempting registration...');
        await register(email, password, phone, referralCode);
        toast({
          title: "✅ Registration successful!",
          description: "Account बन गया है। अब login करें।",
        });
        setTimeout(() => navigate('/login'), 2000);
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
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
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
            required
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
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input 
                id="referralCode" 
                type="text" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code (optional)"
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
            mode === 'login' ? 'Login करें' : 'Register करें'
          )}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <a href="/register" className="text-easyearn-purple hover:underline">
              Register करें
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <a href="/login" className="text-easyearn-purple hover:underline">
              Login करें
            </a>
          </p>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-green-600 font-medium">
          ✅ Simplified Authentication System
        </p>
        <p className="text-xs text-gray-500 mt-1">
          अब registration और login आसानी से काम करेगा
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
