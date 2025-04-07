
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginForm } from './useLoginForm';
import LoginHeader from './LoginHeader';
import PhoneLoginForm from './PhoneLoginForm';
import EmailLoginForm from './EmailLoginForm';
import LoginFooter from './LoginFooter';

const LoginForm: React.FC = () => {
  const { 
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    showPassword, rememberMe, 
    setRememberMe, isLoading,
    loginMethod, setLoginMethod,
    togglePasswordVisibility,
    handleLogin
  } = useLoginForm();
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <LoginHeader />
      
      <div className="p-8">
        <Tabs defaultValue="phone" className="mb-6" onValueChange={(value) => setLoginMethod(value as 'phone' | 'email')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone" className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone">
            <PhoneLoginForm
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              isLoading={isLoading}
              handleLogin={handleLogin}
            />
          </TabsContent>
          <TabsContent value="email">
            <EmailLoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              isLoading={isLoading}
              handleLogin={handleLogin}
            />
          </TabsContent>
        </Tabs>
        
        <LoginFooter />
      </div>
    </div>
  );
};

export default LoginForm;
