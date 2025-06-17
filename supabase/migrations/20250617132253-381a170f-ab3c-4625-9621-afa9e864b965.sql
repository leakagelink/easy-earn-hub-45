
-- Create payment requests table
CREATE TABLE public.payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.investment_plans(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  transaction_id TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'upi',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment requests
CREATE POLICY "Users can view own payment requests" ON public.payment_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own payment requests
CREATE POLICY "Users can insert own payment requests" ON public.payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all payment requests
CREATE POLICY "Admin can view all payment requests" ON public.payment_requests
  FOR ALL USING (public.is_admin());

-- Create function to approve payment and create investment
CREATE OR REPLACE FUNCTION public.approve_payment_request(request_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  request_data payment_requests%ROWTYPE;
  new_investment_id UUID;
  plan_data investment_plans%ROWTYPE;
BEGIN
  -- Get payment request data
  SELECT * INTO request_data FROM public.payment_requests WHERE id = request_id;
  
  IF NOT FOUND OR request_data.status != 'pending' THEN
    RETURN FALSE;
  END IF;
  
  -- Get plan data
  SELECT * INTO plan_data FROM public.investment_plans WHERE id = request_data.plan_id;
  
  -- Update payment request status
  UPDATE public.payment_requests 
  SET status = 'approved', approved_at = NOW(), approved_by = auth.uid()
  WHERE id = request_id;
  
  -- Create investment record
  INSERT INTO public.user_investments (user_id, plan_id, amount, status, purchase_date, expiry_date)
  VALUES (
    request_data.user_id,
    request_data.plan_id,
    request_data.amount,
    'active',
    NOW(),
    NOW() + INTERVAL '1 day' * plan_data.validity_days
  )
  RETURNING id INTO new_investment_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (user_id, type, amount, status)
  VALUES (request_data.user_id, 'investment', request_data.amount, 'completed');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reject payment request
CREATE OR REPLACE FUNCTION public.reject_payment_request(request_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.payment_requests 
  SET status = 'rejected', approved_at = NOW(), approved_by = auth.uid()
  WHERE id = request_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
