"use client";

import axios from "axios"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/hooks/use-toast'
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";  // Clerk hook to get user info

// Zod schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  ssn: z.string().length(9, "SSN must be 9 characters long."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  phoneNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const OnboardingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();  // Retrieve user info from Clerk

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ssn: "",
      dateOfBirth: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Automatically set userId and email from Clerk
      const profileData = {
        ...values,
        userId: user?.id, // Clerk user ID
        email: user?.emailAddresses[0]?.emailAddress, // Clerk user email
      };

      // Post the data to the API to create the user profile
      await axios.post("/api/create-profile", profileData);

      toast({
        description: "Profile created successfully!",
      });

      router.push("/home"); // Redirect to dashboard after onboarding
    } catch (error) {
      toast({
        variant: 'destructive',
        description: "Something went wrong, please try again.",
      });
    }
  }

  return (
    <div className="h-full p-4 space-y-8 max-w-3xl mx-auto">
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-live="assertive">
      
      {/* Required Fields Section */}
      <fieldset>
        <legend className="sr-only">Required Information</legend> {/* Screen reader-only text */}
        <div className="space-y-2 w-full">
          <div>
            <h3 className="text-lg font-medium">Required Information</h3>
            <p className="text-sm text-muted-foreground">
              Please provide the following required information.
            </p>
          </div>
          <Separator className="bg-primary/10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* 2-column layout for large screens */}
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
              name="ssn"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="ssn">SSN</FormLabel>
                  <FormControl>
                    <Input id="ssn" placeholder="123-45-6789" {...field} disabled={isLoading} aria-required="true" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                  <FormControl>
                    <Input id="dateOfBirth" type="date" {...field} disabled={isLoading} aria-required="true" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </fieldset>

      {/* Separator between required and optional fields */}
      <Separator className="bg-primary/10" />

      {/* Optional Fields Section */}
      <fieldset>
        <legend className="sr-only">Optional Information</legend> {/* Screen reader-only text */}
        <div className="space-y-2 w-full">
          <div>
            <h3 className="text-lg font-medium">Optional Information</h3>
            <p className="text-sm text-muted-foreground">
              You may provide this optional information to enhance your profile.
            </p>
          </div>
          <Separator className="bg-primary/10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* 2-column layout for large screens */}
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
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={isLoading}>
        Complete Onboarding
      </Button>
    </form>
  </Form>
</div>

  );
};
