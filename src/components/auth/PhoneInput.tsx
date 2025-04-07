
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  phone: string;
  setPhone: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ phone, setPhone }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>
        <Input 
          id="phone" 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
