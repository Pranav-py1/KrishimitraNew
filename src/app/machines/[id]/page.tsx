'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { type Machine } from '@/lib/data';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function MachineDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);

  const machineId = Array.isArray(id) ? id[0] : id;

  const machineDocRef = useMemoFirebase(
    () => (user && machineId ? doc(firestore, 'machines', machineId) : null),
    [firestore, machineId, user]
  );

  const { data: machine, isLoading, error } = useDoc<Machine>(machineDocRef);

  const handleBooking = async () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Login Required',
            description: 'You need to be logged in to book a machine.',
        });
        router.push(`/login?redirect=/machines/${machineId}`);
        return;
    }
      
    if (!machine || !date) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Please select a date to continue.',
      });
      return;
    }
    setIsBooking(true);

    try {
        const bookingsCollection = collection(firestore, 'bookings');
        const newBooking = {
            farmerId: user.uid,
            machineId: machine.id,
            retailerId: machine.retailerId, // Crucial for History page filtering
            itemName: machine.title,
            type: 'Machine' as const,
            bookingDate: date.toISOString().split('T')[0], // Store date as YYYY-MM-DD
            totalCost: machine.price,
            status: 'Pending' as const,
        };

        await addDocumentNonBlocking(bookingsCollection, newBooking);

        toast({
            title: 'Booking Request Sent!',
            description: `Your request for ${machine.title} on ${format(date, 'PPP')} has been sent.`,
        });
        router.push('/bookings');
    } catch (e) {
        toast({
            variant: 'destructive',
            title: 'Booking Failed',
            description: 'Could not complete your booking request. Please try again.',
        });
    } finally {
        setIsBooking(false);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive mt-8">Error loading machine details.</p>;
  }

  if (!machine) {
    return <p className="text-center text-muted-foreground mt-8">Machine not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image
                src={machine.imageURL}
                alt={machine.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-6">
                 <CardTitle className="text-3xl font-headline mb-2">{machine.title}</CardTitle>
                <CardDescription>{machine.description}</CardDescription>
            </div>
          </CardContent>
            <CardFooter className="bg-secondary/50 p-4 flex justify-end">
                <p className="text-2xl font-bold text-primary">
                    Rs{machine.price}
                    <span className="text-base font-normal text-muted-foreground">/day</span>
                </p>
            </CardFooter>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Book this Machine</CardTitle>
                <CardDescription>Select a date to request a booking.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
            </CardContent>
            <CardFooter className="flex-col items-stretch">
                <Button onClick={handleBooking} disabled={isBooking || !date}>
                    {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarIcon className="mr-2 h-4 w-4" />}
                    Book for {date ? format(date, 'PPP') : '...'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
