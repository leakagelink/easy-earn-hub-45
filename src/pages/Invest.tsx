
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import PlanCard from '@/components/PlanCard';
import TrustBadges from '@/components/TrustBadges';
import Testimonials from '@/components/Testimonials';
import SocialProof from '@/components/SocialProof';
import FAQ from '@/components/FAQ';
import { useIsMobile } from '@/hooks/use-mobile';

const Invest = () => {
  const isMobile = useIsMobile();
  const plansSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the plans section on mobile devices after component mount
    if (isMobile && plansSectionRef.current) {
      setTimeout(() => {
        plansSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isMobile]);

  const plans = [
    {
      id: 1,
      name: "Plan 1",
      price: 500,
      dailyProfit: 120,
      validityDays: 365,
      totalIncome: 43800,
    },
    {
      id: 2,
      name: "Plan 2",
      price: 1000,
      dailyProfit: 244,
      validityDays: 365,
      totalIncome: 89060,
    },
    {
      id: 3,
      name: "Plan 3",
      price: 2000,
      dailyProfit: 504,
      validityDays: 365,
      totalIncome: 183960,
    },
    {
      id: 4,
      name: "Plan 4",
      price: 3000,
      dailyProfit: 765,
      validityDays: 365,
      totalIncome: 279225,
      isPremium: true,
    },
    {
      id: 5,
      name: "Plan 5",
      price: 5000,
      dailyProfit: 1288,
      validityDays: 365,
      totalIncome: 470120,
    },
    {
      id: 6,
      name: "Plan 6",
      price: 6000,
      dailyProfit: 1622,
      validityDays: 365,
      totalIncome: 592030,
    },
    {
      id: 7,
      name: "Plan 7",
      price: 7000,
      dailyProfit: 2100,
      validityDays: 365,
      totalIncome: 766500,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Investment Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your investment goals and start earning daily.
          </p>
        </div>
        
        <TrustBadges />
        
        <div ref={plansSectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id}
              id={plan.id}
              name={plan.name}
              price={plan.price}
              dailyProfit={plan.dailyProfit}
              validityDays={plan.validityDays}
              totalIncome={plan.totalIncome}
              isPremium={plan.isPremium}
            />
          ))}
        </div>
        
        <SocialProof />
        <Testimonials />
        <FAQ />
      </main>
    </div>
  );
};

export default Invest;
