
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useSignIn, useSignUp } from '@clerk/clerk-react';

interface CleanAuthFormProps {
  mode: 'login' | 'register';
}

const CleanAuthForm: React.FC<CleanAuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  // If user is already signed in, redirect
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          return;
        }

        const result = await signUp.create({
          emailAddress: email.trim(),
          password: password.trim(),
          unsafeMetadata: {
            phone: phone.trim()
          }
        });

        if (result.status === 'complete') {
          toast({
            title: "Success! 🎉",
            description: "Account successfully created!"
          });
          navigate('/dashboard');
        } else {
          // Handle email verification if needed
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
          return;
        }

        const result = await signIn.create({
          identifier: email.trim(),
          password: password.trim()
        });

        if (result.status === 'complete') {
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back!"
          });
          navigate('/dashboard');
        }
      }

    } catch (error: any) {
      console.error('Clerk auth error:', error);
      
      let errorMessage = "कुछ गलत हुआ है। फिर कोशिश करें।";
      
      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        
        if (clerkError.code === 'form_identifier_exists') {
          errorMessage = "यह email पहले से registered है। Login करें।";
        } else if (clerkError.code === 'form_password_incorrect') {
          errorMessage = "गलत password है।";
        } else if (clerkError.code === 'form_identifier_not_found') {
          errorMessage = "यह email registered नहीं है।";
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
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? '🔑 Login' : '📝 Register'}
      </h2>
      
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
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !signInLoaded || !signUpLoaded}
        >
          {isLoading ? (
            mode === 'login' ? 'Logging in...' : 'Creating account...'
          ) : (
            mode === 'login' ? 'Login' : 'Create Account'
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default CleanAuthForm;
