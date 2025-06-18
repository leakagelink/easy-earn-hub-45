
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentAuth } from '@/utils/simpleAuth';
import PaymentInstructions from "@/components/recharge/PaymentInstructions";

const Recharge = () => {
  const navigate = useNavigate();
  const auth = getCurrentAuth();
  
  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate('/login');
    }
  }, [auth, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Recharge Account
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recharge Form</h2>
            <p className="text-gray-600">
              Recharge functionality will be available after payment integration.
            </p>
          </div>
          <PaymentInstructions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recharge;
