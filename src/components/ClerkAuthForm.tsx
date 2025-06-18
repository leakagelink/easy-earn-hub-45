
import React from 'react';
import { SignIn, SignUp, useUser, UserButton, useAuth } from '@clerk/clerk-react';

interface ClerkAuthFormProps {
  mode: 'login' | 'register';
}

const ClerkAuthForm: React.FC<ClerkAuthFormProps> = ({ mode }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { isLoaded: authLoaded } = useAuth();

  console.log('🔍 ClerkAuthForm Debug:', { 
    mode, 
    isSignedIn, 
    isLoaded, 
    authLoaded,
    userEmail: user?.emailAddresses[0]?.emailAddress 
  });

  // Loading state
  if (!isLoaded || !authLoaded) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-easyearn-purple"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600">
            Hello {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12",
                userButtonPopoverCard: "shadow-lg border border-gray-200"
              }
            }}
          />
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 bg-easyearn-purple text-white rounded-lg hover:bg-easyearn-darkpurple transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[400px]">
        {mode === 'login' ? (
          <div className="p-4 sm:p-6">
            <SignIn 
              routing="path"
              path="/login"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/register"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none p-0 bg-transparent w-full",
                  headerTitle: "text-xl sm:text-2xl font-bold text-gray-900 text-center",
                  headerSubtitle: "text-gray-600 text-center text-sm sm:text-base",
                  socialButtonsBlockButton: "w-full border border-gray-300 hover:border-easyearn-purple hover:bg-gray-50 text-gray-700 text-sm sm:text-base py-2 sm:py-3",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary: "w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-2 sm:py-3 text-sm sm:text-base",
                  footerActionLink: "text-easyearn-purple hover:text-easyearn-darkpurple font-medium text-sm",
                  identityPreviewEditButton: "text-easyearn-purple hover:text-easyearn-darkpurple",
                  formFieldInput: "w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-easyearn-purple focus:ring-2 focus:ring-easyearn-purple/20 text-sm sm:text-base",
                  formFieldLabel: "text-gray-700 font-medium text-sm sm:text-base",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-xs sm:text-sm",
                  otpCodeFieldInput: "border border-gray-300 rounded-lg focus:border-easyearn-purple text-center",
                  main: "w-full",
                  formContainer: "w-full space-y-4",
                  form: "w-full space-y-4"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: true
                }
              }}
            />
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <SignUp 
              routing="path"
              path="/register"
              fallbackRedirectUrl="/dashboard"
              signInUrl="/login"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none p-0 bg-transparent w-full",
                  headerTitle: "text-xl sm:text-2xl font-bold text-gray-900 text-center",
                  headerSubtitle: "text-gray-600 text-center text-sm sm:text-base",
                  socialButtonsBlockButton: "w-full border border-gray-300 hover:border-easyearn-purple hover:bg-gray-50 text-gray-700 text-sm sm:text-base py-2 sm:py-3",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary: "w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-2 sm:py-3 text-sm sm:text-base",
                  footerActionLink: "text-easyearn-purple hover:text-easyearn-darkpurple font-medium text-sm",
                  identityPreviewEditButton: "text-easyearn-purple hover:text-easyearn-darkpurple",
                  formFieldInput: "w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-easyearn-purple focus:ring-2 focus:ring-easyearn-purple/20 text-sm sm:text-base",
                  formFieldLabel: "text-gray-700 font-medium text-sm sm:text-base",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-xs sm:text-sm",
                  otpCodeFieldInput: "border border-gray-300 rounded-lg focus:border-easyearn-purple text-center",
                  main: "w-full",
                  formContainer: "w-full space-y-4",
                  form: "w-full space-y-4"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: true
                }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Additional helpful links */}
      <div className="text-center mt-6 space-y-2">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-easyearn-purple hover:text-easyearn-darkpurple font-medium">
              Sign up here
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-easyearn-purple hover:text-easyearn-darkpurple font-medium">
              Sign in here
            </a>
          </p>
        )}
        
        <p className="text-xs text-gray-500">
          Want to explore first?{' '}
          <a href="/" className="text-easyearn-purple hover:text-easyearn-darkpurple">
            Visit homepage
          </a>
        </p>
      </div>
    </div>
  );
};

export default ClerkAuthForm;
