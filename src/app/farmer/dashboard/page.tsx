'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { Loader2, PlusCircle, CheckCircle, Clock, Egg, Star, Edit, Trash2, Wheat } from 'lucide-react';
import Link from 'next/link';
import { query, collection, where } from 'firebase/firestore';
import { type Produce } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const sampleProduce = [
  { 
    id: 's1', 
    title: 'Tomatoes', 
    price: 30, 
    unit: 'kg', 
    rating: 4.5, 
    category: 'Vegetable', 
    imageURL: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 's2', 
    title: 'Potatoes', 
    price: 25, 
    unit: 'kg', 
    rating: 4.2, 
    category: 'Vegetable', 
    imageURL: 'https://images.unsplash.com/photo-1518977676601-b53f02bad6ad?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 's3', 
    title: 'Onions', 
    price: 28, 
    unit: 'kg', 
    rating: 4.3, 
    category: 'Vegetable', 
    imageURL: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 's4', 
    title: 'Mango (Alphonso)', 
    price: 120, 
    unit: 'kg', 
    rating: 4.8, 
    category: 'Fruit', 
    imageURL: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 's5', 
    title: 'Bananas', 
    price: 40, 
    unit: 'dozen', 
    rating: 4.4, 
    category: 'Fruit', 
    imageURL: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4460?q=80&w=400&auto=format&fit=crop' 
  },
];

function ProduceCard({ item }: { item: any }) {
  const isSample = item.id.startsWith('s');
  
  return (
    <Card className="overflow-hidden border-none shadow-soft hover:shadow-md transition-all duration-300 rounded-[1.5rem] bg-card group">
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={item.imageURL} 
          alt={item.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3">
          <Badge className={cn(
            "font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border-none shadow-sm",
            item.category === 'Fruit' ? "bg-orange-500 text-white" : "bg-green-600 text-white"
          )}>
            {item.category || 'Produce'}
          </Badge>
        </div>
        {!isSample && (
          <div className="absolute bottom-3 right-3">
            {item.approved ? (
              <Badge className="bg-white/90 backdrop-blur-md text-green-700 font-bold text-[10px] rounded-full border-none shadow-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-md text-amber-700 font-bold text-[10px] rounded-full border-none shadow-sm flex items-center gap-1">
                <Clock className="h-3 w-3" /> Pending
              </Badge>
            )}
          </div>
        )}
      </div>
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold truncate leading-tight">{item.title}</CardTitle>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-black">{item.rating || '4.0'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-black text-primary tracking-tight">₹{item.price}</p>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">per {item.unit}</p>
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-9 text-xs font-bold rounded-xl border-2 hover:bg-primary/5">
          <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
        </Button>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 rounded-xl">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function FarmerDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const farmerProduceQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'produce'), where('farmerId', '==', user.uid)) : null, 
    [firestore, user?.uid]
  );
  const { data: produceListings, isLoading: isLoadingProduce } = useCollection<Produce>(farmerProduceQuery);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Use samples if no real listings found for demo purposes
  const displayItems = produceListings && produceListings.length > 0 ? produceListings : sampleProduce;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="bg-primary/10 p-3 rounded-2xl mb-4">
          <Wheat className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight mb-2">
          Farmer Dashboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Manage your agricultural produce and livestock listings from one place.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
             <Card className="border-none shadow-soft rounded-[2rem] bg-card sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Streamline your farm operations.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button asChild size="lg" className="h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                  <Link href="/farmer/add-produce">
                    <PlusCircle className="mr-2 h-5 w-5" /> List New Produce
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl font-bold text-lg border-2 border-primary text-primary hover:bg-primary/5">
                  <Link href="/farmer/livestock">
                    <Egg className="mr-2 h-5 w-5" /> Livestock Selling
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-headline">Your Produce Listings</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                {displayItems.length} Items
              </Badge>
            </div>
            
            {isLoadingProduce ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayItems.map((item) => (
                    <ProduceCard key={item.id} item={item} />
                  ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
