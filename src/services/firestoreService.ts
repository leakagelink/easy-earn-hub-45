
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// Payment Requests
export const createPaymentRequest = async (data: {
  user_id: string;
  plan_id: string | null;
  amount: number;
  transaction_id: string;
  payment_method: string;
}) => {
  const docRef = await addDoc(collection(db, 'payment_requests'), {
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  });
  return { data: { id: docRef.id }, error: null };
};

export const getPaymentRequests = async () => {
  try {
    const q = query(collection(db, 'payment_requests'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const approvePaymentRequest = async (requestId: string) => {
  try {
    await updateDoc(doc(db, 'payment_requests', requestId), {
      status: 'approved',
      approved_at: new Date().toISOString()
    });
    return { data: true, error: null };
  } catch (error) {
    return { data: false, error };
  }
};

export const rejectPaymentRequest = async (requestId: string) => {
  try {
    await updateDoc(doc(db, 'payment_requests', requestId), {
      status: 'rejected',
      approved_at: new Date().toISOString()
    });
    return { data: true, error: null };
  } catch (error) {
    return { data: false, error };
  }
};

// User Investments
export const getUserInvestments = async (userId: string) => {
  try {
    const q = query(collection(db, 'user_investments'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Transactions
export const getUserTransactions = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'transactions'), 
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Admin functions (simplified for now)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllInvestments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'user_investments'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllTransactions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllWithdrawals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'withdrawals'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
