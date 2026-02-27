'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  Truck, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  Search, 
  ShoppingBag,
  Building2,
  Hotel,
  UtensilsCrossed,
  Factory,
  PartyPopper
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const bulkBuyers = [
  { 
    id: 'green-leaf-hotel',
    name: 'Green Leaf Hotel',
    type: '4-Star Hotel',
    icon: Hotel,
    location: 'Pune, Maharashtra',
    products: 'Vegetables, Fruits',
    quantity: '150–300 kg per week',
    priceRange: '₹18–₹35 per kg'
  },
  { 
    id: 'freshbite-restaurant',
    name: 'FreshBite Restaurant Chain',
    type: 'Multi-Outlet Restaurant',
    icon: UtensilsCrossed,
    location: 'Mumbai, Maharashtra',
    products: 'Tomatoes, Onions, Leafy Vegetables',
    quantity: '200–500 kg per week',
    priceRange: '₹20–₹38 per kg'
  },
  { 
    id: 'agrofresh-factory',
    name: 'AgroFresh Food Factory',
    type: 'Processing Factory',
    icon: Factory,
    location: 'Nashik, Maharashtra',
    products: 'Potatoes, Mangoes, Onions',
    quantity: '500kg – 2 Tons per order',
    priceRange: '₹15–₹30 per kg'
  },
  { 
    id: 'royal-catering',
    name: 'Royal Catering Services',
    type: 'Catering & Events',
    icon: PartyPopper,
    location: 'Thane, Maharashtra',
    products: 'Mixed Vegetables',
    quantity: '300–700 kg per event',
    priceRange: '₹22–₹40 per kg'
  },
];

export default function ExportersListPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/exporter');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const filteredBuyers = bulkBuyers.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Truck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Bulk Buyers & Exporters</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with hotels, restaurants, and factories purchasing produce in bulk quantities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by company name, type, or city..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBuyers.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <Building2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No bulk buyers available yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBuyers.map((buyer) => (
            <Card key={buyer.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-10 px-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center border-2 border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <buyer.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="secondary" className="rounded-lg font-bold text-[9px] uppercase tracking-wider">
                    {buyer.type}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors min-h-[4rem]">
                  {buyer.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {buyer.location}
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 flex-1">
                <div className="space-y-4 pt-4 border-t border-dashed">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Products Needed</p>
                    <p className="font-bold text-foreground text-sm">{buyer.products}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Requirement</p>
                      <p className="font-black text-primary text-lg">{buyer.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price Range</p>
                      <p className="font-bold text-foreground/80 text-sm">{buyer.priceRange}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 transition-all">
                  <Link href={`/connect/exporter/${buyer.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all">
                  Send Offer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
