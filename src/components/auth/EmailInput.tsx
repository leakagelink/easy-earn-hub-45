
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
    </div>
  );
};

export default EmailInput;
