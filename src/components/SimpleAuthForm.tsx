
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { registerUser, loginUser } from '@/utils/simpleAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SimpleAuthFormProps {
  mode: 'login' | 'register';
  selectedPlan?: string;
}

const SimpleAuthForm: React.FC<SimpleAuthFormProps> = ({ mode, selectedPlan }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !validateEmail(email)) {
      toast({ title: "सही email address डालें", variant: "destructive" });
      return;
    }
    
    if (!password || password.length < 8) {
      toast({ title: "Password कम से कम 8 characters का होना चाहिए", variant: "destructive" });
      return;
    }
    
    if (mode === 'register') {
      if (!phone || !validatePhone(phone)) {
        toast({ title: "सही phone number डालें (10 digits)", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords match नहीं हो रहे", variant: "destructive" });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await loginUser(email, password);
        toast({ 
          title: "✅ Login successful!",
          description: "आपका login हो गया है"
        });
        navigate('/dashboard');
      } else {
        await registerUser(email, password, phone);
        toast({ 
          title: "✅ Registration successful!", 
          description: "Account बन गया है। अब login करें।" 
        });
        
        if (selectedPlan) localStorage.setItem('selectedPlan', selectedPlan);
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: mode === 'login' ? "❌ Login Failed" : "❌ Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === 'login' ? 'अपने account में login करें' : 'नया account बनाएं'}
      </h2>
      
      {selectedPlan && (
        <div className="mb-6 p-3 bg-easyearn-purple/10 rounded-md">
          <p className="text-sm text-center text-easyearn-purple">
            आप Plan {selectedPlan} के लिए register कर रहे हैं
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="अपना email डालें"
            required
          />
        </div>
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="अपना phone number डालें"
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="अपना password डालें"
            required
          />
        </div>
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Password फिर से डालें</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Password फिर से डालें"
              required
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (mode === 'login' ? 'Login करें' : 'Register करें')}
        </Button>
        
        <div className="text-center mt-4">
          {mode === 'login' ? (
            <p className="text-sm text-gray-600">
              नया user हैं? <a href="/register" className="text-easyearn-purple hover:underline">Register करें</a>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              पहले से account है? <a href="/login" className="text-easyearn-purple hover:underline">Login करें</a>
            </p>
          )}
        </div>
      </form>
      
      {mode === 'login' && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <p><strong>Admin Credentials:</strong></p>
            <p>Email: admin@easyearn.us</p>
            <p>Password: Easy@123</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAuthForm;
