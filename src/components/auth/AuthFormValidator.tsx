
import { useToast } from "@/components/ui/use-toast";

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
    if (mode === 'login') {
      if (loginMethod === 'email' && !email) {
        toast({
          title: "Email is required",
          variant: "destructive",
        });
        return false;
      }
      
      if (loginMethod === 'phone' && !phone) {
        toast({
          title: "Phone number is required",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Register mode
      if (!phone) {
        toast({
          title: "Phone number is required",
          variant: "destructive",
        });
        return false;
      }
      
      if (!email) {
        toast({
          title: "Email is required",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (!password) {
      toast({
        title: "Password is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return { validateForm };
};

export default useAuthFormValidator;
