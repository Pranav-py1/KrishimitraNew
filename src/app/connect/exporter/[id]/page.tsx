
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  Truck, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Building2, 
  ArrowLeft, 
  Loader2, 
  ShoppingBag, 
  History,
  CheckCircle2,
  MessageSquare,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { User as UserType } from '@/lib/data';
import Image from 'next/image';

const sampleOrders = [
  { item: 'Red Onions', qty: '2000kg', location: 'Nashik', date: '2 weeks ago' },
  { item: 'Alphonso Mangoes', qty: '500 Boxes', location: 'Ratnagiri', date: '1 month ago' },
  { item: 'Basmati Rice', qty: '5000kg', location: 'Gondia', date: '2 months ago' },
  { item: 'Turmeric', qty: '1000kg', location: 'Sangli', date: '3 months ago' },
  { item: 'Tomatoes', qty: '1500kg', location: 'Pune', date: '4 months ago' },
];

export default function ExporterProfilePage() {
  const { id } = useParams();
  const exporterId = Array.isArray(id) ? id[0] : id;
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // Ensure the document reference only exists if user is authenticated
  const exporterRef = useMemoFirebase(() => {
    if (!user || !exporterId) return null;
    return doc(firestore, 'users', exporterId);
  }, [firestore, exporterId, user]);
  
  const { data: exporter, isLoading: isDocLoading } = useDoc<UserType>(exporterRef);

  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!exporter) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Exporter not found.</h2>
        <Button asChild className="mt-4"><Link href="/connect/exporter">Back to List</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/connect/exporter"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Exporters</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl overflow-hidden">
                {exporter.profileImageUrl ? (
                  <Image src={exporter.profileImageUrl} alt={exporter.name} fill className="object-cover" />
                ) : (
                  <Building2 className="h-14 w-14" />
                )}
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{exporter.companyName || exporter.name}</CardTitle>
              <div className="flex items-center justify-center gap-1 text-white font-bold text-sm mt-2 relative z-10">
                <Star className="h-4 w-4 fill-white" />
                {exporter.rating || '4.5'} Rating
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <p className="text-sm font-medium leading-relaxed italic opacity-90">
                  "{exporter.bio || 'Leading agricultural exporter committed to fair trade and quality sourcing directly from local farmers.'}"
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Phone className="h-4 w-4" /></div>
                  <span className="font-bold text-sm">{exporter.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Mail className="h-4 w-4" /></div>
                  <span className="font-bold text-sm truncate">{exporter.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><MapPin className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">
                    {exporter.location?.address}, {exporter.location?.district}, {exporter.location?.state}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full h-16 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/messages">
              <MessageSquare className="mr-3 h-6 w-6" /> Contact Exporter
            </Link>
          </Button>
        </div>

        {/* Details Main */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" /> Purchase Requirements
              </CardTitle>
              <CardDescription>Current market needs and pricing policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Accepted Price Range</p>
                  <p className="text-3xl font-black text-primary">{exporter.priceRange || '₹20 - ₹45'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Depends on quality grade and season</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-3xl border border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Buying Capacity</p>
                  <p className="text-3xl font-black text-primary">{exporter.capacity || '1 - 10 Tons'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction / seasonal contract</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Focus Products</h3>
                <div className="flex flex-wrap gap-3">
                  {(exporter.productsBuying || ['Onions', 'Mangoes', 'Grains', 'Pulses', 'Cotton']).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-2 rounded-2xl font-bold">
                      <CheckCircle2 className="h-4 w-4" /> {p}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <History className="h-6 w-6 text-primary" /> Recent Transactions
              </CardTitle>
              <CardDescription>Sample of successfully completed bulk orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-3xl border bg-card hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{order.item}</p>
                        <p className="text-xs text-muted-foreground">{order.qty} • {order.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold text-[10px] uppercase">Verified</Badge>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
