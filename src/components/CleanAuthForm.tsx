
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useSignIn, useSignUp } from '@clerk/clerk-react';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface CleanAuthFormProps {
  mode: 'login' | 'register';
}

const CleanAuthForm: React.FC<CleanAuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  console.log('🔍 CleanAuthForm Debug:', { 
    mode, 
    isSignedIn, 
    isLoaded, 
    signInLoaded, 
    signUpLoaded,
    loadingTimeout,
    retryCount,
    networkStatus,
    userEmail: user?.emailAddresses?.[0]?.emailAddress 
  });

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle loading timeout
  useEffect(() => {
    if (!isLoaded) {
      const timeout = setTimeout(() => {
        console.log('⚠️ Clerk loading timeout after 10 seconds');
        setLoadingTimeout(true);
      }, 10000);
      
      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoaded]);

  // If user is already signed in, redirect
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      console.log('✅ User already signed in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isSignedIn, isLoaded, navigate]);

  const handleRetry = () => {
    console.log('🔄 Retrying Clerk initialization...');
    setRetryCount(prev => prev + 1);
    setLoadingTimeout(false);
    window.location.reload();
  };

  const handleForceRefresh = () => {
    console.log('🌀 Force refreshing page...');
    window.location.href = window.location.href;
  };

  // Show loading with timeout handling
  if (!isLoaded && !loadingTimeout) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-easyearn-purple" />
          <p className="text-gray-600 mb-2">Authentication loading कर रहा है...</p>
          <div className="text-xs text-gray-500">
            {!networkStatus && (
              <div className="flex items-center justify-center text-red-500 mb-2">
                <WifiOff className="h-4 w-4 mr-1" />
                Network offline है
              </div>
            )}
            <p>Retry count: {retryCount}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if timeout occurred
  if (loadingTimeout || (!isLoaded && !signInLoaded && !signUpLoaded)) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Load नहीं हो रहा
          </h3>
          <p className="text-gray-600 mb-4">
            Clerk authentication system load नहीं हो पा रहा है। कृपया retry करें।
          </p>
          
          {!networkStatus && (
            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <div className="flex items-center text-red-700">
                <WifiOff className="h-4 w-4 mr-2" />
                <span className="text-sm">Internet connection check करें</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry करें
            </Button>
            
            <Button
              onClick={handleForceRefresh}
              variant="outline"
              className="w-full"
            >
              Page Refresh करें
            </Button>
            
            <div className="text-xs text-gray-500 mt-4">
              <p>Debug Info:</p>
              <p>Retry Count: {retryCount}</p>
              <p>Network: {networkStatus ? 'Online' : 'Offline'}</p>
              <p>Clerk Loaded: {isLoaded ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started:', { mode, email, phone });
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email और password जरूरी है",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'register' && !phone) {
      toast({
        title: "Error", 
        description: "Phone number जरूरी है",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password कम से कम 6 characters का होना चाहिए",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        console.log('🔥 Starting Clerk registration...');
        
        if (!signUp || !signUpLoaded) {
          toast({
            title: "Error",
            description: "Registration system loading... कृपया wait करें",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const result = await signUp.create({
          emailAddress: email.trim(),
          password: password.trim(),
          unsafeMetadata: {
            phone: phone.trim()
          }
        });

        console.log('📊 SignUp result:', result);

        if (result.status === 'complete') {
          toast({
            title: "Success! 🎉",
            description: "Account successfully created!"
          });
          navigate('/dashboard');
        } else if (result.status === 'missing_requirements') {
          toast({
            title: "Verification Required",
            description: "Please check your email to verify your account"
          });
        }

      } else {
        console.log('🔥 Starting Clerk login...');
        
        if (!signIn || !signInLoaded) {
          toast({
            title: "Error",
            description: "Login system loading... कृपया wait करें",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const result = await signIn.create({
          identifier: email.trim(),
          password: password.trim()
        });

        console.log('📊 SignIn result:', result);

        if (result.status === 'complete') {
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back!"
          });
          navigate('/dashboard');
        }
      }

    } catch (error: any) {
      console.error('❌ Clerk auth error:', error);
      
      let errorMessage = "कुछ गलत हुआ है। फिर कोशिश करें।";
      
      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        console.log('🔍 Clerk error details:', clerkError);
        
        if (clerkError.code === 'form_identifier_exists') {
          errorMessage = "यह email पहले से registered है। Login करें।";
        } else if (clerkError.code === 'form_password_incorrect') {
          errorMessage = "गलत password है।";
        } else if (clerkError.code === 'form_identifier_not_found') {
          errorMessage = "यह email registered नहीं है।";
        } else if (clerkError.code === 'form_password_pwned') {
          errorMessage = "यह password बहुत common है। दूसरा password choose करें।";
        } else {
          errorMessage = clerkError.message || errorMessage;
        }
      }
      
      toast({
        title: mode === 'login' ? "Login Failed" : "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'login' ? '🔑 Login' : '📝 Register'}
        </h2>
        <div className="flex items-center text-xs text-gray-500">
          {networkStatus ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        {mode === 'register' && (
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
          disabled={isLoading || !signInLoaded || !signUpLoaded}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {mode === 'login' ? 'Logging in...' : 'Creating account...'}
            </span>
          ) : (
            mode === 'login' ? '🚀 Login करें' : '🎯 Create Account'
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-easyearn-purple hover:underline">
              Register here
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-easyearn-purple hover:underline">
              Login here
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default CleanAuthForm;
