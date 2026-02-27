'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Calendar, 
  Loader2, 
  Users,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const experts = [
  { 
    id: '1',
    name: 'Dr. Anil Patil',
    specialization: 'Soil & Crop Management',
    experience: '12 Years',
    location: 'Nashik',
    fee: '₹1500 per visit'
  },
  { 
    id: '2',
    name: 'Kavita Deshmukh',
    specialization: 'Organic Farming',
    experience: '8 Years',
    location: 'Pune',
    fee: '₹1200 per visit'
  },
  { 
    id: '3',
    name: 'Rohan Kulkarni',
    specialization: 'Irrigation Systems',
    experience: '10 Years',
    location: 'Aurangabad',
    fee: '₹1400 per visit'
  },
];

export default function GuideListPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/guide');
    }
  }, [user, isUserLoading, router]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Visit Requested",
      description: "Your farm visit request has been submitted successfully.",
    });
  };

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Agricultural Experts & Farm Guides</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Book experienced experts to visit your farm and improve your crop yield.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {experts.map((expert) => (
          <Card key={expert.id} className="group border-2 border-transparent hover:border-primary/20 shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-[2rem] bg-white overflow-hidden flex flex-col">
            <CardHeader className="pb-4 pt-10 px-8">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/5 p-3 rounded-2xl">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider">
                  Verified Expert
                </Badge>
              </div>
              <CardTitle className="text-3xl font-headline group-hover:text-primary transition-colors">
                {expert.name}
              </CardTitle>
              <p className="text-primary font-bold text-lg mt-1">{expert.specialization}</p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8 flex-1">
              <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{expert.experience} Experience</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{expert.location}, Maharashtra</span>
                </div>
                <div className="flex items-center gap-3 text-foreground font-bold">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span>{expert.fee}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]">
                    Book Visit
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Request Farm Visit</DialogTitle>
                    <DialogDescription>
                      Fill in your details to book a consultation with {expert.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="farmerName">Farmer Name</Label>
                      <Input id="farmerName" placeholder="Your full name" required className="rounded-xl h-12" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Farm Location</Label>
                      <Input id="location" placeholder="Address or Village" required className="rounded-xl h-12" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Input id="cropType" placeholder="e.g. Cotton, Wheat, Mango" required className="rounded-xl h-12" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input id="date" type="date" required className="rounded-xl h-12" />
                    </div>
                    <DialogFooter className="pt-6">
                      <Button type="submit" className="w-full h-12 rounded-xl font-bold">
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 p-10 rounded-[3rem] bg-primary/5 border border-dashed border-primary/20 text-center max-w-3xl mx-auto">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Professional Scientific Guidance</h3>
        <p className="text-muted-foreground">
          Our experts provide soil analysis, pest control strategies, and modern irrigation planning 
          to ensure your farm reaches its maximum potential.
        </p>
      </div>
    </div>
  );
}
