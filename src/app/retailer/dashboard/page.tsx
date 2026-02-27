'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { Loader2, PlusCircle, CheckCircle, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, query, collection, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { type Machine, type Product } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function ListingItem({ item }: { item: Machine | Product }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          <Image src={item.imageURL} alt={item.title} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground hidden md:block">{item.description.substring(0, 50)}...</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
      <TableCell className="text-right">
        {item.approved ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approved
          </Badge>
        ) : (
          <Badge variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </Badge>
        )}
      </TableCell>
    </TableRow>
  )
}


function ListingsTable({ items, type }: { items: (Machine[] | Product[]) | null, type: 'machine' | 'product' }) {
    if (!items || items.length === 0) {
        return <p className="text-muted-foreground text-center py-4">You have not listed any {type}s yet.</p>
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => <ListingItem key={item.id} item={item} />)}
            </TableBody>
        </Table>
    )
}

export default function RetailerDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  
  const retailerMachinesQuery = useMemoFirebase(() => user ? query(collection(firestore, 'machines'), where('retailerId', '==', user.uid)) : null, [firestore, user]);
  const { data: machineListings, isLoading: isLoadingMachines } = useCollection<Machine>(retailerMachinesQuery);

  const retailerProductsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'products'), where('retailerId', '==', user.uid)) : null, [firestore, user]);
  const { data: productListings, isLoading: isLoadingProducts } = useCollection<Product>(retailerProductsQuery);


  useEffect(() => {
    const loading = isUserLoading || isUserDataLoading;
    if (!loading && (!user || userData?.role !== 'retailer')) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a retailer to access this page.' });
      router.push('/');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router, toast]);

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (userData?.role !== 'retailer') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Retailer Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl">
          Manage your listings, view bookings, and track your sales.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Add new items to your inventory.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button asChild size="lg">
                  <Link href="/retailer/add-machine">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Machine
                  </Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/retailer/add-product">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                  </Link>
                </Button>
                 <Button asChild size="lg" variant="outline">
                  <Link href="/retailer/stats">
                    <BarChart className="mr-2 h-4 w-4" /> View Sales Stats
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card>
            <CardHeader>
                <CardTitle>Your Machine Listings</CardTitle>
                <CardDescription>An overview of all the machines you have listed for rent.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingMachines ? (
                    <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : (
                    <ListingsTable items={machineListings} type="machine" />
                )}
            </CardContent>
            </Card>
             <Card>
            <CardHeader>
                <CardTitle>Your Product Listings</CardTitle>
                <CardDescription>An overview of all the products you have listed for sale.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingProducts ? (
                    <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : (
                    <ListingsTable items={productListings} type="product" />
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    