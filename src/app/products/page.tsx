
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Droplets, 
  Sprout, 
  Bug, 
  Leaf,
  Beaker,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Product Type definition for this page
type AgriProduct = {
  id: string;
  name: string;
  brand?: string;
  category: 'pesticides' | 'fertilizers' | 'seeds' | 'seed-treatment' | 'insecticides';
  type: string;
  imageUrl: string;
  description?: string;
  packSize?: string;
};

// Organized Product Data
const products: AgriProduct[] = [
  // Pesticides / Neem Based
  {
    id: 'p1',
    name: 'Neemraj Super 3000 PPM',
    brand: 'Neemraj',
    category: 'pesticides',
    type: 'Botanical Insecticide',
    imageUrl: PlaceHolderImages.find(img => img.id === 'neemraj-3000')?.imageUrl || '',
  },
  {
    id: 'p2',
    name: 'Organeem 1500 PPM Neem Oil',
    brand: 'Kay Bee',
    category: 'pesticides',
    type: 'Botanical Insecticide',
    imageUrl: PlaceHolderImages.find(img => img.id === 'organeem-1500')?.imageUrl || '',
  },
  // Fertilizers
  {
    id: 'f1',
    name: 'Utkarsh NPK 19:19:19',
    brand: 'Utkarsh',
    category: 'fertilizers',
    type: 'Water Soluble Fertilizer',
    imageUrl: PlaceHolderImages.find(img => img.id === 'utkarsh-npk-19')?.imageUrl || '',
  },
  {
    id: 'f2',
    name: 'NPK 00:52:34 (Katyayani)',
    brand: 'Katyayani',
    category: 'fertilizers',
    type: 'Water Soluble Fertilizer',
    imageUrl: PlaceHolderImages.find(img => img.id === 'katyayani-005234')?.imageUrl || '',
  },
  {
    id: 'f3',
    name: 'Pruthvi Rich 50 (Liquid NP 7-21-0)',
    brand: 'Pruthvi',
    category: 'fertilizers',
    type: 'Liquid Fertilizer',
    imageUrl: PlaceHolderImages.find(img => img.id === 'pruthvi-rich-50')?.imageUrl || '',
  },
  // Seeds
  {
    id: 's1',
    name: 'Gliricidia Sepium Seeds',
    brand: 'Green Manure',
    category: 'seeds',
    type: 'Green Manure & Live Fencing',
    imageUrl: PlaceHolderImages.find(img => img.id === 'gliricidia-seeds')?.imageUrl || '',
  },
  // Seed Treatment
  {
    id: 'st1',
    name: 'FMC Advantage 25 DS',
    brand: 'FMC',
    category: 'seed-treatment',
    type: 'Seed Treatment',
    imageUrl: PlaceHolderImages.find(img => img.id === 'fmc-advantage')?.imageUrl || '',
  },
  {
    id: 'st2',
    name: 'NewLeaf Seed Care',
    brand: 'NewLeaf',
    category: 'seed-treatment',
    type: 'Botanical Seed Treatment',
    imageUrl: PlaceHolderImages.find(img => img.id === 'newleaf-seedcare')?.imageUrl || '',
  },
  // Insecticides
  {
    id: 'i1',
    name: 'Ultimate Insecticide – 1 kg',
    brand: 'Ultimate',
    category: 'insecticides',
    type: 'Chemical Insecticide',
    imageUrl: PlaceHolderImages.find(img => img.id === 'ultimate-insecticide')?.imageUrl || '',
    packSize: '1 kg',
  },
];

