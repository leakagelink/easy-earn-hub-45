
import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedPlan = query.get('plan');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
        <div className="max-w-md mx-auto">
          <AuthForm mode="register" selectedPlan={selectedPlan || undefined} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
