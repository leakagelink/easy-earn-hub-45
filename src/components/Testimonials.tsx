
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  name: string;
  location: string;
  testimonial: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, location, testimonial, rating }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex mb-2">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <p className="text-gray-700 mb-4 italic">"{testimonial}"</p>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
          <div>
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      testimonial: "I've been using Easy Earn for 6 months now and my daily profits have been consistently credited. Highly recommended!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      testimonial: "The customer support is excellent. Any queries I had were resolved promptly. Very satisfied with the returns too.",
      rating: 5
    },
    {
      name: "Ankit Patel",
      location: "Ahmedabad",
      testimonial: "Easy Earn has made investing simple. The UPI recharge is hassle-free and withdrawals are processed quickly.",
      rating: 4
    }
  ];

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Members Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
