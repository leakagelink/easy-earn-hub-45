
import { supabase } from '@/integrations/supabase/client';

export const supabaseService = {
  async createTransaction(data: {
    userId: string;
    type: string;
    amount: number;
    status: string;
    transactionId: string;
    paymentMethod: string;
  }) {
    try {
      const { data: result, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: data.userId,
          type: data.type,
          amount: data.amount,
          status: data.status,
          transaction_id: data.transactionId,
          payment_method: data.paymentMethod,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Transaction creation error:', error);
      return { success: false, error: error.message };
    }
  },

  async purchasePlan(data: {
    userId: string;
    planId: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
    planName: string;
  }) {
    try {
      const { data: result, error } = await supabase
        .from('payment_requests')
        .insert([{
          user_id: data.userId,
          plan_id: data.planId,
          transaction_id: data.transactionId,
          payment_method: data.paymentMethod,
          amount: data.amount,
          plan_name: data.planName,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Plan purchase error:', error);
      return { success: false, error: error.message };
    }
  },

  async updatePaymentRequest(requestId: string, updates: any) {
    try {
      const { data: result, error } = await supabase
        .from('payment_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Payment request update error:', error);
      return { success: false, error: error.message };
    }
  }
};
