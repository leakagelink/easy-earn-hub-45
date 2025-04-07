
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReferralInputProps {
  referralCode: string;
  setReferralCode: (value: string) => void;
}

const ReferralInput: React.FC<ReferralInputProps> = ({ referralCode, setReferralCode }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode">Referral Code (Optional)</Label>
      <Input 
        id="referralCode" 
        type="text" 
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        placeholder="Enter referral code"
      />
    </div>
  );
};

export default ReferralInput;
