
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useUser, useSignIn, useSignUp } from '@clerk/clerk-react';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import NetworkStatus from '@/components/auth/NetworkStatus';
import CleanAuthInputs from '@/components/auth/CleanAuthInputs';
import CleanAuthSubmit from '@/components/auth/CleanAuthSubmit';

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
    return <LoadingState networkStatus={networkStatus} retryCount={retryCount} />;
  }

  // Show error if timeout occurred
  if (loadingTimeout || (!isLoaded && !signInLoaded && !signUpLoaded)) {
    return (
      <ErrorState 
        networkStatus={networkStatus}
        retryCount={retryCount}
        isLoaded={isLoaded}
        onRetry={handleRetry}
        onForceRefresh={handleForceRefresh}
      />
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
        <NetworkStatus networkStatus={networkStatus} />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <CleanAuthInputs
          mode={mode}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
        />

        <CleanAuthSubmit
          mode={mode}
          isLoading={isLoading}
          signInLoaded={signInLoaded}
          signUpLoaded={signUpLoaded}
        />
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
