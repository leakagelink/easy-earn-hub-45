import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { QrCode, Wallet } from 'lucide-react';

const AdminSettings = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const { toast } = useToast();
  
  const [upiId, setUpiId] = useState(localStorage.getItem('paymentUpiId') || 'easyearn@upi');
  const [qrCodeUrl, setQrCodeUrl] = useState(localStorage.getItem('paymentQrCode') || 
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMjQuNCAyNC40aDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDI2LjZ2MjEuMWgtMjYuNnptNDguOC01My4zaDE3Ljh2MjYuNmgtMTcuOHptMjIuMiAyMi4yaDYyLjJ2MjIuMmgtMjIuMnptLTEwNi43IDI2LjZoMTMuM3YxNy44aC0xNy44em0xNy44IDB2MjIuMmgtMjIuMnYtMjIuMnptLTIyLjIgMjIuMmgyNi42djI2LjZoLTI2LjZ6bTIyLjIgMTcuOGgyMi4ydjI2LjZoLTE3Ljh6bTE3LjggMGg0OC44djE3LjhoLTQ4Ljh6bTQ4LjggMGgyMi4ydjIyLjJoLTIyLjJ6bS02Ni43IDI2LjZoMTcuOHYzMS4xaC0xNy44em0tMjYuNi0yMi4yaDI2LjZ2MjYuNmgtMjYuNnptNjIuMiAyNi42aDI2LjZ2MjYuNmgtMjYuNnptMjYuNi0yMi4yaDIyLjJ2MTcuOGgtMjIuMnptMjYuNi0yMi4yaDIyLjJ2NDQuNGgtMjIuMnptLTEzMy4zLTcxLjFoMTcuOHYxNy44aC0xNy44em0yNi42IDBoMTMuM3YxNy44aC0xMy4zem0zNS41IDQ0LjRoMjIuMnYxNy44aC0yMi4yem0tMzUuNS0xNy44aDIyLjJ2MjYuNmgtMjIuMnptMjYuNiAyNi42aDE3Ljh2MjYuNmgtMTcuOHptLTI2LjYgMjYuNmgxNy44djI2LjZoLTE3Ljh6bTY2LjcgMGgxNy44djIyLjJoLTE3Ljh6bTIyLjIgMGgyMi4ydjE3LjhoLTIyLjJ6Ii8+PC9zdmc+");
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };
  
  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrCodeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const savePaymentSettings = () => {
    localStorage.setItem('paymentUpiId', upiId);
    localStorage.setItem('paymentQrCode', qrCodeUrl);
    
    toast({
      title: "Payment settings updated",
      description: "QR code and UPI ID have been saved successfully.",
    });
  };

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
            <TabsTrigger value="payment-qr">QR & UPI</TabsTrigger>
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
          
          <TabsContent value="payment-qr" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code & UPI Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input 
                      id="upi-id" 
                      value={upiId} 
                      onChange={handleUpiIdChange}
                      placeholder="username@upi"
                    />
                    <p className="text-sm text-gray-500">
                      This UPI ID will be shown to users during payment
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={savePaymentSettings}
                      className="bg-easyearn-purple hover:bg-easyearn-darkpurple"
                    >
                      Save Payment Settings
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment QR Code</Label>
                    <div className="border rounded-md p-4 bg-white flex items-center justify-center">
                      {qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="Payment QR Code" 
                          className="w-48 h-48 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-md">
                          <p className="text-gray-500">No QR code available</p>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleQrCodeUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <Button 
                      onClick={triggerFileUpload}
                      variant="outline"
                      className="w-full"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Upload New QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Preview
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                This is how payment information will appear to users
              </p>
              
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-white p-4 rounded-md border mb-4">
                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    Scan this QR code with any UPI app to make payment
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                  <span className="text-gray-700">UPI ID:</span>
                  <span className="font-medium">{upiId}</span>
                </div>
              </div>
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
