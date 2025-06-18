
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CleanAuthInputsProps {
  mode: 'login' | 'register';
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
}

const CleanAuthInputs: React.FC<CleanAuthInputsProps> = ({
  mode,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  isLoading
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CleanAuthInputs;
