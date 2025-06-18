
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import PlanCard from '@/components/PlanCard';
import TrustBadges from '@/components/TrustBadges';
import Testimonials from '@/components/Testimonials';
import SocialProof from '@/components/SocialProof';
import FAQ from '@/components/FAQ';
import { useIsMobile } from '@/hooks/use-mobile';
import { APP_CONFIG } from '@/config/appConfig';

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

  const plans = APP_CONFIG.investmentPlans;

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
              daily_profit={plan.dailyProfit}
              validity_days={plan.validityDays}
              total_income={plan.totalIncome}
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
