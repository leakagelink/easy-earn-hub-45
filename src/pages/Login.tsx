
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimpleAuthForm from '@/components/SimpleAuthForm';

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <SimpleAuthForm mode="login" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
