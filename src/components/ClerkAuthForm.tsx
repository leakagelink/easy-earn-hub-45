
import React from 'react';
import { SignIn, SignUp, useUser, UserButton } from '@clerk/clerk-react';

interface ClerkAuthFormProps {
  mode: 'login' | 'register';
}

const ClerkAuthForm: React.FC<ClerkAuthFormProps> = ({ mode }) => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Welcome!</h2>
        <p className="text-gray-600 mb-4">
          Hello {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </p>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {mode === 'login' ? (
        <SignIn 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
              footerActionLink: 'text-purple-600 hover:text-purple-700'
            }
          }}
        />
      ) : (
        <SignUp 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
              footerActionLink: 'text-purple-600 hover:text-purple-700'
            }
          }}
        />
      )}
    </div>
  );
};

export default ClerkAuthForm;
