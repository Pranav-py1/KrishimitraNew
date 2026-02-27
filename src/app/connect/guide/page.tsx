'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  UserCheck, 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  Search,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const expertGuides = [
  { 
    id: '1',
    name: 'Dr. Anil Patil',
    specialization: 'Soil Health & Crop Management',
    experience: '12 Years',
    location: 'Nashik, Maharashtra',
    consultation: 'Offline Farm Visit',
    fee: '₹1500',
    rating: 4.8
  },
  { 
    id: '2',
    name: 'Ms. Kavita Deshmukh',
    specialization: 'Organic Farming & Pest Control',
    experience: '8 Years',
    location: 'Pune, Maharashtra',
    consultation: 'Offline Farm Visit',
    fee: '₹1200',
    rating: 4.6
  },
  { 
    id: '3',
    name: 'Mr. Rohan Kulkarni',
    specialization: 'Irrigation & Water Management',
    experience: '10 Years',
    location: 'Aurangabad, Maharashtra',
    consultation: 'Offline Farm Visit',
    fee: '₹1400',
    rating: 4.7
  },
  { 
    id: '4',
    name: 'Dr. Suresh Gupta',
    specialization: 'High-Yield Seed Selection & Fertilizer Planning',
    experience: '15 Years',
    location: 'Mumbai, Maharashtra',
    consultation: 'Offline Farm Visit',
    fee: '₹1800',
    rating: 4.9
  },
];

export default function GuideListPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/guide');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: "Appointment Requested",
        description: "Your farm visit request has been sent to the expert.",
      });
    }, 1500);
  };

  const filteredGuides = expertGuides.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Farm Experts & Agricultural Guides</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with experienced agricultural experts who can visit your farm and guide you for better yield and sustainable farming.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by name, specialization, or location..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <Users className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No experts found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((expert) => (
            <Card key={expert.id} className="group border-2 border-transparent hover:border-primary/20 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2rem] bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-8 px-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/5 p-3 rounded-2xl">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <Star className="h-4 w-4 fill-primary" />
                    {expert.rating}
                  </div>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">
                  {expert.name}
                </CardTitle>
                <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider mt-2 w-fit">
                  {expert.specialization}
                </Badge>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 flex-1">
                <div className="space-y-4 pt-4 border-t border-dashed">
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {expert.experience} Experience
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {expert.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {expert.consultation}
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Consultation Fee</p>
                    <p className="text-2xl font-black text-primary">{expert.fee} <span className="text-xs font-normal text-muted-foreground">/ visit</span></p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 transition-all">
                  <Link href={`/connect/guide/${encodeURIComponent(expert.name)}`}>
                    View Profile
                  </Link>
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all">
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2rem] max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">Book Farm Visit</DialogTitle>
                      <DialogDescription>
                        Request a consultation with {expert.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="farmerName">Farmer Name</Label>
                        <Input id="farmerName" placeholder="Your full name" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Farm Location</Label>
                        <Input id="location" placeholder="Address/Village" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Input id="cropType" placeholder="e.g. Wheat, Tomato" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input id="date" type="date" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="issue">Issue Description</Label>
                        <Textarea id="issue" placeholder="Briefly describe the help you need..." required className="rounded-xl" />
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isBooking} className="w-full h-12 rounded-xl font-bold">
                          {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Farm Visit"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
