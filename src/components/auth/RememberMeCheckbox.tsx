
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RememberMeCheckboxProps {
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  id?: string;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ 
  rememberMe, 
  setRememberMe, 
  id = "remember-me"
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={rememberMe}
        onCheckedChange={() => setRememberMe(!rememberMe)}
      />
      <Label 
        htmlFor={id} 
        className="text-sm text-gray-600 cursor-pointer"
      >
        Remember me
      </Label>
    </div>
  );
};

export default RememberMeCheckbox;
