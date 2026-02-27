'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  UserCheck, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Star, 
  Award,
  Calendar,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const expertGuides = [
  { 
    id: '1',
    name: 'Dr. Anil Patil',
    specialization: 'Soil Health & Crop Management',
    experience: '12 Years',
    location: 'Nashik, Maharashtra',
    address: 'Krishi Seva Bhavan, College Road, Nashik 422005',
    consultation: 'Offline Farm Visit',
    fee: '₹1500',
    rating: 4.8,
    qualifications: 'PhD in Agronomy from Mahatma Phule Krishi Vidyapeeth',
    expertise: ['Soil Testing & Analysis', 'Nutrient Management', 'Sustainable Irrigation', 'Kharif Crop Planning'],
    projects: ['Managed 500+ acres of Grape orchards', 'Soil rejuvenation project in Sinnar', 'Implemented drip automation for 50 farmers'],
    availability: 'Monday - Saturday (8 AM - 6 PM)',
    process: 'Booking -> Phone Consultation -> Farm Visit -> Soil Testing -> Action Plan Report',
    contact: '+91 98765 11111',
    email: 'anil.patil@agriexpert.in'
  },
  { 
    id: '2',
    name: 'Ms. Kavita Deshmukh',
    specialization: 'Organic Farming & Pest Control',
    experience: '8 Years',
    location: 'Pune, Maharashtra',
    address: 'Flat 102, Green Avenue, Baner, Pune 411045',
    consultation: 'Offline Farm Visit',
    fee: '₹1200',
    rating: 4.6,
    qualifications: 'MSc in Horticulture from Pune University',
    expertise: ['ZBNF (Zero Budget Natural Farming)', 'Integrated Pest Management', 'Vermicomposting', 'Organic Certification'],
    projects: ['Organic conversion of 20 farms', 'Pest-free vegetable production model', 'Community composting leader'],
    availability: 'Tuesday - Sunday (9 AM - 5 PM)',
    process: 'Booking -> Site Inspection -> Pest Identification -> Natural Solution Design',
    contact: '+91 98765 22222',
    email: 'kavita.d@organicguide.in'
  },
  { 
    id: '3',
    name: 'Mr. Rohan Kulkarni',
    specialization: 'Irrigation & Water Management',
    experience: '10 Years',
    location: 'Aurangabad, Maharashtra',
    address: 'Plot 45, CIDCO Sector N-2, Aurangabad 431003',
    consultation: 'Offline Farm Visit',
    fee: '₹1400',
    rating: 4.7,
    qualifications: 'BTech in Agricultural Engineering',
    expertise: ['Drip & Sprinkler Systems', 'Water Harvesting', 'Micro-irrigation Design', 'Water Table Recharge'],
    projects: ['Irrigation network for 100 villages', 'Watershed development in Beed', 'Automated Fertigation systems'],
    availability: 'Monday - Friday (10 AM - 7 PM)',
    process: 'Booking -> Water Source Analysis -> Topography Mapping -> System Design',
    contact: '+91 98765 33333',
    email: 'rohan.k@waterwise.in'
  },
  { 
    id: '4',
    name: 'Dr. Suresh Gupta',
    specialization: 'High-Yield Seed Selection & Fertilizer Planning',
    experience: '15 Years',
    location: 'Mumbai, Maharashtra',
    address: 'Agri Research Center, Goregaon East, Mumbai 400063',
    consultation: 'Offline Farm Visit',
    fee: '₹1800',
    rating: 4.9,
    qualifications: 'PhD in Plant Breeding & Genetics',
    expertise: ['Seed Quality Assessment', 'Precision Fertilization', 'Hybrid Variety Selection', 'Climate-Resilient Crops'],
    projects: ['Yield doubling project for 200 farmers', 'Introduced flood-resistant rice varieties', 'Fertilizer efficiency consultant'],
    availability: 'Monday - Saturday (9 AM - 6 PM)',
    process: 'Booking -> Crop History Review -> Variety Recommendation -> Nutrition Schedule',
    contact: '+91 98765 44444',
    email: 'suresh.gupta@cropplan.in'
  },
];

export default function GuideDetailPage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name as string);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/guide');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const expert = expertGuides.find(g => g.name === decodedName);

  if (!expert) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Expert profile not found.</h2>
        <Button asChild className="mt-4"><Link href="/connect/guide">Back to List</Link></Button>
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
        description: "Your farm visit request has been sent to " + expert.name,
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/connect/guide"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Experts</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl">
                <UserCheck className="h-12 w-12" />
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{expert.name}</CardTitle>
              <Badge className="bg-white/90 text-primary border-none font-black uppercase text-[10px] tracking-widest mt-2 px-4 py-1.5 rounded-full relative z-10">
                Certified Expert
              </Badge>
              <div className="flex items-center justify-center gap-1 mt-4 relative z-10 text-white font-bold">
                <Star className="h-4 w-4 fill-white" />
                {expert.rating} Rating
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-1" />
                  <p className="text-sm font-medium leading-relaxed italic opacity-90">
                    {expert.address}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Phone className="h-4 w-4" /></div>
                  <span className="font-bold text-sm">{expert.contact}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Mail className="h-4 w-4" /></div>
                  <span className="font-bold text-sm">{expert.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Clock className="h-4 w-4" /></div>
                  <span className="font-bold text-sm leading-tight">Available: {expert.availability}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-16 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all bg-accent text-accent-foreground hover:bg-accent/90">
                <Calendar className="mr-3 h-6 w-6" /> Book Farm Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">Schedule a Farm Visit</DialogTitle>
                <DialogDescription>
                  Request {expert.name} to visit your farm for professional guidance.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="farmerName">Farmer Name</Label>
                  <Input id="farmerName" placeholder="Your full name" required className="rounded-xl h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input id="location" placeholder="Detailed farm address" required className="rounded-xl h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Input id="cropType" placeholder="e.g. Rice, Mango, Cotton" required className="rounded-xl h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" required className="rounded-xl h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="issue">Issue Description</Label>
                  <Textarea id="issue" placeholder="What specific problems are you facing?" required className="rounded-xl" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isBooking} className="w-full h-12 rounded-xl font-bold">
                    {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Farm Visit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Requirements Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" /> Qualifications & Experience
              </CardTitle>
              <CardDescription>Academic background and professional tenure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="p-6 bg-muted/30 rounded-3xl border border-dashed flex items-start gap-4">
                <Briefcase className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-bold">{expert.qualifications}</p>
                  <p className="text-sm text-muted-foreground mt-1">{expert.experience} of fieldwork in agriculture.</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" /> Key Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {expert.expertise.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white text-primary border border-primary/10 px-4 py-2 rounded-2xl font-bold shadow-sm">
                      <ShieldCheck className="h-4 w-4" /> {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Successful Farm Projects
                </h3>
                <div className="grid gap-3">
                  {expert.projects.map((project, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/20 border-l-4 border-primary font-medium text-sm">
                      {project}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-dashed">
                <h3 className="text-lg font-bold mb-4">Farm Visit Process</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Workflow</p>
                    <p className="text-sm font-medium leading-relaxed">{expert.process}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Standard Fee</p>
                    <p className="text-3xl font-black text-primary">{expert.fee}</p>
                    <p className="text-xs text-muted-foreground mt-1">Payable after visit</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-dashed bg-muted/10 p-8 flex justify-center">
              <div className="text-center">
                <p className="text-sm font-bold text-muted-foreground mb-4">Get professional scientific guidance right at your doorstep.</p>
                <Button className="rounded-2xl h-12 px-10 font-bold" variant="outline" asChild>
                  <Link href="/messages">
                    Send Query
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
