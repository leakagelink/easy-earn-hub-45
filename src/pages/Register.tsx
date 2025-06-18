
import React from 'react';
import CleanAuthForm from '@/components/CleanAuthForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
        <div className="max-w-md mx-auto">
          <CleanAuthForm mode="register" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
