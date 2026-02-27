
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Machine } from '@/lib/data';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

const sampleMachines: Machine[] = [
  {
    id: 'sample-1',
    title: 'John Deere 5050D Tractor',
    description: 'A reliable tractor for all your farming needs. Available for daily rental.',
    price: 3000,
    imageURL: PlaceHolderImages.find(p => p.id === 'tractor-1')?.imageUrl || 'https://picsum.photos/seed/tractor/600/400',
    retailerId: 'sample',
    availability: true,
    approved: true,
  },
  {
    id: 'sample-2',
    title: 'Claas Crop Tiger 40 Harvester',
    description: 'Efficiently harvest your crops with our state-of-the-art combine harvester.',
    price: 8000,
    imageURL: PlaceHolderImages.find(p => p.id === 'harvester-1')?.imageUrl || 'https://picsum.photos/seed/harvester/600/400',
    retailerId: 'sample',
    availability: true,
    approved: true,
  },
   {
    id: 'sample-3',
    title: 'Maschio Gaspardo Cultivator',
    description: 'Prepare your soil for planting with this high-quality cultivator.',
    price: 1500,
    imageURL: PlaceHolderImages.find(p => p.id === 'cultivator-1')?.imageUrl || 'https://picsum.photos/seed/cultivator/600/400',
    retailerId: 'sample',
    availability: true,
    approved: true,
  },
   {
    id: 'sample-4',
    title: 'Shaktiman Precision Seeder',
    description: 'Precision seeder for accurate and efficient planting of various crops.',
    price: 2000,
    imageURL: PlaceHolderImages.find(p => p.id === 'seeder-1')?.imageUrl || 'https://picsum.photos/seed/seeder/600/400',
    retailerId: 'sample',
    availability: true,
    approved: true,
  },
];


function MachineCard({ machine }: { machine: Machine }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/machines/${machine.id}`} className="flex flex-col flex-grow">
        <div className="relative aspect-video">
          {machine.imageURL ? (
            <Image
              src={machine.imageURL}
              alt={machine.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-muted h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">No Image</p>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline">{machine.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {machine.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-secondary/50 p-4 mt-auto">
          <div>
            <p className="text-lg font-bold text-primary">
              ₹{machine.price}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </p>
          </div>
          <Button asChild>
            <span className="cursor-pointer">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

function MachineSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="relative aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-secondary/50 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-1/4" />
      </CardFooter>
    </Card>
  );
}


export default function MachinesPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const machinesQuery = useMemoFirebase(
    () =>
      firestore ? query(collection(firestore, 'machines'), where('approved', '==', true)) : null,
    [firestore]
  );

  const {
    data: machinesFromDb,
    isLoading: isLoadingDb,
    error,
  } = useCollection<Machine>(machinesQuery);
  
  const isLoading = isUserLoading || (user && isLoadingDb);
  const machines = user ? machinesFromDb : sampleMachines;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Farm Machinery for Rent
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Find the right equipment for your farm, right when you need it.
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <MachineSkeleton key={i} />
          ))}
        {!isLoading &&
          machines &&
          machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
      </div>
      
      {!isLoading && !error && machines?.length === 0 && (
         <p className="text-center text-muted-foreground mt-8">No machines are available for rent at the moment.</p>
      )}

      {user && error && (
        <p className="text-center text-destructive mt-8">Could not load machines. Please try again later.</p>
      )}
    </div>
  );
}
