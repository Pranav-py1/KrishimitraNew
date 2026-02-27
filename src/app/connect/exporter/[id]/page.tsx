'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  ShoppingBag, 
  MessageSquare,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  BadgeCheck,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const bulkBuyers = [
  { 
    id: 'green-leaf-hotel',
    name: 'Green Leaf Hotel',
    type: '4-Star Hotel',
    location: 'Pune, Maharashtra',
    address: 'Plot 45, Near Airport Road, Viman Nagar, Pune 411014',
    products: 'Vegetables, Fruits',
    weeklyQuantity: '150–300 kg',
    monthlyQuantity: 'approx. 1.2 Tons',
    priceRange: '₹18–₹35 per kg',
    paymentTerms: '7-Day Credit Cycle',
    contract: 'Monthly Rolling Contract',
    schedule: 'Early Morning (5 AM - 7 AM)'
  },
  { 
    id: 'freshbite-restaurant',
    name: 'FreshBite Restaurant Chain',
    type: 'Multi-Outlet Restaurant',
    location: 'Mumbai, Maharashtra',
    address: 'Andheri Kurla Road, Near Metro Station, Mumbai 400059',
    products: 'Tomatoes, Onions, Leafy Vegetables',
    weeklyQuantity: '200–500 kg',
    monthlyQuantity: 'approx. 2 Tons',
    priceRange: '₹20–₹38 per kg',
    paymentTerms: 'On-Delivery (Digital)',
    contract: 'Weekly Procurement',
    schedule: 'Daily Deliveries Preferred'
  },
  { 
    id: 'agrofresh-factory',
    name: 'AgroFresh Food Factory',
    type: 'Processing Factory',
    location: 'Nashik, Maharashtra',
    address: 'MIDC Phase III, Sinnar, Nashik 422103',
    products: 'Potatoes, Mangoes, Onions',
    weeklyQuantity: '500kg – 2 Tons',
    monthlyQuantity: 'approx. 8-10 Tons',
    priceRange: '₹15–₹30 per kg',
    paymentTerms: '15-Day Credit Cycle',
    contract: 'Annual Seasonal Contract',
    schedule: 'Bulk Loading Bay (24/7 Access)'
  },
  { 
    id: 'royal-catering',
    name: 'Royal Catering Services',
    type: 'Catering & Events',
    location: 'Thane, Maharashtra',
    address: 'Pokhran Road No. 2, Near Upvan Lake, Thane 400606',
    products: 'Mixed Vegetables',
    weeklyQuantity: '300–700 kg per event',
    monthlyQuantity: 'Variable (Event-based)',
    priceRange: '₹22–₹40 per kg',
    paymentTerms: 'Advance + Post-Event Balance',
    contract: 'Event-by-Event Basis',
    schedule: 'Afternoon Deliveries'
  },
];

export default function ExporterDetailPage() {
  const { id } = useParams();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/exporter');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const buyer = bulkBuyers.find(b => b.id === id);

  if (!buyer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Buyer profile not found.</h2>
        <Button asChild className="mt-4"><Link href="/connect/exporter">Back to List</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/connect/exporter"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Bulk Buyers</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl">
                <Building2 className="h-12 w-12" />
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{buyer.name}</CardTitle>
              <Badge className="bg-white/90 text-primary border-none font-black uppercase text-[10px] tracking-widest mt-2 px-4 py-1.5 rounded-full relative z-10">
                {buyer.type}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-1" />
                  <p className="text-sm font-medium leading-relaxed italic opacity-90">
                    {buyer.address}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Calendar className="h-4 w-4" /></div>
                  <span className="font-bold text-sm">Contract: {buyer.contract}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Clock className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">Deliver: {buyer.schedule}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2.5rem] p-8 bg-accent/5 border border-accent/10">
            <h3 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-accent-foreground" /> Verified Terms
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dashed">
                <span className="text-xs font-bold text-muted-foreground uppercase">Payment</span>
                <span className="text-sm font-black">{buyer.paymentTerms}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed">
                <span className="text-xs font-bold text-muted-foreground uppercase">Target Price</span>
                <span className="text-sm font-black text-primary">{buyer.priceRange}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Requirements Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" /> Procurement Needs
              </CardTitle>
              <CardDescription>Detailed breakdown of bulk supply requirements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Weekly Intake</p>
                  <p className="text-3xl font-black text-primary">{buyer.weeklyQuantity}</p>
                  <p className="text-xs text-muted-foreground mt-1">Regular replenishment needed</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Monthly Estimate</p>
                  <p className="text-3xl font-black text-primary">{buyer.monthlyQuantity}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total operational volume</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Focus Commodities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {buyer.products.split(', ').map((p, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white text-primary border border-primary/10 px-4 py-2 rounded-2xl font-bold shadow-sm">
                      <BadgeCheck className="h-4 w-4" /> {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-dashed">
                <h3 className="text-xl font-bold mb-6">Propose Your Price</h3>
                <form className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Your Offered Rate (per kg)</Label>
                    <Input placeholder="e.g. 25" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Available Quantity (kg)</Label>
                    <Input placeholder="e.g. 500" className="h-12 rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                      <Send className="mr-2 h-5 w-5" /> Submit Commercial Proposal
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
            <CardFooter className="border-t border-dashed bg-muted/10 p-8 flex justify-center">
              <div className="text-center">
                <p className="text-sm font-bold text-muted-foreground mb-4">Establishing direct factory/hotel supply lines ensures stable income.</p>
                <Button className="rounded-2xl h-12 px-10 font-bold" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Procurement Manager
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
