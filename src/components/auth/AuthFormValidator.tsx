
import { useToast } from "@/hooks/use-toast";

interface ValidateFormProps {
  mode: 'login' | 'register';
  loginMethod: 'email' | 'phone';
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const useAuthFormValidator = () => {
  const { toast } = useToast();
  
  const validateForm = ({
    mode,
    loginMethod,
    email,
    phone,
    password,
    confirmPassword
  }: ValidateFormProps) => {
    // Basic field validation
    if (mode === 'login') {
      if (loginMethod === 'email' && !email.trim()) {
        toast({ title: "Email जरूरी है", variant: "destructive" });
        return false;
      }
      if (loginMethod === 'phone' && !phone.trim()) {
        toast({ title: "Phone number जरूरी है", variant: "destructive" });
        return false;
      }
    } else {
      if (!phone.trim()) {
        toast({ title: "Phone number जरूरी है", variant: "destructive" });
        return false;
      }
      if (!email.trim()) {
        toast({ title: "Email जरूरी है", variant: "destructive" });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords match नहीं हो रहे", variant: "destructive" });
        return false;
      }
    }
    
    if (!password.trim()) {
      toast({ title: "Password जरूरी है", variant: "destructive" });
      return false;
    }
    
    return true;
  };
  
  return { validateForm };
};

export default useAuthFormValidator;
