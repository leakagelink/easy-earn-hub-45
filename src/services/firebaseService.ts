
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export const firebaseService = {
  // User operations
  async createUser(userData: any) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
  },

  // Investment operations
  async createInvestment(investmentData: any) {
    try {
      const docRef = await addDoc(collection(db, 'investments'), {
        ...investmentData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating investment:', error);
      return { success: false, error };
    }
  },

  // Transaction operations
  async createTransaction(transactionData: any) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { success: false, error };
    }
  },

  // Payment operations
  async createPaymentRequest(paymentData: any) {
    try {
      const docRef = await addDoc(collection(db, 'paymentRequests'), {
        ...paymentData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating payment request:', error);
      return { success: false, error };
    }
  },

  async getPaymentRequests() {
    try {
      const q = query(collection(db, 'paymentRequests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting payment requests:', error);
      return [];
    }
  },

  async updatePaymentRequest(id: string, updates: any) {
    try {
      await updateDoc(doc(db, 'paymentRequests', id), updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating payment request:', error);
      return { success: false, error };
    }
  },

  // Plan operations
  async purchasePlan(planData: any) {
    try {
      const docRef = await addDoc(collection(db, 'paymentRequests'), {
        ...planData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error purchasing plan:', error);
      return { success: false, error };
    }
  }
};
