
'use client';

import { Stethoscope, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HealthPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)]">
      <div className="bg-red-500/10 p-8 rounded-[3rem] mb-8">
        <Stethoscope className="h-20 w-20 text-red-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Vet Services</h1>
      <p className="text-muted-foreground text-xl max-w-2xl mb-10">
        Direct booking for on-site veterinary visits and access to a digital inventory of essential livestock medicines. Launching soon.
      </p>
      <Button asChild size="lg" className="rounded-full px-8">
        <Link href="/livestock">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Livestock
        </Link>
      </Button>
    </div>
  );
}
