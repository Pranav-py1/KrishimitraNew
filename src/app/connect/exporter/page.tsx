
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { query, collection, where } from 'firebase/firestore';
import { 
  Truck, 
  MapPin, 
  Star, 
  ArrowRight, 
  Loader2, 
  Search, 
  ShieldCheck,
  ShoppingBag,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { User as UserType } from '@/lib/data';
import Image from 'next/image';

export default function ExportersListPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const exportersQuery = useMemoFirebase(() => 
    query(collection(firestore, 'users'), where('role', '==', 'exporter')),
    [firestore]
  );
  
  const { data: exporters, isLoading } = useCollection<UserType>(exportersQuery);

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

  const filteredExporters = exporters?.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location?.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Truck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Available Exporters</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with trusted exporters who purchase agricultural produce in bulk for national and international markets.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by company, name, or district..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : !filteredExporters || filteredExporters.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <Truck className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No exporters available yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredExporters.map((exporter) => (
            <Card key={exporter.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-10 px-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center border-2 border-primary/10">
                    {exporter.profileImageUrl ? (
                      <Image src={exporter.profileImageUrl} alt={exporter.name} fill className="object-cover" />
                    ) : (
                      <Truck className="h-10 w-10 text-primary/40" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-accent font-black text-sm bg-accent/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-accent" />
                    {exporter.rating || '4.5'}
                  </div>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">
                  {exporter.companyName || exporter.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {exporter.location?.district}, {exporter.location?.state || 'Maharashtra'}
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 flex-1">
                <div className="space-y-4 pt-4 border-t border-dashed">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Interested Products</p>
                    <div className="flex flex-wrap gap-2">
                      {(exporter.productsBuying || ['Onions', 'Mangoes', 'Grains']).map((p, i) => (
                        <Badge key={i} variant="secondary" className="rounded-lg font-bold text-[10px] px-2 py-0.5">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price Range</p>
                      <p className="font-bold text-primary text-sm">{exporter.priceRange || '₹20 - ₹45 / kg'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Capacity</p>
                      <p className="font-bold text-primary text-sm">{exporter.capacity || '1 - 10 Tons'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 border-t border-dashed">
                <Button asChild className="w-full h-16 rounded-none bg-white text-primary hover:bg-primary hover:text-white transition-all font-bold text-lg border-none shadow-none group">
                  <Link href={`/connect/exporter/${exporter.id}`}>
                    View Profile <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
