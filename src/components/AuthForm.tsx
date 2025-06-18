
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/contexts/auth/SupabaseAuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { retryWithBackoff } from '@/utils/connectionUtils';
import { getDetailedErrorMessage, shouldRetry } from '@/utils/authErrorHandler';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useSupabaseAuth();

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { testSupabaseConnection } = await import('@/integrations/supabase/client');
        const isConnected = await testSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };
    
    checkConnection();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 Form submission:', { mode, email, phone, connectionStatus });
    
    // Check connection first
    if (connectionStatus === 'disconnected') {
      toast({ 
        title: "⚠️ Connection Problem", 
        description: "Server से connection नहीं है। Internet check करें।",
        variant: "destructive" 
      });
      return;
    }
    
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
        console.log('🔑 Attempting login with retry...');
        
        await retryWithBackoff(async () => {
          return await login(email, password);
        }, 3);
        
        navigate('/invest');
      } else {
        console.log('📝 Attempting registration with retry...');
        
        await retryWithBackoff(async () => {
          return await register(email, password, phone, referralCode);
        }, 3);
        
        toast({
          title: "✅ Registration successful!",
          description: "Account बन गया है। अब login करें।",
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      console.error('💥 Auth error:', error);
      
      const errorMessage = getDetailedErrorMessage(error);
      
      toast({
        title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Update connection status if it was a network error
      if (error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
        setConnectionStatus('disconnected');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      {/* Connection Status Indicator */}
      <div className="mb-4 p-2 rounded-md text-center">
        <div className="flex items-center justify-center space-x-2">
          {connectionStatus === 'checking' && (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm text-blue-600">Connecting...</span>
            </>
          )}
          {connectionStatus === 'connected' && (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Connected</span>
            </>
          )}
          {connectionStatus === 'disconnected' && (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Connection Issue</span>
            </>
          )}
        </div>
      </div>

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
          disabled={isLoading || connectionStatus === 'disconnected'}
        >
          {isLoading ? (
            <span className="flex items-center">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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
