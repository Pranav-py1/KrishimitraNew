
'use client';

import { Milk, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DairyPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)]">
      <div className="bg-blue-500/10 p-8 rounded-[3rem] mb-8">
        <Milk className="h-20 w-20 text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Dairy Solutions</h1>
      <p className="text-muted-foreground text-xl max-w-2xl mb-10">
        We are bringing advanced milk analytics, cattle tracking, and automated machinery to your fingertips. This section is currently under development.
      </p>
      <Button asChild size="lg" className="rounded-full px-8">
        <Link href="/livestock">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Livestock
        </Link>
      </Button>
    </div>
  );
}
