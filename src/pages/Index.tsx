
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";

const Index = () => {
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

  const features = [
    {
      title: "Daily Profits",
      description: "Earn daily profits into your account that you can withdraw anytime."
    },
    {
      title: "Referral Program",
      description: "Earn commissions for referring friends with our 3-level referral system."
    },
    {
      title: "Easy Recharge",
      description: "Recharge your account easily using UPI or QR code payments."
    },
    {
      title: "Quick Withdrawals",
      description: "Withdraw your earnings to your bank account or UPI at any time."
    },
    {
      title: "User Dashboard",
      description: "Track your earnings and returns in a well-designed dashboard."
    },
    {
      title: "365 Days Validity",
      description: "All plans come with a full year of validity to maximize your earnings."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="gradient-bg py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Start Earning Daily Profits
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Choose from our investment plans and earn daily profits with Easy Earn. Simple, transparent, and reliable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-easyearn-purple hover:bg-gray-100">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                How Easy Earn Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in just a few simple steps and begin earning daily profits.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-easyearn-purple">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Plan</h3>
                <p className="text-gray-600">
                  Select an investment plan that suits your budget and earning goals.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-easyearn-purple">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Make Payment</h3>
                <p className="text-gray-600">
                  Recharge your account using UPI or scanning our QR code.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-easyearn-purple">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Daily</h3>
                <p className="text-gray-600">
                  Start earning daily profits and withdraw to your bank or UPI.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Investment Plans Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Investment Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your investment goals and start earning daily.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                What makes Easy Earn the preferred platform for smart investors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-easyearn-purple mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="gradient-bg py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who are earning daily profits with Easy Earn.
            </p>
            <Button asChild size="lg" className="bg-white text-easyearn-purple hover:bg-gray-100">
              <Link to="/register">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
