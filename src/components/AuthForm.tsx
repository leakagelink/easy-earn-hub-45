
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { enhancedRegister, enhancedLogin } from '@/utils/authUtils';
import { testSupabaseConnection } from '@/utils/connectionUtils';

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
  const [retryCount, setRetryCount] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Enhanced connection monitoring
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔄 Testing enhanced connection...');
        const result = await testSupabaseConnection();
        
        if (result.isConnected) {
          console.log('✅ Connection successful');
          setConnectionStatus('connected');
        } else {
          console.error('❌ Connection failed:', result.error);
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error('💥 Connection test error:', error);
        setConnectionStatus('disconnected');
      }
    };
    
    checkConnection();
    
    // Periodic connection check
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 Enhanced form submission:', { mode, email, phone, connectionStatus, retryCount });
    
    // Basic validation
    if (!email || !email.includes('@')) {
      toast({ 
        title: "✋ रुकिए!", 
        description: "सही email address डालें",
        variant: "destructive" 
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({ 
        title: "✋ रुकिए!", 
        description: "Password कम से कम 6 characters का होना चाहिए",
        variant: "destructive" 
      });
      return;
    }
    
    if (mode === 'register') {
      if (!phone || phone.length < 10) {
        toast({ 
          title: "✋ रुकिए!", 
          description: "सही phone number डालें (10+ digits)",
          variant: "destructive" 
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({ 
          title: "✋ रुकिए!", 
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
        console.log('🔑 Starting enhanced login...');
        result = await enhancedLogin(email, password);
      } else {
        console.log('📝 Starting enhanced registration...');
        result = await enhancedRegister(email, password, phone, referralCode);
      }
      
      if (result.success) {
        toast({
          title: mode === 'login' ? "🎉 Login Successful!" : "🎉 Registration Successful!",
          description: mode === 'login' ? "आपका login हो गया है।" : "Account बन गया है! अब login करें।",
        });
        
        if (mode === 'login') {
          navigate('/invest');
        } else {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
        
        setRetryCount(0);
      } else {
        // Handle failure
        toast({
          title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
          description: result.error || 'कुछ तकनीकी समस्या है।',
          variant: "destructive"
        });
        
        if (result.needsRetry) {
          setRetryCount(prev => prev + 1);
          setConnectionStatus('disconnected');
        }
      }
      
    } catch (error: any) {
      console.error('💥 Unexpected error:', error);
      
      toast({
        title: "❌ Unexpected Error",
        description: "कुछ अनपेक्षित समस्या है। फिर से कोशिश करें।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetry = async () => {
    setConnectionStatus('checking');
    const result = await testSupabaseConnection();
    setConnectionStatus(result.isConnected ? 'connected' : 'disconnected');
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      {/* Enhanced Connection Status */}
      <div className={`mb-4 p-3 rounded-md ${
        connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' :
        connectionStatus === 'disconnected' ? 'bg-red-50 border border-red-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {connectionStatus === 'checking' && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">Connecting...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">✅ Connected</span>
              </>
            )}
            {connectionStatus === 'disconnected' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">❌ Connection Issue</span>
              </>
            )}
          </div>
          
          {connectionStatus === 'disconnected' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRetry}
              className="text-xs"
            >
              Retry
            </Button>
          )}
        </div>
        
        {retryCount > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            Retry attempts: {retryCount}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'login' ? 'Login करें' : 'नया Account बनाएं'}
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
          disabled={isLoading || connectionStatus === 'disconnected'}
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
      
      <div className="mt-6 text-center">
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-blue-700 font-medium">
            🔧 Enhanced Authentication System
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Connection monitoring, retry mechanism, और detailed error handling के साथ!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
