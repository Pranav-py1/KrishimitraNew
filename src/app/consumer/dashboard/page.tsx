'use client';

import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { query, collection, where } from 'firebase/firestore';
import { Loader2, ShoppingBag, MapPin, User, Package, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { type Sale } from '@/lib/data';
import { format } from 'date-fns';

export default function ConsumerDashboard() {
  const { user, userData, isUserLoading } = useUser();
  const firestore = useFirestore();

  const purchasesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'sales'), where('buyerId', '==', user.uid)) : null,
    [user?.uid, firestore]
  );
  const { data: purchases, isLoading: isPurchasesLoading } = useCollection<Sale>(purchasesQuery);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2 tracking-tight">Welcome, {userData.name}</h1>
          <p className="text-muted-foreground text-lg">Manage your orders and delivery details here.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full font-bold">
            <Link href="/market"><ShoppingBag className="mr-2 h-4 w-4" /> Go to Market</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2rem] bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary"><User className="h-5 w-5" /></div>
                <CardTitle className="text-xl">Your Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                <p className="font-bold">{userData.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <p className="font-bold">{user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Language</p>
                <Badge variant="secondary" className="rounded-lg">{userData.preferredLanguage}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary"><MapPin className="h-5 w-5" /></div>
                <CardTitle className="text-xl">Delivery Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-2xl border border-dashed">
                <p className="font-medium text-sm leading-relaxed italic text-muted-foreground">
                  {userData.location?.address || 'No detailed address provided.'}
                </p>
                <div className="mt-4 pt-4 border-t border-dashed space-y-2">
                  <p className="text-sm font-bold">Village: <span className="font-normal">{userData.location?.village || 'N/A'}</span></p>
                  <p className="text-sm font-bold">Taluka: <span className="font-normal">{userData.location?.taluka || 'N/A'}</span></p>
                  <p className="text-sm font-bold">District: <span className="font-normal">{userData.location?.district || 'N/A'}</span></p>
                  <p className="text-sm font-bold">Pincode: <span className="font-normal">{userData.location?.pincode || 'N/A'}</span></p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-primary font-bold hover:bg-primary/5 rounded-xl">Update Address</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-soft rounded-[2rem] h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Orders</CardTitle>
                <CardDescription>Track your purchases from local farmers.</CardDescription>
              </div>
              <Package className="h-8 w-8 text-primary/20" />
            </CardHeader>
            <CardContent>
              {isPurchasesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !purchases || purchases.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-4 border-dashed">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-bold text-muted-foreground">No orders yet.</p>
                  <Button asChild variant="link" className="text-primary font-bold mt-2">
                    <Link href="/market">Explore Farmer's Market <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-5 rounded-3xl border bg-card hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">{purchase.itemName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(purchase.saleDate), 'PPP')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-primary tracking-tight">₹{purchase.totalPrice}</p>
                        <Badge variant="outline" className="mt-1 border-primary/20 text-[10px] text-primary font-bold bg-primary/5 uppercase">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
