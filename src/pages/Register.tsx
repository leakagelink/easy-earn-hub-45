
import React from 'react';
import ClerkAuthForm from '@/components/ClerkAuthForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join EasyEarn</h1>
            <p className="text-gray-600">Create your account and start earning today</p>
          </div>
          
          <ClerkAuthForm mode="register" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
