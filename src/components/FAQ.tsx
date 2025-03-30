
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I get started with Easy Earn?",
      answer: "Getting started is simple. Register an account, choose an investment plan that suits your budget, make a payment using UPI or QR code, and start earning daily profits immediately."
    },
    {
      question: "How and when will I receive my daily profits?",
      answer: "Your daily profits are automatically credited to your Easy Earn wallet every 24 hours. You can withdraw these earnings to your bank account or UPI at any time."
    },
    {
      question: "Is my investment safe with Easy Earn?",
      answer: "Yes, we prioritize the security of your investments. We implement robust security measures and diversify investments across multiple assets to minimize risks."
    },
    {
      question: "What is the minimum investment amount?",
      answer: "Our plans start from as low as ₹500, making it accessible for everyone to start their investment journey with Easy Earn."
    },
    {
      question: "How does the referral program work?",
      answer: "Our 3-level referral system allows you to earn commissions when people you refer join our platform. You earn 10% of the investment amount from your direct referrals, 5% from level 2 referrals, and 2% from level 3 referrals."
    },
    {
      question: "What is the process for withdrawals?",
      answer: "Withdrawals are simple. Go to the withdraw section in your dashboard, enter the amount you wish to withdraw, provide your bank details or UPI ID, and submit the request. Withdrawals are typically processed within 24 hours."
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
