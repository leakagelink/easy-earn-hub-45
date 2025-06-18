
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormInputsProps {
  mode: 'login' | 'register';
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  referralCode: string;
  setReferralCode: (value: string) => void;
}

const AuthFormInputs: React.FC<AuthFormInputsProps> = ({
  mode,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  referralCode,
  setReferralCode
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">📧 Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full"
        />
      </div>
      
      {mode === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">📱 Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            required
            className="w-full"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">🔒 Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="कम से कम 6 characters"
          required
          className="w-full"
        />
      </div>
      
      {mode === 'register' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">🔒 Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Password दोबारा डालें"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-sm font-medium">🎁 Referral Code (Optional)</Label>
            <Input 
              id="referralCode" 
              type="text" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Referral code (optional)"
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AuthFormInputs;
