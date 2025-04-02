
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const planFormSchema = z.object({
  name: z.string().min(2, {
    message: "Plan name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  minAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Minimum amount must be a positive number",
  }),
  maxAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Maximum amount must be a positive number",
  }),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Duration must be a positive number",
  }),
  returnRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Return rate must be a positive number",
  }),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

const defaultValues: Partial<PlanFormValues> = {
  name: "",
  description: "",
  minAmount: "",
  maxAmount: "",
  duration: "",
  returnRate: "",
};

interface AdminPlanFormProps {
  onSubmit: (data: PlanFormValues) => void;
  initialValues?: Partial<PlanFormValues>;
  isEdit?: boolean;
}

const AdminPlanForm = ({ 
  onSubmit, 
  initialValues = defaultValues,
  isEdit = false
}: AdminPlanFormProps) => {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: initialValues,
  });

  function handleSubmit(data: PlanFormValues) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Premium Plan" {...field} />
              </FormControl>
              <FormDescription>
                The name of the investment plan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A detailed description of the investment plan and its benefits"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide clear details about this plan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="minAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Investment (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Investment (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="returnRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">
          {isEdit ? "Update Plan" : "Create Plan"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminPlanForm;
