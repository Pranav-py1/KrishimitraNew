'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { query, collection, where } from 'firebase/firestore';
import { 
  User, 
  MapPin, 
  Star, 
  ArrowRight, 
  Loader2, 
  Lightbulb, 
  Award,
  Search,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { User as UserType } from '@/lib/data';

export default function ExpertsListPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const expertsQuery = useMemoFirebase(() => {
    // Prevent query execution until auth is ready to avoid permission errors
    if (isUserLoading || !user) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'expert'));
  }, [firestore, user, isUserLoading]);
  
  const { data: experts, isLoading: isQueryLoading } = useCollection<UserType>(expertsQuery);

  const filteredExperts = experts?.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.expertiseCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Defer rendering until mounted to prevent hydration mismatches from browser extensions
  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000 bg-background/50">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Lightbulb className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Agricultural Mentors</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with certified experts for professional guidance on crops, soil health, and sustainable farming.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by name or expertise (e.g. Organic, Soil)..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isQueryLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : !filteredExperts || filteredExperts.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <User className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No experts found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="text-center pb-2 pt-10">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-dashed group-hover:animate-spin duration-[10s]" />
                  <div className="absolute inset-2 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-headline">{expert.name}</CardTitle>
                <div className="flex items-center justify-center gap-1 text-primary font-bold text-sm mb-2">
                  <Star className="h-4 w-4 fill-primary" />
                  4.9 Rating
                </div>
                <Badge variant="secondary" className="rounded-lg font-black uppercase text-[9px] tracking-widest px-3 py-1">
                  {expert.expertiseCategory || 'General Expert'}
                </Badge>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-sm text-muted-foreground line-clamp-2 italic px-4">
                  "{expert.bio || 'Professional agricultural consultant dedicated to farmer success.'}"
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-dashed">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Award className="h-4 w-4 text-primary" />
                    {expert.experienceYears || '10+'} Years
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {expert.location?.district || 'Regional'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 border-t border-dashed">
                <Button asChild className="w-full h-16 rounded-none bg-white text-primary hover:bg-primary hover:text-white transition-all font-bold text-lg border-none shadow-none group">
                  <Link href={`/farmer/experts/${expert.id}`}>
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