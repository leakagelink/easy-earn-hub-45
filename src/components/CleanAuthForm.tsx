
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';

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
        console.log('🔥 Starting clean registration...');
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              phone: phone.trim()
            }
          }
        });

        if (error) {
          console.error('Registration error:', error);
          
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account Already Exists",
              description: "यह email पहले से registered है। Login करें।",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Registration Failed",
              description: error.message,
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Success! 🎉",
            description: "Account बन गया है! अब login करें।"
          });
          
          // Clear form
          setEmail('');
          setPassword('');
          setPhone('');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

      } else {
        console.log('🔥 Starting clean login...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          console.error('Login error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "गलत email या password",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login Failed", 
              description: error.message,
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back!"
          });
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      
      toast({
        title: "Connection Error",
        description: "Network issue हो सकती है। फिर कोशिश करें।",
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
          disabled={isLoading}
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
