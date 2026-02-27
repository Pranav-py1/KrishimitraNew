'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import type { Machine, Product } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

function ListingCard({ item, type, onApprove, onReject }: { item: Machine | Product; type: 'machine' | 'product'; onApprove: () => void; onReject: () => void; }) {
  const [isActing, setIsActing] = useState(false);

  const handleApprove = async () => {
    setIsActing(true);
    await onApprove();
    setIsActing(false);
  }

  const handleReject = async () => {
    setIsActing(true);
    await onReject();
    setIsActing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="relative aspect-video mb-4">
          <Image src={item.imageURL} alt={item.title} fill className="object-cover rounded-t-lg" />
        </div>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          Retailer ID: <code className="text-xs bg-muted p-1 rounded">{item.retailerId}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="mt-4 text-lg font-bold text-primary">₹{item.price}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleReject} disabled={isActing}>
          {isActing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button size="sm" onClick={handleApprove} disabled={isActing}>
          {isActing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}

function ListingsGrid({ items, type, onUpdate }: { items: any[] | null; type: 'machine' | 'product'; onUpdate: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleApprove = async (itemId: string) => {
    const itemRef = doc(firestore, type === 'machine' ? 'machines' : 'products', itemId);
    try {
      await updateDocumentNonBlocking(itemRef, { approved: true });
      toast({ title: 'Listing Approved', description: `The ${type} has been approved and is now live.` });
      onUpdate();
    } catch {
      toast({ variant: 'destructive', title: 'Approval Failed', description: `Could not approve the ${type}.` });
    }
  };

  const handleReject = async (itemId: string) => {
    const itemRef = doc(firestore, type === 'machine' ? 'machines' : 'products', itemId);
    try {
      await deleteDocumentNonBlocking(itemRef);
      toast({ title: 'Listing Rejected', description: `The ${type} has been removed.` });
      onUpdate();
    } catch {
      toast({ variant: 'destructive', title: 'Rejection Failed', description: `Could not reject the ${type}.` });
    }
  };
  
  if (!items || items.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No {type}s pending approval.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ListingCard
          key={item.id}
          item={item}
          type={type}
          onApprove={() => handleApprove(item.id)}
          onReject={() => handleReject(item.id)}
        />
      ))}
    </div>
  );
}


export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const unapprovedMachinesQuery = useMemoFirebase(() => query(collection(firestore, 'machines'), where('approved', '==', false)), [firestore]);
  const { data: unapprovedMachines, isLoading: isLoadingMachines, error: machinesError, forceRefetch: refetchMachines } = useCollection<Machine>(unapprovedMachinesQuery);
  
  const unapprovedProductsQuery = useMemoFirebase(() => query(collection(firestore, 'products'), where('approved', '==', false)), [firestore]);
  const { data: unapprovedProducts, isLoading: isLoadingProducts, error: productsError, forceRefetch: refetchProducts } = useCollection<Product>(unapprovedProductsQuery);


  useEffect(() => {
    const loading = isUserLoading || isUserDataLoading;
    if (!loading && (!user || userData?.role !== 'admin')) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be an admin to access this page.' });
      router.push('/');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router, toast]);

  if (isUserLoading || isUserDataLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userData.role !== 'admin') {
      return null;
  }

  const handleUpdate = () => {
    refetchMachines();
    refetchProducts();
  }

  const machineCount = unapprovedMachines?.length || 0;
  const productCount = unapprovedProducts?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <ShieldCheck className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl">
          Review and approve new listings for machines and products.
        </p>
      </div>

       <Tabs defaultValue="machines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="machines">
            Machine Listings {machineCount > 0 && <Badge className="ml-2">{machineCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="products">
            Product Listings {productCount > 0 && <Badge className="ml-2">{productCount}</Badge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="machines">
          {(isLoadingMachines || isUserDataLoading) ? (
            <div className="flex justify-center mt-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ListingsGrid items={unapprovedMachines} type="machine" onUpdate={handleUpdate} />
          )}
           {machinesError && <p className="text-destructive text-center mt-4">Could not load machine listings.</p>}
        </TabsContent>
        <TabsContent value="products">
          {(isLoadingProducts || isUserDataLoading) ? (
            <div className="flex justify-center mt-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ListingsGrid items={unapprovedProducts} type="product" onUpdate={handleUpdate} />
          )}
          {productsError && <p className="text-destructive text-center mt-4">Could not load product listings.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    