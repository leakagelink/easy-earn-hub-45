import React from 'react';
import PhoneInput from './PhoneInput';
import PasswordField from './PasswordField';
import LoginActionSection from './LoginActionSection';

interface PhoneLoginFormProps {
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  rememberMe,
  setRememberMe,
  isLoading,
  handleLogin
}) => {
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <PhoneInput phone={phone} setPhone={setPhone} />
      
      <PasswordField 
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        id="password-phone"
      />
      
      <LoginActionSection
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        isLoading={isLoading}
        id="remember-me-phone"
      />
    </form>
  );
};

export default PhoneLoginForm;
