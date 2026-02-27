'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  Users, 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Loader2, 
  Search, 
  MessageCircle,
  Clock,
  HandCoins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const sampleConsumers = [
  { 
    id: '1',
    name: 'Amit Sharma',
    location: 'Nashik, Maharashtra',
    interestedIn: 'Vegetables, Fruits',
    dailyRequirement: '5–10 kg',
    priceRange: '₹20–₹50 per kg'
  },
  { 
    id: '2',
    name: 'Priya Deshmukh',
    location: 'Pune, Maharashtra',
    interestedIn: 'Leafy Vegetables, Tomatoes',
    dailyRequirement: '3–8 kg',
    priceRange: '₹18–₹40 per kg'
  },
  { 
    id: '3',
    name: 'Rajesh Verma',
    location: 'Mumbai, Maharashtra',
    interestedIn: 'Onions, Potatoes, Fruits',
    dailyRequirement: '10–20 kg',
    priceRange: '₹22–₹45 per kg'
  },
  { 
    id: '4',
    name: 'Neha Patil',
    location: 'Aurangabad, Maharashtra',
    interestedIn: 'Organic Vegetables',
    dailyRequirement: '2–6 kg',
    priceRange: '₹30–₹60 per kg'
  },
  { 
    id: '5',
    name: 'Sunil Gupta',
    location: 'Thane, Maharashtra',
    interestedIn: 'Mixed Vegetables',
    dailyRequirement: '8–15 kg',
    priceRange: '₹20–₹48 per kg'
  },
];

export default function ConsumersListPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/consumer');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const filteredConsumers = sampleConsumers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.interestedIn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Daily Consumers Near You</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with regular household buyers who purchase fresh produce for daily use.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by name, location, or products..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredConsumers.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <Users className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No matching consumers found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredConsumers.map((consumer) => (
            <Card key={consumer.id} className="group border-2 border-transparent hover:border-primary/20 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2rem] bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-8 px-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/5 p-3 rounded-2xl">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider">
                    Household Buyer
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">
                  {consumer.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {consumer.location}
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 flex-1">
                <div className="space-y-4 pt-4 border-t border-dashed">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Interested In</p>
                    <p className="font-bold text-foreground text-sm">{consumer.interestedIn}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Daily Need</p>
                      <p className="font-bold text-primary text-sm">{consumer.dailyRequirement}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price Range</p>
                      <p className="font-bold text-primary text-sm">{consumer.priceRange}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 transition-all">
                  <Link href={`/connect/consumer/${encodeURIComponent(consumer.name)}`}>
                    View Details
                  </Link>
                </Button>
                <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all">
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
