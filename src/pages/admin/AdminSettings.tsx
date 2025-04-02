
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    window.location.href = '/admin';
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">System Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Site Configuration</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="EasyEarn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" defaultValue="https://easyearn.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="support@easyearn.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input id="contact-phone" defaultValue="+91 9876543210" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <textarea 
                    id="site-description" 
                    rows={3} 
                    className="w-full border rounded-md p-2"
                    defaultValue="EasyEarn - Your trusted platform for online investments and earnings."
                  />
                </div>
                
                <div className="pt-2">
                  <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
              <div className="space-y-4">
                <p className="text-gray-500">Enable maintenance mode to temporarily take the site offline for updates.</p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">Enable Maintenance Mode</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Gateway Settings</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret-key">Secret Key</Label>
                    <Input id="secret-key" type="password" defaultValue="••••••••••••••••" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
                    Update Payment Settings
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="notification" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Email Notification Templates</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcome-email">Welcome Email</Label>
                  <textarea 
                    id="welcome-email" 
                    rows={5} 
                    className="w-full border rounded-md p-2"
                    defaultValue="Welcome to EasyEarn! We're excited to have you as a member. Start investing today and grow your wealth with our trusted platform."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investment-confirmation">Investment Confirmation</Label>
                  <textarea 
                    id="investment-confirmation" 
                    rows={5} 
                    className="w-full border rounded-md p-2"
                    defaultValue="Your investment of ₹{amount} in {plan} has been successfully processed. Your investment will start earning returns immediately."
                  />
                </div>
                
                <div className="pt-2">
                  <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
                    Save Templates
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