function ProductCard({ product }: { product: AgriProduct }) {
  return (
    <Card className="group overflow-hidden border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-[2rem] bg-card flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-primary font-black border-none shadow-sm flex items-center gap-1.5 px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">
            {product.category.replace('-', ' ')}
          </Badge>
        </div>
      </div>
      <CardHeader className="pt-6 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </CardTitle>
          {product.brand && (
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {product.brand}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="mt-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
            {product.type}
          </Badge>
          {product.packSize && (
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              Pack Size: {product.packSize}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pb-6 px-6 pt-0">
        <Button 
          variant="outline"
          className="w-full h-12 rounded-xl font-bold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

function SectionHeader({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="flex flex-col mb-10 border-l-4 border-primary pl-6 py-2">
      <div className="flex items-center gap-3 text-primary mb-2">
        <Icon className="h-6 w-6" />
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{title}</h2>
      </div>
      <p className="text-muted-foreground text-sm md:text-base font-medium max-w-2xl">{description}</p>
    </div>
  );
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const sections = [
    { 
      id: 'pesticides', 
      title: 'Pesticides / Neem Based Products', 
      description: 'Natural and botanical crop protection solutions.', 
      icon: Leaf,
      products: products.filter(p => p.category === 'pesticides') 
    },
    { 
      id: 'fertilizers', 
      title: 'Fertilizers', 
      description: 'Essential nutrients including water-soluble and liquid formulations.', 
      icon: Droplets,
      products: products.filter(p => p.category === 'fertilizers') 
    },
    { 
      id: 'seeds', 
      title: 'Seeds / Green Manure', 
      description: 'Seeds for sustainable farming and live fencing.', 
      icon: Sprout,
      products: products.filter(p => p.category === 'seeds') 
    },
    { 
      id: 'seed-treatment', 
      title: 'Seed Treatment Products', 
      description: 'Protecting crops from the very beginning with specialized care.', 
      icon: Beaker,
      products: products.filter(p => p.category === 'seed-treatment') 
    },
    { 
      id: 'insecticides', 
      title: 'Insecticides', 
      description: 'Effective control for a wide range of harmful insects.', 
      icon: Bug,
      products: products.filter(p => p.category === 'insecticides') 
    },
  ];

  const filteredSections = activeTab === 'all' ? sections : sections.filter(s => s.id === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-primary/5 border-b overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <Badge className="bg-accent/10 text-accent-foreground border-none shadow-none px-4 py-1.5 rounded-full uppercase text-[10px] font-black tracking-widest mb-6 flex items-center gap-2 w-fit mx-auto border border-accent/20">
            <Sparkles className="h-3 w-3" />
            Upcoming Update: Full Marketplace Features
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold font-headline mb-6 tracking-tight">
            Agricultural Products
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
            Discover high-performance seeds, certified fertilizers, and sustainable plant protection. Direct purchasing and delivery features are coming soon.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-[6rem] z-30 py-6 bg-background/80 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 rounded-2xl gap-1">
              <TabsTrigger value="all" className="flex-1 min-w-[80px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pesticides" className="flex-1 min-w-[100px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Pesticides</TabsTrigger>
              <TabsTrigger value="fertilizers" className="flex-1 min-w-[100px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Fertilizers</TabsTrigger>
              <TabsTrigger value="seeds" className="flex-1 min-w-[100px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Seeds</TabsTrigger>
              <TabsTrigger value="seed-treatment" className="flex-1 min-w-[120px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Seed Treatment</TabsTrigger>
              <TabsTrigger value="insecticides" className="flex-1 min-w-[100px] rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Insecticides</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Product Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {filteredSections.map((section, idx) => (
            <div key={section.id} className={cn("mb-24 last:mb-0 scroll-mt-40", idx % 2 === 1 && "relative py-12 px-4 rounded-[3rem] bg-muted/20")}>
              <SectionHeader 
                title={section.title} 
                description={section.description} 
                icon={section.icon} 
              />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {section.products.length === 0 && (
                <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed">
                  <p className="text-muted-foreground font-medium">No products currently available in this section.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
              <p className="text-primary-foreground/70 text-sm">Every product is tested and certified for agricultural use.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                < Droplets className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainable Choice</h3>
              <p className="text-primary-foreground/70 text-sm">Eco-friendly solutions to protect your farm and family.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Info className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
              <p className="text-primary-foreground/70 text-sm">Need help choosing? Our experts are just a click away.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
