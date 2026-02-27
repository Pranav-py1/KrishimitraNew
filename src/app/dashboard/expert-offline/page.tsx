'use client';

import { useState } from 'react';
import { 
  MapPin, 
  UserCheck, 
  Calendar, 
  Star, 
  Award, 
  MessageSquare, 
  Search, 
  Clock, 
  User,
  Loader2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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

const DISTRICTS = [
  "Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana",
  "Yavatmal", "Washim", "Aurangabad", "Beed", "Jalna", "Osmanabad", "Nanded", "Latur",
  "Parbhani", "Hingoli", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Nagpur",
  "Wardha", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar", "Nashik", "Mumbai City",
  "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg"
];

const OFFLINE_GUIDES = [
  { id: '1', name: 'Santosh Kolekar', district: 'Ratnagiri', specialization: 'Fruit Crop Expert', experience: '10 Yrs', fee: 'Rs1500', rating: 4.9 },
  { id: '2', name: 'Amit Shet', district: 'Raigad', specialization: 'Rice Cultivation', experience: '15 Yrs', fee: 'Rs1200', rating: 4.8 },
  { id: '3', name: 'Yogesh Pawar', district: 'Thane', specialization: 'Vegetable Farming', experience: '7 Yrs', fee: 'Rs1000', rating: 4.7 },
  { id: '4', name: 'Dhananjay Patil', district: 'Palghar', specialization: 'Flower Plantation', experience: '9 Yrs', fee: 'Rs1400', rating: 4.8 },
  { id: '5', name: 'Rishikesh Parab', district: 'Sindhudurg', specialization: 'Cashew & Spice', experience: '11 Yrs', fee: 'Rs1300', rating: 4.9 },
  { id: '6', name: 'Vijay Ladole', district: 'Amravati', specialization: 'Cotton & Soybean', experience: '8 Yrs', fee: 'Rs1100', rating: 4.7 },
  { id: '7', name: 'Subash Tale', district: 'Akola', specialization: 'Soil Health Specialist', experience: '12 Yrs', fee: 'Rs1600', rating: 4.9 },
  { id: '8', name: 'Vijay Vilekar', district: 'Nagpur', specialization: 'Citrus (Orange) Specialist', experience: '14 Yrs', fee: 'Rs1800', rating: 5.0 },
  { id: '9', name: 'Om Singh Shekhawat', district: 'Gadchiroli', specialization: 'Forest Agri-products', experience: '20 Yrs', fee: 'Rs900', rating: 4.6 },
];

export default function OfflineExpertDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDistricts = DISTRICTS.filter(d => 
    d.toLowerCase().includes(searchTerm.toLowerCase()) ||
    OFFLINE_GUIDES.some(g => g.district === d && g.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Appointment Requested",
        description: "Your request has been sent to the expert guide.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <UserCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Offline Agricultural Guides</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Book experienced experts for on-field consultation. Professional scientific advice delivered right at your farm.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by district or guide name..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-16 max-w-6xl mx-auto">
        {filteredDistricts.map((district) => {
          const districtGuides = OFFLINE_GUIDES.filter(g => g.district === district);
          
          return (
            <section key={district} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-headline">{district}</h2>
              </div>
              <Separator className="mb-8 bg-primary/20" />
              
              {districtGuides.length === 0 ? (
                <div className="py-10 px-8 rounded-[2rem] bg-muted/20 border-2 border-dashed border-muted flex flex-col items-center justify-center text-center">
                  <User className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground font-medium">No offline guides available in this district currently.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {districtGuides.map((guide) => (
                    <Card key={guide.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="pb-2 pt-8 px-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <User className="h-7 w-7" />
                          </div>
                          <div className="flex items-center gap-1 font-black text-accent-foreground text-sm">
                            <Star className="h-4 w-4 fill-accent text-accent" /> {guide.rating}
                          </div>
                        </div>
                        <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                          {guide.name}
                        </CardTitle>
                        <p className="text-primary font-bold text-sm">{guide.specialization}</p>
                      </CardHeader>
                      <CardContent className="px-8 pb-6">
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Experience</p>
                            <p className="text-sm font-bold">{guide.experience}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Visit Fee</p>
                            <p className="text-sm font-bold text-primary">{guide.fee}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-4 grid grid-cols-2 gap-3 border-t border-dashed bg-muted/5">
                        <Button variant="outline" className="rounded-xl font-bold h-11">View Profile</Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl font-bold h-11 shadow-lg shadow-primary/10">Book Visit</Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2rem] max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary" /> Book On-Field Guidance
                              </DialogTitle>
                              <DialogDescription>
                                Schedule a farm visit with {guide.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                              <div className="grid gap-2">
                                <Label htmlFor="name">Farmer Name</Label>
                                <Input id="name" placeholder="Your full name" required className="rounded-xl h-12" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="location">Farm Location</Label>
                                <Input id="location" placeholder="Address or Village" required className="rounded-xl h-12" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="crop">Crop Type</Label>
                                <Input id="crop" placeholder="e.g. Mango, Rice, Cotton" required className="rounded-xl h-12" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="date">Preferred Date</Label>
                                <Input id="date" type="date" required className="rounded-xl h-12" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="issue">Issue Description</Label>
                                <Textarea id="issue" placeholder="Describe the problem you are facing..." className="rounded-xl min-h-[100px]" />
                              </div>
                              <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl font-bold text-lg">
                                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Request Appointment"}
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
