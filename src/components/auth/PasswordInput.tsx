
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
  id?: string;
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  password, 
  setPassword, 
  id = "password",
  label = "Password"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default PasswordInput;
