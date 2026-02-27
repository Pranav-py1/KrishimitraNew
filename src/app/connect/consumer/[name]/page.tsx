'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  Users, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  ShoppingBag, 
  MessageSquare,
  Clock,
  Calendar,
  Phone,
  PackageCheck,
  HandCoins,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sampleConsumers = [
  { 
    id: '1',
    name: 'Amit Sharma',
    location: 'Nashik, Maharashtra',
    address: 'Flat 402, Green Valley Apartments, Near City Center, Nashik 422001',
    interestedIn: 'Vegetables, Fruits',
    dailyRequirement: '5–10 kg',
    weeklyRequirement: 'approx. 40–50 kg',
    priceRange: '₹20–₹50 per kg',
    preferredTime: '7:00 AM – 9:00 AM',
    contact: '+91 98765 00001'
  },
  { 
    id: '2',
    name: 'Priya Deshmukh',
    location: 'Pune, Maharashtra',
    address: 'Row House 12, Orchid Enclave, Baner, Pune 411045',
    interestedIn: 'Leafy Vegetables, Tomatoes',
    dailyRequirement: '3–8 kg',
    weeklyRequirement: 'approx. 20–30 kg',
    priceRange: '₹18–₹40 per kg',
    preferredTime: '8:00 AM – 10:00 AM',
    contact: '+91 98765 00002'
  },
  { 
    id: '3',
    name: 'Rajesh Verma',
    location: 'Mumbai, Maharashtra',
    address: 'B-304, Sunshine Towers, Andheri West, Mumbai 400053',
    interestedIn: 'Onions, Potatoes, Fruits',
    dailyRequirement: '10–20 kg',
    weeklyRequirement: 'approx. 80–100 kg',
    priceRange: '₹22–₹45 per kg',
    preferredTime: '6:00 AM – 8:00 AM',
    contact: '+91 98765 00003'
  },
  { 
    id: '4',
    name: 'Neha Patil',
    location: 'Aurangabad, Maharashtra',
    address: 'Plot 56, Sahyadri Colony, CIDCO, Aurangabad 431003',
    interestedIn: 'Organic Vegetables',
    dailyRequirement: '2–6 kg',
    weeklyRequirement: 'approx. 15–20 kg',
    priceRange: '₹30–₹60 per kg',
    preferredTime: 'Morning or Evening',
    contact: '+91 98765 00004'
  },
  { 
    id: '5',
    name: 'Sunil Gupta',
    location: 'Thane, Maharashtra',
    address: 'Apartment 101, Lake View, Majiwada, Thane 400601',
    interestedIn: 'Mixed Vegetables',
    dailyRequirement: '8–15 kg',
    weeklyRequirement: 'approx. 50–60 kg',
    priceRange: '₹20–₹48 per kg',
    preferredTime: 'Flexible',
    contact: '+91 98765 00005'
  },
];

export default function ConsumerDetailPage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name as string);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/consumer');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const consumer = sampleConsumers.find(c => c.name === decodedName);

  if (!consumer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Consumer profile not found.</h2>
        <Button asChild className="mt-4"><Link href="/connect/consumer">Back to List</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/connect/consumer"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Consumers</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl">
                <Users className="h-12 w-12" />
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{consumer.name}</CardTitle>
              <Badge className="bg-white/90 text-primary border-none font-black uppercase text-[10px] tracking-widest mt-2 px-4 py-1.5 rounded-full relative z-10">
                Verified Buyer
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-1" />
                  <p className="text-sm font-medium leading-relaxed italic opacity-90">
                    {consumer.address}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Phone className="h-4 w-4" /></div>
                  <span className="font-bold text-sm">{consumer.contact}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Clock className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">Best Time: {consumer.preferredTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full h-16 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/messages">
              <HandCoins className="mr-3 h-6 w-6" /> Send Price Offer
            </Link>
          </Button>
        </div>

        {/* Requirements Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <PackageCheck className="h-6 w-6 text-primary" /> Consumption Requirements
              </CardTitle>
              <CardDescription>Detailed breakdown of what this household needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Daily Estimate</p>
                  <p className="text-3xl font-black text-primary">{consumer.dailyRequirement}</p>
                  <p className="text-xs text-muted-foreground mt-1">Freshly picked preferred</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Weekly Total</p>
                  <p className="text-3xl font-black text-primary">{consumer.weeklyRequirement}</p>
                  <p className="text-xs text-muted-foreground mt-1">Regular replenishment needed</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" /> Target Products
                </h3>
                <div className="flex flex-wrap gap-3">
                  {consumer.interestedIn.split(', ').map((p, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white text-primary border border-primary/10 px-4 py-2 rounded-2xl font-bold shadow-sm">
                      <ShieldCheck className="h-4 w-4" /> {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                <h3 className="text-lg font-bold mb-2">Budget Preference</h3>
                <p className="text-2xl font-black text-accent-foreground/80">{consumer.priceRange}</p>
                <p className="text-sm text-muted-foreground mt-1 italic">"I am looking for competitive market rates for bulk daily supply."</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-dashed bg-muted/10 p-8 flex justify-center">
              <div className="text-center">
                <p className="text-sm font-bold text-muted-foreground mb-4">Direct communication helps build long-term trust.</p>
                <Button className="rounded-2xl h-12 px-10 font-bold" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Start Negotiation
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
