
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useUser();
  
  // Check if user is logged in
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Profile Settings
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <div className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50">
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50">
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  ✅ Profile managed by Clerk - secure & automatic!
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  आपका profile data safe है और automatic sync होता रहता है।
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Account settings जैसे password change, email verification आदि
                  आप Clerk के user button से कर सकते हैं।
                </p>
                
                <div className="p-4 bg-green-50 rounded-md">
                  <p className="text-sm text-green-700 font-medium">
                    🎉 Authentication Working Perfect!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Clerk authentication successfully setup और working!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
