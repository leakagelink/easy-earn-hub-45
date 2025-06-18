
import React from 'react';
import { SignIn, SignUp, useUser, UserButton, useAuth } from '@clerk/clerk-react';

interface SimpleClerkAuthProps {
  mode: 'login' | 'register';
}

const SimpleClerkAuth: React.FC<SimpleClerkAuthProps> = ({ mode }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { isLoaded: authLoaded } = useAuth();

  console.log('🔍 SimpleClerkAuth Debug:', { 
    mode, 
    isSignedIn, 
    isLoaded, 
    authLoaded,
    userEmail: user?.emailAddresses?.[0]?.emailAddress 
  });

  // Show loading while Clerk is initializing
  if (!isLoaded || !authLoaded) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authentication loading करहा है...</p>
        </div>
      </div>
    );
  }

  // If user is already signed in, show welcome message
  if (isSignedIn) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">आपका स्वागत है!</h2>
          <p className="text-gray-600">
            Hello {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}!
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <UserButton afterSignOutUrl="/" />
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Dashboard पर जाएं
          </a>
        </div>
      </div>
    );
  }

  // Show the appropriate sign in/up form
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {mode === 'login' ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Login करें</h2>
            <SignIn 
              routing="hash"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/register"
              appearance={{
                elements: {
                  card: "shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3",
                  formButtonPrimary: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3",
                  footerActionLink: "text-purple-600 hover:text-purple-700",
                  formFieldInput: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500"
                }
              }}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Register करें</h2>
            <SignUp 
              routing="hash"
              fallbackRedirectUrl="/dashboard"
              signInUrl="/login"
              appearance={{
                elements: {
                  card: "shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3",
                  formButtonPrimary: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3",
                  footerActionLink: "text-purple-600 hover:text-purple-700",
                  formFieldInput: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500"
                }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Helper links */}
      <div className="text-center mt-6">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Account नहीं है?{' '}
            <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              यहाँ Register करें
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            पहले से Account है?{' '}
            <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              यहाँ Login करें
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleClerkAuth;
