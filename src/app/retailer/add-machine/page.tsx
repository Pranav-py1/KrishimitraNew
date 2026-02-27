'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Tractor, Upload } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';

const machineSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(1, { message: 'Price must be a positive number.' }),
  imageURL: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  availability: z.boolean().default(true),
});


export default function AddMachinePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    const loading = isUserLoading || isUserDataLoading;
    if (!loading && (!user || userData?.role !== 'retailer')) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a retailer to access this page.' });
      router.push('/');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router, toast]);

  const form = useForm<z.infer<typeof machineSchema>>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      imageURL: '',
      availability: true,
    },
  });

  async function onSubmit(values: z.infer<typeof machineSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
      return;
    }
    setIsLoading(true);
    
    try {
      const machinesCollection = collection(firestore, 'machines');
      const newMachineData = {
        ...values,
        retailerId: user.uid,
        approved: false, // Listings require admin approval
        imageURL: values.imageURL || `https://picsum.photos/seed/${Math.random()}/600/400` // Placeholder for now
      };
      
      await addDocumentNonBlocking(machinesCollection, newMachineData);

      toast({
        title: 'Listing Submitted!',
        description: 'Your machine listing has been submitted for approval.',
      });
      router.push('/retailer/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your listing. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userData?.role !== 'retailer') {
    return null; // Or a more specific "Access Denied" component
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Tractor className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Add New Machine</CardTitle>
              <CardDescription>
                Fill in the details to list a new machine for rent. It will be visible to others after admin approval.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sonalika Tractor 50HP" {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Describe the machine, its condition, and any accessories included." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Day (Rs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-image-url.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      For now, please provide a URL. We will add file uploads soon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Available for Rent
                        </FormLabel>
                        <FormDescription>
                          Is this machine currently available for new bookings?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Submit for Approval'
                  )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
