
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  id?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  id = "password"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">Password</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <Input 
          id={id} 
          type={showPassword ? "text" : "password"} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="pl-10"
        />
        <div 
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordField;
