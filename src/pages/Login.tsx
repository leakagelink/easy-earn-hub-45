
import React from 'react';
import CleanAuthForm from '@/components/CleanAuthForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">वापस आपका स्वागत है!</h1>
            <p className="text-gray-600">अपने EasyEarn account में login करें</p>
          </div>
          
          <CleanAuthForm mode="login" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
