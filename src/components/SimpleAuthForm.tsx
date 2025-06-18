
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { enhancedRegister, enhancedLogin } from '@/utils/enhancedAuth';
import { testConnection } from '@/integrations/supabase/client';

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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
    };
    checkConnection();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started:', { mode, email, phone });
    
    // Basic validation
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
          description: "सही phone number डालें (10+ digits)",
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
        console.log('🔑 Starting login process...');
        result = await enhancedLogin(email, password);
      } else {
        console.log('📝 Starting registration process...');
        result = await enhancedRegister(email, password, phone, referralCode);
      }
      
      console.log('📊 Auth result:', result);
      
      if (result.success) {
        toast({
          title: mode === 'login' ? "🎉 Login Successful!" : "🎉 Registration Successful!",
          description: mode === 'login' ? "Welcome back!" : "Account created successfully!",
        });
        
        if (mode === 'login') {
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        console.error('🚨 Auth failed:', result.error);
        
        toast({
          title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
          description: result.error || 'कुछ तकनीकी समस्या है।',
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('💥 Unexpected error:', error);
      
      toast({
        title: "❌ Network Error",
        description: "Internet connection check करें और फिर कोशिश करें।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = async () => {
    setConnectionStatus('checking');
    const result = await testConnection();
    setConnectionStatus(result.success ? 'connected' : 'error');
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      {/* Connection Status */}
      <div className={`mb-4 p-3 rounded-md flex items-center justify-between ${
        connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' :
        connectionStatus === 'error' ? 'bg-red-50 border border-red-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center space-x-2">
          {connectionStatus === 'checking' && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
          {connectionStatus === 'connected' && <Wifi className="h-4 w-4 text-green-600" />}
          {connectionStatus === 'error' && <WifiOff className="h-4 w-4 text-red-600" />}
          <span className={`text-sm font-medium ${
            connectionStatus === 'connected' ? 'text-green-700' :
            connectionStatus === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {connectionStatus === 'checking' && 'Connection checking...'}
            {connectionStatus === 'connected' && '✅ System Ready'}
            {connectionStatus === 'error' && '❌ Connection Issue'}
          </span>
        </div>
        {connectionStatus !== 'connected' && (
          <Button size="sm" variant="outline" onClick={retryConnection}>
            Retry
          </Button>
        )}
      </div>

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
          disabled={isLoading || connectionStatus !== 'connected'}
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
        <div className="p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-xs text-green-700 font-medium">
            ✅ Fixed Registration System
          </p>
          <p className="text-xs text-green-600 mt-1">
            Clean Supabase connection with enhanced error handling!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthForm;
