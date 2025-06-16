import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { QrCode, Wallet, Lock, ShieldAlert } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AdminSettings = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const { toast } = useToast();
  
  const [upiId, setUpiId] = useState(localStorage.getItem('paymentUpiId') || 'dheerajtagde@ybl');
  const [qrCodeUrl, setQrCodeUrl] = useState(localStorage.getItem('paymentQrCode') || '/lovable-uploads/c3bb9200-c561-4fcc-8802-68d2f7d2d937.png');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(localStorage.getItem('maintenanceMode') === 'true');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Set default values on component mount if not already set
  useEffect(() => {
    if (!localStorage.getItem('paymentUpiId')) {
      localStorage.setItem('paymentUpiId', 'dheerajtagde@ybl');
    }
    if (!localStorage.getItem('paymentQrCode')) {
      localStorage.setItem('paymentQrCode', '/lovable-uploads/c3bb9200-c561-4fcc-8802-68d2f7d2d937.png');
    }
  }, []);
  
  useEffect(() => {
    // Apply maintenance mode class to body if it's enabled
    if (maintenanceMode) {
      document.body.classList.add('maintenance-mode');
    } else {
      document.body.classList.remove('maintenance-mode');
    }
  }, [maintenanceMode]);
  
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
  
  const toggleMaintenanceMode = () => {
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);
    localStorage.setItem('maintenanceMode', String(newMode));
    
    toast({
      title: newMode ? "Maintenance mode enabled" : "Maintenance mode disabled",
      description: newMode ? "Site is now in maintenance mode" : "Site is now accessible to all users",
    });
  };
  
  const onSubmitPasswordChange = (values: z.infer<typeof passwordSchema>) => {
    const currentPassword = "Easy@123";  // Current admin password
    
    if (values.currentPassword !== currentPassword) {
      toast({
        title: "Password change failed",
        description: "Current password is incorrect",
        variant: "destructive",
      });
      return;
    }
    
    // Update the password in localStorage
    localStorage.setItem('adminPassword', values.newPassword);
    
    toast({
      title: "Password updated successfully",
      description: "Your admin password has been changed",
    });
    
    setPasswordDialogOpen(false);
    form.reset();
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
            <TabsTrigger value="security">Security</TabsTrigger>
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
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Maintenance Mode
              </h2>
              <div className="space-y-4">
                <p className="text-gray-500">
                  Enable maintenance mode to temporarily take the site offline for updates. 
                  Users will see a maintenance message when they try to access the site.
                </p>
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="maintenance-mode"
                    checked={maintenanceMode}
                    onCheckedChange={toggleMaintenanceMode}
                  />
                  <Label htmlFor="maintenance-mode">
                    {maintenanceMode ? "Maintenance Mode Active" : "Maintenance Mode Disabled"}
                  </Label>
                </div>
                <div className={`p-4 mt-4 rounded-md ${maintenanceMode ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"}`}>
                  <p className="text-sm">
                    {maintenanceMode 
                      ? "⚠️ Maintenance mode is currently ACTIVE. Users cannot access the site."
                      : "✅ Site is fully operational and accessible to all users."}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Security
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Admin Login Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">admin@easyearn.us</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Password</p>
                      <p className="font-medium">••••••••</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={() => setPasswordDialogOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Change Admin Password
                  </Button>
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
      
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password for your admin account.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 6 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Change Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSettings;
