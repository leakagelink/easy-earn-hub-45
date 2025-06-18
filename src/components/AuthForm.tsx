import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff, Zap, Globe } from 'lucide-react';
import { enhancedRegister, enhancedLogin } from '@/utils/authUtils';
import { testSupabaseConnection } from '@/integrations/supabase/client';
import { testNetworkQuality } from '@/utils/networkUtils';

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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'network-issue'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<any>(null);
  const [lastError, setLastError] = useState<string>('');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // POWERFUL connection monitoring
  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        console.log('🔄 RUNNING POWERFUL DIAGNOSTICS...');
        
        // Test network quality first
        const networkTest = await testNetworkQuality();
        setNetworkQuality(networkTest);
        console.log('🌐 Network test result:', networkTest);
        
        // Test Supabase connection
        const supabaseTest = await testSupabaseConnection();
        console.log('🎯 Supabase test result:', supabaseTest);
        
        if (networkTest.canReachSupabase && supabaseTest.success) {
          console.log('✅ ALL SYSTEMS OPERATIONAL');
          setConnectionStatus('connected');
          setLastError('');
        } else if (!networkTest.canReachSupabase) {
          console.error('❌ NETWORK ISSUE DETECTED');
          setConnectionStatus('network-issue');
          setLastError(networkTest.error || 'Network connectivity issue');
        } else {
          console.error('❌ SUPABASE ISSUE DETECTED');
          setConnectionStatus('disconnected');
          setLastError(supabaseTest.error || 'Supabase connection issue');
        }
      } catch (error: any) {
        console.error('💥 DIAGNOSTICS FAILED:', error);
        setConnectionStatus('disconnected');
        setLastError(error.message);
      }
    };
    
    runDiagnostics();
    
    // Check every 30 seconds
    const interval = setInterval(runDiagnostics, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 POWERFUL FORM SUBMISSION:', { 
      mode, 
      email, 
      phone, 
      connectionStatus, 
      retryCount,
      networkQuality: networkQuality?.speed,
      timestamp: new Date().toISOString()
    });
    
    // Enhanced validation
    if (!email || !email.includes('@')) {
      toast({ 
        title: "✋ Email Error", 
        description: "सही email address डालें",
        variant: "destructive" 
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({ 
        title: "✋ Password Error", 
        description: "Password कम से कम 6 characters का होना चाहिए",
        variant: "destructive" 
      });
      return;
    }
    
    if (mode === 'register') {
      if (!phone || phone.length < 10) {
        toast({ 
          title: "✋ Phone Error", 
          description: "सही phone number डालें (10+ digits)",
          variant: "destructive" 
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({ 
          title: "✋ Password Mismatch", 
          description: "Passwords match नहीं हो रहे",
          variant: "destructive" 
        });
        return;
      }
    }
    
    setIsLoading(true);
    setLastError('');
    
    try {
      let result;
      
      if (mode === 'login') {
        console.log('🔑 STARTING POWERFUL LOGIN...');
        result = await enhancedLogin(email, password);
      } else {
        console.log('📝 STARTING POWERFUL REGISTRATION...');
        result = await enhancedRegister(email, password, phone, referralCode);
      }
      
      console.log('📊 AUTH RESULT:', result);
      
      if (result.success) {
        toast({
          title: mode === 'login' ? "🎉 Login Successful!" : "🎉 Registration Successful!",
          description: mode === 'login' ? "Welcome back!" : "Account successfully created!",
        });
        
        if (mode === 'login') {
          setTimeout(() => navigate('/invest'), 1000);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
        
        setRetryCount(0);
        setLastError('');
      } else {
        console.error('🚨 AUTHENTICATION FAILED:', result.error);
        setLastError(result.error || 'Unknown error');
        
        toast({
          title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
          description: result.error || 'कुछ तकनीकी समस्या है।',
          variant: "destructive"
        });
        
        if (result.needsRetry) {
          setRetryCount(prev => prev + 1);
          if (result.networkIssue) {
            setConnectionStatus('network-issue');
          } else {
            setConnectionStatus('disconnected');
          }
        }
      }
      
    } catch (error: any) {
      console.error('💥 UNEXPECTED ERROR in form submission:', error);
      setLastError(error.message);
      
      toast({
        title: "❌ Unexpected Error",
        description: "कुछ अनपेक्षित समस्या है। Page refresh करके फिर कोशिश करें।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetry = async () => {
    setConnectionStatus('checking');
    setLastError('');
    
    const networkTest = await testNetworkQuality();
    const supabaseTest = await testSupabaseConnection();
    
    setNetworkQuality(networkTest);
    
    if (networkTest.canReachSupabase && supabaseTest.success) {
      setConnectionStatus('connected');
    } else if (!networkTest.canReachSupabase) {
      setConnectionStatus('network-issue');
      setLastError(networkTest.error || 'Network issue');
    } else {
      setConnectionStatus('disconnected');
      setLastError(supabaseTest.error || 'Supabase issue');
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      {/* POWERFUL Status Display */}
      <div className={`mb-4 p-4 rounded-md border-2 ${
        connectionStatus === 'connected' ? 'bg-green-50 border-green-300' :
        connectionStatus === 'network-issue' ? 'bg-orange-50 border-orange-300' :
        connectionStatus === 'disconnected' ? 'bg-red-50 border-red-300' :
        'bg-blue-50 border-blue-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {connectionStatus === 'checking' && (
              <>
                <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-blue-700 font-semibold">Testing Connection...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-semibold">🚀 System Ready</span>
              </>
            )}
            {connectionStatus === 'network-issue' && (
              <>
                <Globe className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-orange-700 font-semibold">🌐 Network Issue</span>
              </>
            )}
            {connectionStatus === 'disconnected' && (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-700 font-semibold">⚠️ Connection Problem</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {connectionStatus !== 'connected' && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRetry}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Fix
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs"
            >
              Debug
            </Button>
          </div>
        </div>
        
        {/* Network Quality Display */}
        {networkQuality && (
          <div className="mt-2 text-xs">
            <div className="flex items-center space-x-2">
              {networkQuality.speed === 'fast' && <Zap className="h-3 w-3 text-green-500" />}
              {networkQuality.speed === 'slow' && <Wifi className="h-3 w-3 text-yellow-500" />}
              {networkQuality.speed === 'offline' && <WifiOff className="h-3 w-3 text-red-500" />}
              <span className={networkQuality.canReachSupabase ? 'text-green-600' : 'text-red-600'}>
                Network: {networkQuality.speed} ({networkQuality.latency}ms)
                {networkQuality.canReachSupabase ? ' ✅' : ' ❌'}
              </span>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {lastError && (
          <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
            <strong>Error:</strong> {lastError}
          </div>
        )}
        
        {/* Debug Info */}
        {debugMode && (
          <div className="mt-3 p-3 bg-gray-100 rounded text-xs font-mono">
            <div><strong>URL:</strong> {window.location.origin}</div>
            <div><strong>Retry Count:</strong> {retryCount}</div>
            <div><strong>Browser:</strong> {navigator.userAgent.substring(0, 30)}...</div>
            <div><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</div>
            <div><strong>Cookies:</strong> {navigator.cookieEnabled ? 'Enabled' : 'Disabled'}</div>
            <div><strong>Storage Keys:</strong> {Object.keys(localStorage).filter(k => k.includes('supabase')).length}</div>
          </div>
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
            🔧 POWERFUL Authentication System
          </p>
          <p className="text-xs text-green-600 mt-1">
            Network diagnostics, retry mechanism, aur detailed error handling के साथ!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
