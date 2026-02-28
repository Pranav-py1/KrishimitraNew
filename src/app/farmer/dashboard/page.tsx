'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { 
  Loader2, 
  Wheat, 
  Truck, 
  Store, 
  ShoppingBag, 
  ArrowRight,
  GraduationCap,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const connectionOptions = [
  {
    title: 'View Exporters',
    description: 'Browse exporters who buy agricultural produce in bulk.',
    icon: Truck,
    href: '/connect/exporter',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'View Suppliers',
    description: 'Find suppliers providing seeds, fertilizers, and tools.',
    icon: Store,
    href: '/connect/supplier',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'View Experts / Guides',
    description: 'Consult experienced agricultural experts to improve your crop yield and farm productivity.',
    icon: GraduationCap,
    href: '/connect/guide',
    color: 'bg-teal-500/10 text-teal-600',
  },
  {
    title: 'View Other Farmers',
    description: 'Connect with fellow farmers to share knowledge, collaborate, and grow together.',
    icon: Users,
    href: '/connect/farmers',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'View Consumers',
    description: 'Connect with daily and bulk consumers who purchase fresh vegetables and fruits directly from farmers.',
    icon: ShoppingBag,
    href: '/connect/consumer',
    color: 'bg-rose-500/10 text-rose-600',
  },
];

function ConnectionCard({ option, idx }: { option: typeof connectionOptions[0], idx: number }) {
  const Icon = option.icon;
  
  return (
    <Link href={option.href} className="group block h-full">
      <Card className="h-full border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2rem] bg-card flex flex-col animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 100}ms` }}>
        <CardHeader className="pt-10 pb-4">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", option.color)}>
            <Icon className="h-8 w-8" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-10">
          <CardTitle className="text-2xl font-headline mb-3 group-hover:text-primary transition-colors">
            {option.title}
          </CardTitle>
          <p className="text-muted-foreground leading-relaxed">
            {option.description}
          </p>
          <div className="mt-6 flex items-center text-primary font-bold text-sm">
            Explore Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function FarmerDashboard() {
  const { isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-16 animate-in fade-in duration-1000">
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="bg-primary/10 p-4 rounded-3xl mb-6">
          <Wheat className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4 text-foreground">
          Farmer Dashboard
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
          Manage your agricultural produce and livestock listings from one place.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10 border-l-4 border-primary pl-6">
          <h2 className="text-3xl font-bold font-headline">Connect & Explore</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {connectionOptions.map((option, idx) => (
            <ConnectionCard key={option.href} option={option} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
