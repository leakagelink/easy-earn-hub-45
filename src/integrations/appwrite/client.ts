
import { Client, Account, Databases, Storage, Teams } from 'appwrite';

console.log('🚀 Initializing Appwrite client...');

// Initialize Appwrite Client
export const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API Endpoint
  .setProject('68519610000f4ddaf716'); // Your project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database and Collection IDs
export const DATABASE_ID = 'easyearn_db';
export const COLLECTIONS = {
  USERS: 'users',
  INVESTMENTS: 'user_investments', 
  TRANSACTIONS: 'transactions',
  PAYMENT_REQUESTS: 'payment_requests',
  WITHDRAWALS: 'withdrawals'
};

console.log('✅ Appwrite client initialized successfully');

export default client;
