
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const teamMembers = [
    {
      name: 'Rahul Sharma',
      position: 'Founder & CEO',
      bio: 'Rahul has 10+ years of experience in financial investments and technology',
    },
    {
      name: 'Priya Patel',
      position: 'Chief Financial Officer',
      bio: 'Priya is an expert in financial management with a background in top investment firms',
    },
    {
      name: 'Amit Singh',
      position: 'Customer Support Head',
      bio: 'Amit ensures all members receive excellent support and prompt resolution',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="gradient-bg py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              About Easy Earn
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your trusted platform for smart investments and daily profits.
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Easy Earn was founded in 2020 with a simple mission: to make investment opportunities accessible to everyone. We believe that financial growth should not be limited to those with extensive knowledge of complex financial markets or those with large capital to invest.
                </p>
                <p>
                  Our platform offers carefully structured membership plans that provide regular returns without the need for you to actively manage investments or understand complicated financial instruments. We've simplified the process so you can focus on your daily life while your money works for you.
                </p>
                <p>
                  With a team of experienced financial experts, we have built a sustainable model that allows our members to earn daily profits through various investment channels that we manage on their behalf.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Why Choose Easy Earn
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-easyearn-purple">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Transparent & Reliable</h3>
                  <p className="text-gray-600 text-center">
                    Our platform is built on transparency. We clearly state the returns you can expect and ensure timely payments.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-easyearn-purple">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">User-Friendly Platform</h3>
                  <p className="text-gray-600 text-center">
                    We've designed our platform to be intuitive and easy to use for everyone, regardless of technical expertise.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-easyearn-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-easyearn-purple">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Dedicated Support</h3>
                  <p className="text-gray-600 text-center">
                    Our customer support team is always ready to assist you with any questions or concerns you may have.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Meet Our Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold mb-1 text-center">{member.name}</h3>
                    <p className="text-easyearn-purple text-center mb-3">{member.position}</p>
                    <p className="text-gray-600 text-center">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">How does Easy Earn work?</h3>
                <p className="text-gray-600">
                  Easy Earn pools investments from multiple members and invests them in various carefully selected opportunities. The returns generated are distributed to members based on their chosen membership plan.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Are my investments safe?</h3>
                <p className="text-gray-600">
                  We prioritize the security of your investments by implementing robust risk management strategies and diversifying across multiple assets to minimize potential risks.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">How do I receive my profits?</h3>
                <p className="text-gray-600">
                  Your daily profits are automatically credited to your Easy Earn wallet. You can withdraw them to your bank account or UPI at any time through our simple withdrawal process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">How does the referral system work?</h3>
                <p className="text-gray-600">
                  Our 3-level referral system allows you to earn commissions when people you refer join our platform. You earn 10% of the investment amount of your direct referrals (Level 1), 5% from Level 2 referrals, and 2% from Level 3 referrals.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Contact Us
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We're here to answer any questions you may have about our platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-600">support@easyearn.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-600">+91 1234567890</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
