"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Separator } from "@/components/ui/separator";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/hooks/use-toast';
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";  // Clerk hook to get user info

// Zod schema for validation of editable fields
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const ProfilePage = () => {
  const { user } = useUser();  // Clerk hook to get user info
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);  // For storing fetched profile data

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Fetch the current user's profile data from the backend API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/get-profile", {
          params: { userId: user?.id },
        });
        setInitialData(response.data);
        form.reset(response.data);  // Populate the form with existing profile data
      } catch (error) {
        toast({
          variant: 'destructive',
          description: "Failed to load profile data.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Format SSN to display only the last 4 digits
  const formatSSN = (ssn: string) => {
    if (ssn && ssn.length === 9) {
      return `***-**-${ssn.slice(-4)}`;
    }
    return "N/A";
  };

  // Submit handler for profile update
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await axios.put("/api/update-profile", {
        ...values,
        userId: user?.id,  // Automatically include userId from Clerk
      });

      toast({
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: "Something went wrong, please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      
      if (!confirmDelete) return;
  
      // Call the combined delete route
      await axios.delete("/api/delete-account");
  
      toast({
        description: "Account deleted successfully.",
      });
  
      // Optionally, redirect the user after deletion
      window.location.href = "/";
    } catch (error) {
      toast({
        variant: 'destructive',
        description: "Failed to delete account. Please try again.",
      });
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6 max-w-3xl mx-auto bg-gradient-to-t from-gray-100 via-gray-50 to-gray-100 bg-opacity-90 backdrop-blur-md shadow-md">
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-flow-col auto-cols-max gap-6">
          {/* Editable Fields Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Editable Information</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-live="assertive">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* 2-column layout for editable fields */}
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <FormControl>
                          <Input id="firstName" placeholder="First name" {...field} disabled={isLoading} aria-required="true" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <FormControl>
                          <Input id="lastName" placeholder="Last name" {...field} disabled={isLoading} aria-required="true" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                        <FormControl>
                          <Input id="phoneNumber" type="tel" placeholder="555-555-5555" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="street"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="street">Street</FormLabel>
                        <FormControl>
                          <Input id="street" placeholder="123 Main St" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <FormControl>
                          <Input id="city" placeholder="City" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="state">State</FormLabel>
                        <FormControl>
                          <Input id="state" placeholder="CA" maxLength={2} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="zipCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="zipCode">ZIP Code</FormLabel>
                        <FormControl>
                          <Input id="zipCode" placeholder="12345" maxLength={10} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" disabled={isLoading}>
                  Update Profile
                </Button>
                
                {/* Delete Account Button */}
                <Button 
                  className="m-3"
                  variant="destructive" size="lg" onClick={handleDeleteAccount} disabled={isLoading}>
                  Delete Account
                </Button>
              </form>
            </Form>
          </div>

          {/* Separator between Editable and Non-Editable Fields */}
          <Separator vertical />

          {/* Non-Editable Fields Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Uneditable Information</h2>
            <p><strong>SSN:</strong> {formatSSN(initialData?.ssn)}</p>
            <p><strong>Date of Birth:</strong> {initialData?.dateOfBirth}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
