
import React from 'react';
import EmailInput from './EmailInput';
import PasswordField from './PasswordField';
import LoginActionSection from './LoginActionSection';

interface EmailLoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  email,
  setEmail,
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
      <EmailInput email={email} setEmail={setEmail} />
      
      <PasswordField 
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        id="password-email"
      />
      
      <LoginActionSection
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        isLoading={isLoading}
        id="remember-me-email"
      />
    </form>
  );
};

export default EmailLoginForm;
