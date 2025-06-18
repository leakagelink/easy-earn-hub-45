
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { enhancedRegister, enhancedLogin } from '@/utils/authUtils';
import { testSupabaseConnection } from '@/utils/connectionUtils';
import { testNetworkQuality } from '@/utils/networkUtils';
import ConnectionStatusDisplay from './auth/ConnectionStatusDisplay';
import NetworkQualityInfo from './auth/NetworkQualityInfo';
import DebugInfo from './auth/DebugInfo';
import AuthFormInputs from './auth/AuthFormInputs';
import AuthFormSubmit from './auth/AuthFormSubmit';

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
        
        if (networkTest.canReachSupabase && supabaseTest.isConnected) {
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
    
    if (networkTest.canReachSupabase && supabaseTest.isConnected) {
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
      <ConnectionStatusDisplay
        connectionStatus={connectionStatus}
        onRetry={handleRetry}
        onToggleDebug={() => setDebugMode(!debugMode)}
        lastError={lastError}
      />
      
      <NetworkQualityInfo networkQuality={networkQuality} />
      
      <DebugInfo debugMode={debugMode} retryCount={retryCount} />

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
        <AuthFormInputs
          mode={mode}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
        />
        
        <AuthFormSubmit
          mode={mode}
          isLoading={isLoading}
          connectionStatus={connectionStatus}
        />
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
