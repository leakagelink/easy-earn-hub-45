
import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';

// Payment Requests
export const createPaymentRequest = async (data: {
  user_id: string;
  plan_id: string | null;
  amount: number;
  transaction_id: string;
  payment_method: string;
}) => {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      ID.unique(),
      {
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    );
    return { data: { id: document.$id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getPaymentRequests = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      [Query.orderDesc('created_at')]
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const approvePaymentRequest = async (requestId: string) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      requestId,
      {
        status: 'approved',
        approved_at: new Date().toISOString()
      }
    );
    return { data: true, error: null };
  } catch (error) {
    return { data: false, error };
  }
};

export const rejectPaymentRequest = async (requestId: string) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      requestId,
      {
        status: 'rejected',
        approved_at: new Date().toISOString()
      }
    );
    return { data: true, error: null };
  } catch (error) {
    return { data: false, error };
  }
};

// User Investments
export const getUserInvestments = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.INVESTMENTS,
      [Query.equal('user_id', userId)]
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Transactions
export const getUserTransactions = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('created_at'),
        Query.limit(10)
      ]
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Admin functions
export const getAllUsers = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllInvestments = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.INVESTMENTS
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllWithdrawals = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WITHDRAWALS
    );
    return { data: response.documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
