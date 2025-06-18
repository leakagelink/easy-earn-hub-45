
import React from 'react';
import { SignIn, SignUp, useUser, UserButton } from '@clerk/clerk-react';

interface ClerkAuthFormProps {
  mode: 'login' | 'register';
}

const ClerkAuthForm: React.FC<ClerkAuthFormProps> = ({ mode }) => {
  const { isSignedIn, user } = useUser();

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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {mode === 'login' ? (
          <div className="p-6">
            <SignIn 
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none p-0 bg-transparent",
                  headerTitle: "text-2xl font-bold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "border border-gray-300 hover:border-easyearn-purple hover:bg-gray-50 text-gray-700",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary: "bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-3",
                  footerActionLink: "text-easyearn-purple hover:text-easyearn-darkpurple font-medium",
                  identityPreviewEditButton: "text-easyearn-purple hover:text-easyearn-darkpurple",
                  formFieldInput: "border border-gray-300 rounded-lg px-4 py-3 focus:border-easyearn-purple focus:ring-2 focus:ring-easyearn-purple/20",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  otpCodeFieldInput: "border border-gray-300 rounded-lg focus:border-easyearn-purple"
                },
                layout: {
                  socialButtonsPlacement: "top"
                }
              }}
            />
          </div>
        ) : (
          <div className="p-6">
            <SignUp 
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none p-0 bg-transparent",
                  headerTitle: "text-2xl font-bold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "border border-gray-300 hover:border-easyearn-purple hover:bg-gray-50 text-gray-700",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary: "bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-3",
                  footerActionLink: "text-easyearn-purple hover:text-easyearn-darkpurple font-medium",
                  identityPreviewEditButton: "text-easyearn-purple hover:text-easyearn-darkpurple",
                  formFieldInput: "border border-gray-300 rounded-lg px-4 py-3 focus:border-easyearn-purple focus:ring-2 focus:ring-easyearn-purple/20",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  otpCodeFieldInput: "border border-gray-300 rounded-lg focus:border-easyearn-purple"
                },
                layout: {
                  socialButtonsPlacement: "top"
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
