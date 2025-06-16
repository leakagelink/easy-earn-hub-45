
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RechargeForm from "@/components/recharge/RechargeForm";
import PaymentInstructions from "@/components/recharge/PaymentInstructions";

const Recharge = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Recharge Account
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RechargeForm />
          <PaymentInstructions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recharge;
