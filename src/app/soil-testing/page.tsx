'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FlaskConical, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';

const soilTestSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid 10-digit phone number.' }).max(10),
  address: z.string().min(10, { message: 'Please enter a valid address.' }),
  pincode: z.string().length(6, { message: 'Pincode must be 6 digits.' }),
  preferredDate: z.date({
    required_error: 'A preferred date is required.',
  }),
});

export default function SoilTestingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/soil-testing');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof soilTestSchema>>({
    resolver: zodResolver(soilTestSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      phone: user?.phoneNumber?.substring(3) || '', // Assuming +91 prefix
      address: '',
      pincode: '',
    },
  });

  useEffect(() => {
    if(user) {
      form.reset({
        fullName: user.displayName || '',
        phone: user.phoneNumber?.substring(3) || '',
        address: '',
        pincode: '',
      })
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof soilTestSchema>) {
    if (isUserLoading || !user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Please wait for your session to initialize.' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const soilTestCollection = collection(firestore, 'soilTests');
      const newSoilTest = {
        farmerId: user.uid,
        location: `${values.address}, ${values.pincode}`,
        preferredDate: values.preferredDate.toISOString(),
        status: 'Pending',
        farmerName: values.fullName, 
        farmerPhone: `+91${values.phone}`
      };
      
      await addDocumentNonBlocking(soilTestCollection, newSoilTest);

      toast({
        title: 'Booking Confirmed!',
        description: `Your soil test has been booked for ${format(values.preferredDate, 'PPP')}.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'Could not book the soil test. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <FlaskConical className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Book a Soil Test</CardTitle>
          <CardDescription>
            Understand your soil better to improve crop yield. Fill out the form below to book an offline test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                       <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                            +91
                          </span>
                          <Input placeholder="98765 43210" {...field} className="pl-10" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your farm or home address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your 6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                     <FormDescription>Our team will visit you on or around this date.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Book Now'
                  )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}