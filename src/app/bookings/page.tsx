'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type Booking, type SoilTest } from '@/lib/data';
import { History, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

type DisplayBooking = Omit<Booking, 'machineId' | 'farmerId' | 'retailerId' | 'type'> & {
    costDisplay: string;
};

const getStatusVariant = (status: Booking['status'] | SoilTest['status']) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Confirmed':
      return 'secondary';
    case 'Pending':
      return 'outline';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

function BookingsTable({ bookings, isLoading }: { bookings: DisplayBooking[] | null, isLoading: boolean }) {
  if (isLoading) {
    return (
       <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }
  
  if (!bookings || bookings.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No bookings found in this category.</p>
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.itemName}</TableCell>
              <TableCell>{format(parseISO(booking.bookingDate), 'PPP')}</TableCell>
              <TableCell>{booking.costDisplay}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default function BookingsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const bookingsQuery = useMemoFirebase(
    () => {
      if (!user || !userData) return null;
      // If the user is a business role, filter by retailerId. Otherwise (farmers/consumers), filter by farmerId.
      if (['exporter', 'supplier'].includes(userData.role)) {
          return query(collection(firestore, 'bookings'), where('retailerId', '==', user.uid));
      }
      return query(collection(firestore, 'bookings'), where('farmerId', '==', user.uid));
    },
    [firestore, user, userData]
  );
  
  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useCollection<Booking>(bookingsQuery);
  
  const soilTestsQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'soilTests'), where('farmerId', '==', user.uid))
        : null,
    [firestore, user]
  );

  const { data: soilTests, isLoading: isLoadingSoilTests, error: soilTestsError } = useCollection<SoilTest>(soilTestsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/bookings');
    }
  }, [user, isUserLoading, router]);

  const machineBookings: DisplayBooking[] | null = useMemo(() => {
    if (!bookings) return null;
    return bookings
      .filter((b) => b.type === 'Machine')
      .map(b => ({
          ...b,
          costDisplay: `₹${b.totalCost.toLocaleString()}`
      }));
  }, [bookings]);

  const serviceBookings: DisplayBooking[] | null = useMemo(() => {
    if (!soilTests) return null;
    return soilTests.map(st => ({
        id: st.id,
        itemName: `Soil Test at ${st.location}`,
        bookingDate: st.preferredDate,
        totalCost: 0,
        status: st.status as Booking['status'],
        costDisplay: 'N/A'
    }));
  }, [soilTests]);
  
  const isLoading = isUserLoading || isUserDataLoading || isLoadingBookings || isLoadingSoilTests;

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const error = bookingsError || soilTestsError;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
       <div className="mb-8 flex flex-col items-center text-center">
         <History className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Activity History
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl">
          {['exporter', 'supplier'].includes(userData?.role)
            ? 'Track all requests for your services and products.'
            : 'Track all your machine rentals and service requests in one place.'}
        </p>
      </div>
      
      <Tabs defaultValue="machines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="machines">Machine Bookings</TabsTrigger>
          <TabsTrigger value="services">Service Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="machines">
          <BookingsTable bookings={machineBookings} isLoading={isLoadingBookings} />
        </TabsContent>
        <TabsContent value="services">
          <BookingsTable bookings={serviceBookings} isLoading={isLoadingSoilTests} />
        </TabsContent>
      </Tabs>

      {error && (
        <p className="text-center text-destructive mt-8">Could not load history. Please try again later.</p>
      )}
    </div>
  );
}
