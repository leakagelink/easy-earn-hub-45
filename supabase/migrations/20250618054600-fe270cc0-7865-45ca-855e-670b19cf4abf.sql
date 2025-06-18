
-- Create investment_plans table
CREATE TABLE public.investment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  daily_profit DECIMAL NOT NULL,
  validity_days INTEGER NOT NULL,
  total_income DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_investments table (renamed from investments to match code usage)
CREATE TABLE public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.investment_plans(id),
  amount DECIMAL NOT NULL,
  daily_profit DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'recharge', 'withdrawal', 'earning', 'referral', 'investment', 'profit', 'credit', 'recharge_request'
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  transaction_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  method TEXT NOT NULL, -- 'upi', 'bank'
  details JSONB, -- store UPI ID or bank details
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_requests table
CREATE TABLE public.payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.investment_plans(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  transaction_id TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  plan_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS on all tables
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_plans (public readable)
CREATE POLICY "Anyone can view investment plans" ON public.investment_plans
  FOR SELECT TO authenticated, anon USING (true);

-- RLS Policies for investments
CREATE POLICY "Users can view own investments" ON public.investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON public.investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments" ON public.investments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for withdrawals
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_requests
CREATE POLICY "Users can view own payment requests" ON public.payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment requests" ON public.payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) = 'admin@easyearn.us';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for all tables
CREATE POLICY "Admin can view all investments" ON public.investments
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can view all transactions" ON public.transactions
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can view all withdrawals" ON public.withdrawals
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can view all payment requests" ON public.payment_requests
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can manage investment plans" ON public.investment_plans
  FOR ALL USING (public.is_admin());

-- Insert some default investment plans
INSERT INTO public.investment_plans (name, price, daily_profit, validity_days, total_income) VALUES
('Plan 1', 500, 120, 7, 840),
('Plan 2', 1000, 244, 7, 1708),
('Plan 3', 2000, 504, 7, 3528),
('Plan 4', 3000, 765, 7, 5355),
('Plan 5', 5000, 1288, 7, 9016),
('Plan 6', 7000, 1622, 7, 11354),
('Plan 7', 10000, 2100, 7, 14700);
