
-- Check and add missing policies

-- Add missing profile policies (skip if they exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Add missing investment plan policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investment_plans' AND policyname = 'Anyone can view investment plans') THEN
        CREATE POLICY "Anyone can view investment plans" ON public.investment_plans
          FOR SELECT TO authenticated, anon USING (true);
    END IF;
END $$;

-- Add missing user investment policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_investments' AND policyname = 'Users can update own investments') THEN
        CREATE POLICY "Users can update own investments" ON public.user_investments
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create admin function (will replace if exists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) = 'admin@easyearn.us';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admin can view all profiles') THEN
        CREATE POLICY "Admin can view all profiles" ON public.profiles
          FOR ALL USING (public.is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_investments' AND policyname = 'Admin can view all investments') THEN
        CREATE POLICY "Admin can view all investments" ON public.user_investments
          FOR ALL USING (public.is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Admin can view all transactions') THEN
        CREATE POLICY "Admin can view all transactions" ON public.transactions
          FOR ALL USING (public.is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'withdrawals' AND policyname = 'Admin can view all withdrawals') THEN
        CREATE POLICY "Admin can view all withdrawals" ON public.withdrawals
          FOR ALL USING (public.is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investment_plans' AND policyname = 'Admin can manage investment plans') THEN
        CREATE POLICY "Admin can manage investment plans" ON public.investment_plans
          FOR ALL USING (public.is_admin());
    END IF;
END $$;
