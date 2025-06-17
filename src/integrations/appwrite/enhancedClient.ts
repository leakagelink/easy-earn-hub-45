
import { Client, Account, Databases } from 'appwrite';
import { withRetry } from '@/utils/retryUtil';
import { logNetworkDiagnostics } from '@/utils/networkDiagnostics';

class EnhancedAppwriteClient {
  private client: Client;
  private account: Account;
  private databases: Databases;
  
  constructor() {
    console.log('🚀 Initializing Enhanced Appwrite Client...');
    
    this.client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject('68519610000f4ddaf716');
    
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }
  
  async login(email: string, password: string) {
    return withRetry(async () => {
      console.log('🔑 Attempting Appwrite login...');
      await logNetworkDiagnostics();
      
      const session = await this.account.createEmailPasswordSession(email, password);
      console.log('✅ Login successful');
      return session;
    }, { maxAttempts: 3, baseDelay: 2000 });
  }
  
  async register(userId: string, email: string, password: string, name?: string) {
    return withRetry(async () => {
      console.log('📝 Attempting Appwrite registration...');
      await logNetworkDiagnostics();
      
      const user = await this.account.create(userId, email, password, name);
      console.log('✅ Registration successful');
      return user;
    }, { maxAttempts: 3, baseDelay: 2000 });
  }
  
  async getAccount() {
    return withRetry(async () => {
      return await this.account.get();
    }, { maxAttempts: 2, baseDelay: 1000 });
  }
  
  async logout() {
    return withRetry(async () => {
      return await this.account.deleteSession('current');
    }, { maxAttempts: 2, baseDelay: 1000 });
  }
  
  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return withRetry(async () => {
      console.log('📄 Creating document...');
      await logNetworkDiagnostics();
      
      return await this.databases.createDocument(databaseId, collectionId, documentId, data);
    }, { maxAttempts: 3, baseDelay: 2000 });
  }
  
  async listDocuments(databaseId: string, collectionId: string, queries?: string[]) {
    return withRetry(async () => {
      return await this.databases.listDocuments(databaseId, collectionId, queries);
    }, { maxAttempts: 3, baseDelay: 1000 });
  }
  
  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    return withRetry(async () => {
      return await this.databases.updateDocument(databaseId, collectionId, documentId, data);
    }, { maxAttempts: 3, baseDelay: 2000 });
  }
}

export const enhancedAppwriteClient = new EnhancedAppwriteClient();
