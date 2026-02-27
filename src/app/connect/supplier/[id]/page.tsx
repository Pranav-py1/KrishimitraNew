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
  CheckCircle2,
  Tag,
  Package,
  Droplets,
  Sprout,
  Wrench,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const companies = [
  { id: 'dhanuka', name: 'Dhanuka Agri Tech', type: 'Agro Chemicals & Pesticides', location: 'Maharashtra, India' },
  { id: 'gsp', name: 'GSP Crop Science', type: 'Crop Protection & Nutrition', location: 'Gujarat, India' },
  { id: 'mankind', name: 'Mankind', type: 'Agricultural Inputs', location: 'Delhi, India' },
  { id: 'sumitomo', name: 'Sumitomo Chemicals', type: 'Pesticides & Bio-solutions', location: 'Maharashtra, India' },
  { id: 'crystal', name: 'Crystal Crop', type: 'Seed & Crop Protection', location: 'Haryana, India' },
  { id: 'royal-kisan', name: 'Royal Kisan', type: 'Modern Farm Equipment', location: 'Punjab, India' },
  { id: 'sanyog', name: 'Sanyog Enterprises Chemical', type: 'Industrial Agro Chemicals', location: 'Maharashtra, India' },
  { id: 'mahalaxmi', name: 'Mahalaxmi Agro Equipments', type: 'Tractors & Tools', location: 'Maharashtra, India' },
  { id: 'parekh', name: 'Parekh Traders', type: 'Irrigation & Tools', location: 'Maharashtra, India' },
  { id: 'nirmal', name: 'Nirmal Seeds', type: 'High Yield Hybrid Seeds', location: 'Maharashtra, India' },
  { id: 'aim', name: 'Aim Pesticides', type: 'Crop Protection', location: 'Gujarat, India' },
  { id: 'alpha', name: 'Alpha Bio Product Industries', type: 'Bio Fertilizers', location: 'Maharashtra, India' },
  { id: 'shri', name: 'Shri Enterprises', type: 'General Agri Suppliers', location: 'Karnataka, India' },
  { id: 'india-pesticides', name: 'India Pesticides', type: 'Technical Grade Pesticides', location: 'Uttar Pradesh, India' },
  { id: 'ju', name: 'JU Agriculture', type: 'Fertilizers & Nutrients', location: 'Delhi, India' },
  { id: 'national', name: 'National Pesticides', type: 'Insecticides & Herbicides', location: 'Maharashtra, India' },
  { id: 'kisan-craft', name: 'Kisan Craft', type: 'Small Farm Machinery', location: 'Karnataka, India' },
  { id: 'benson', name: 'Benson Agro Engineering', type: 'Harvesting Machinery', location: 'Punjab, India' },
  { id: 'srishti', name: 'Srishti Agro', type: 'Organic Inputs', location: 'Maharashtra, India' },
  { id: 'excel', name: 'Excel Industries', type: 'Crop Nutrition', location: 'Maharashtra, India' },
];

const sampleProducts = [
  { id: 1, name: 'Premium Pesticide X', category: 'pesticides', desc: 'High efficiency pest control for cotton and grains.', price: '₹1,250' },
  { id: 2, name: 'Hybrid Seeds V2', category: 'seeds', desc: 'Drought resistant hybrid seeds for high yield.', price: '₹850' },
  { id: 3, name: 'NPK Fertilizer 19:19:19', category: 'fertilizers', desc: 'Water soluble fertilizer for faster crop growth.', price: '₹450' },
  { id: 4, name: 'Power Tiller M1', category: 'equipment', desc: 'Versatile small farm machine for multi-purpose soil prep.', price: '₹45,000' },
  { id: 5, name: 'Organic Soil Enhancer', category: 'other', desc: 'Bio-stimulant for improving soil microbiology.', price: '₹600' },
];

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/supplier');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Company not found.</h2>
        <Button asChild className="mt-4"><Link href="/connect/supplier">Back to List</Link></Button>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: typeof sampleProducts[0] }) => (
    <Card className="border-none shadow-soft rounded-3xl overflow-hidden group hover:shadow-md transition-all">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{product.name}</CardTitle>
          <Badge variant="outline" className="bg-white/50 border-primary/20 text-primary font-bold">
            {product.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.desc}</p>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary/60 tracking-widest">
          <CheckCircle2 className="h-3 w-3" /> Certified Quality
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Button className="w-full rounded-xl font-bold h-11 shadow-lg shadow-primary/10">
          <MessageSquare className="mr-2 h-4 w-4" /> Contact Company
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/connect/supplier"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Company Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl">
                <Building2 className="h-12 w-12" />
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{company.name}</CardTitle>
              <Badge className="bg-white/90 text-primary border-none font-black uppercase text-[10px] tracking-widest mt-2 px-4 py-1.5 rounded-full relative z-10">
                Official Supplier
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <p className="text-sm font-medium leading-relaxed italic opacity-90 text-center">
                  "Providing high-quality agricultural solutions to empower farmers and enhance sustainable crop productivity."
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><MapPin className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">{company.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Package className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">{company.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2.5rem] p-8 text-center bg-accent/5 border border-accent/10">
            <Sparkles className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold font-headline mb-2">Direct Support</h3>
            <p className="text-sm text-muted-foreground mb-6">Need bulk pricing or technical assistance? Connect with our regional manager.</p>
            <Button className="w-full rounded-2xl font-bold h-14 bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20">
              Request Callback
            </Button>
          </Card>
        </div>

        {/* Products Main */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold font-headline tracking-tight">Product Catalog</h2>
          </div>

          <Tabs defaultValue="pesticides" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-muted/50 rounded-2xl p-1 gap-1 mb-8">
              <TabsTrigger value="pesticides" className="rounded-xl font-bold px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Droplets className="mr-2 h-4 w-4" /> Pesticides
              </TabsTrigger>
              <TabsTrigger value="fertilizers" className="rounded-xl font-bold px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Tag className="mr-2 h-4 w-4" /> Fertilizers
              </TabsTrigger>
              <TabsTrigger value="seeds" className="rounded-xl font-bold px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Sprout className="mr-2 h-4 w-4" /> Seeds
              </TabsTrigger>
              <TabsTrigger value="equipment" className="rounded-xl font-bold px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Wrench className="mr-2 h-4 w-4" /> Equipment
              </TabsTrigger>
              <TabsTrigger value="other" className="rounded-xl font-bold px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Package className="mr-2 h-4 w-4" /> Other
              </TabsTrigger>
            </TabsList>

            {['pesticides', 'fertilizers', 'seeds', 'equipment', 'other'].map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  {sampleProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
