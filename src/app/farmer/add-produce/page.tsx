'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Wheat } from 'lucide-react';
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
import { doc, collection } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';

const produceSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(1, { message: 'Price must be a positive number.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1.' }),
  unit: z.string().min(1, { message: 'Please specify a unit (e.g., kg, quintal, dozen).' }),
  imageURL: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  status: z.enum(['Available', 'Sold Out']).default('Available'),
});


export default function AddProducePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

   useEffect(() => {
    const loading = isUserLoading || isUserDataLoading;
    if (!loading && (!user || userData?.role !== 'farmer')) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a farmer to access this page.' });
      router.push('/');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router, toast]);

  const form = useForm<z.infer<typeof produceSchema>>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      quantity: 1,
      unit: 'kg',
      imageURL: '',
      status: 'Available',
    },
  });
  
  async function onSubmit(values: z.infer<typeof produceSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
      return;
    }
    setIsLoading(true);
    
    try {
      const produceCollection = collection(firestore, 'produce');
      const newProduceData = {
        ...values,
        farmerId: user.uid,
        approved: false, // Listings require admin approval
        imageURL: values.imageURL || `https://picsum.photos/seed/${Math.random()}/600/600`
      };
      
      await addDocumentNonBlocking(produceCollection, newProduceData);

      toast({
        title: 'Produce Submitted!',
        description: 'Your produce listing has been submitted for approval.',
      });
      router.push('/farmer/dashboard');
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

  if (userData?.role !== 'farmer') {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Wheat className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>List Your Produce</CardTitle>
              <CardDescription>
                Fill in the details to sell your produce in the farmer market. It will be visible after admin approval.
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
                    <FormLabel>Produce Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fresh Organic Tomatoes" {...field} />
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
                      <Textarea placeholder="Describe your produce, its quality, and any other details." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 50" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., kg, quintal" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
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
                      Provide a URL for your produce image.
                    </FormDescription>
                    <FormMessage />
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
