'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShoppingBag, 
  Star, 
  Info, 
  ChevronRight, 
  MessageCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Apple,
  ArrowRight,
  User,
  PackageCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Sample Data for UI Enhancement
const SAMPLE_PRODUCE = [
  {
    id: 'p1',
    name: 'Organic Alphonso Mangoes',
    farmerName: 'Sanjay Patil',
    district: 'Ratnagiri',
    type: 'Fruits',
    price: 850,
    unit: 'Dozen',
    quantity: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600',
    crops: ['Mango', 'Cashew', 'Kokum'],
    location: 'Vengurla, Ratnagiri'
  },
  {
    id: 'p2',
    name: 'Fresh Red Onions',
    farmerName: 'Rahul Deshmukh',
    district: 'Nashik',
    type: 'Vegetables',
    price: 35,
    unit: 'kg',
    quantity: 500,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1729292933757-5e9d9e8d4ead?q=80&w=600',
    crops: ['Onion', 'Grapes', 'Tomato'],
    location: 'Lasalgaon, Nashik'
  },
  {
    id: 'p3',
    name: 'Premium Basmati Rice',
    farmerName: 'Vijay Kulkarni',
    district: 'Gondia',
    type: 'Grains',
    price: 120,
    unit: 'kg',
    quantity: 200,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1609412058473-c199497c3c5d?q=80&w=600',
    crops: ['Rice', 'Wheat', 'Pulses'],
    location: 'Arjuni Morgaon, Gondia'
  },
  {
    id: 'p4',
    name: 'Fresh Spinach (Palak)',
    farmerName: 'Anita Shinde',
    district: 'Pune',
    type: 'Organic',
    price: 20,
    unit: 'Bunch',
    quantity: 100,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600',
    crops: ['Spinach', 'Cilantro', 'Methi'],
    location: 'Manchar, Pune'
  }
];

const DISTRICTS = ["Ratnagiri", "Nashik", "Gondia", "Pune", "Nagpur", "Sangli"];
const TYPES = ["Vegetables", "Fruits", "Grains", "Organic"];

export default function ConsumerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('none');
  const { toast } = useToast();

  const filteredProduce = useMemo(() => {
    return SAMPLE_PRODUCE.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = districtFilter === 'all' || p.district === districtFilter;
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesDistrict && matchesType;
    }).sort((a, b) => {
      if (priceSort === 'low') return a.price - b.price;
      if (priceSort === 'high') return b.price - a.price;
      return 0;
    });
  }, [searchTerm, districtFilter, typeFilter, priceSort]);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Sent",
      description: "The farmer has been notified of your interest.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-6 shadow-soft">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">Consumer Dashboard</h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Discover fresh produce from trusted farmers near you.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card className="mb-12 border-none shadow-soft rounded-[2rem] bg-card/50 backdrop-blur-sm p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="lg:col-span-2 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Marketplace</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
              <Input 
                placeholder="Search vegetables, fruits, or farmers..." 
                className="pl-12 h-14 rounded-2xl border-2 focus:border-primary transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-center block">District</Label>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="h-14 rounded-2xl border-2 bg-white font-bold">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="All Districts" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl">
                <SelectItem value="all">All Districts</SelectItem>
                {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-center block">Product Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-14 rounded-2xl border-2 bg-white font-bold">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl">
                <SelectItem value="all">All Types</SelectItem>
                {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-center block">Price Filter</Label>
            <Select value={priceSort} onValueChange={setPriceSort}>
              <SelectTrigger className="h-14 rounded-2xl border-2 bg-white font-bold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Sort by Price" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl">
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Featured Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline">Fresh Picks Today</h2>
          </div>
          <Button variant="ghost" className="text-primary font-bold group">
            View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProduce.map((item) => (
            <Card key={item.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-card overflow-hidden flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary font-black uppercase text-[10px] tracking-widest border-none shadow-sm px-3 py-1.5 rounded-full">
                  {item.type}
                </Badge>
              </div>
              <CardHeader className="pt-6 pb-2">
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors line-clamp-1">{item.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-bold text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {item.district}
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex items-center justify-between py-3 border-y border-dashed mt-2">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Price</p>
                    <p className="text-2xl font-black text-primary">Rs{item.price}<span className="text-xs font-normal text-muted-foreground">/{item.unit}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Rating</p>
                    <div className="flex items-center gap-1 font-black text-sm text-accent-foreground">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {item.rating}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2 transition-all">View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2.5rem] max-w-2xl">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center border-2 border-primary/10">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl font-headline">{item.farmerName}</DialogTitle>
                          <DialogDescription className="flex items-center gap-1 font-bold text-primary">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-2 py-4">
                      <div className="p-6 rounded-3xl bg-muted/30 border border-dashed">
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Major Crops Available</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.crops.map(c => (
                            <Badge key={c} variant="secondary" className="rounded-lg font-bold">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Quality & Trust</h4>
                        <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                          "Grown with traditional methods and certified organic fertilizers. We ensure same-day picking for delivery."
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 border-t border-dashed">
                      <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg">
                        <MessageCircle className="mr-2 h-5 w-5" /> Chat with Farmer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10 bg-accent text-accent-foreground hover:bg-accent/90">
                      Send Purchase Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2.5rem] max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                        <PackageCheck className="h-6 w-6 text-primary" /> Purchase Interest
                      </DialogTitle>
                      <DialogDescription>
                        Express your interest in buying {item.name} from {item.farmerName}.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendRequest} className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="qty">Quantity Required ({item.unit})</Label>
                        <Input id="qty" type="number" placeholder="e.g. 5" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="date">Preferred Delivery Date</Label>
                        <Input id="date" type="date" required className="rounded-xl h-12" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="msg">Message to Farmer</Label>
                        <Textarea id="msg" placeholder="Tell the farmer about your requirement..." className="rounded-xl min-h-[100px]" />
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg">
                          Confirm Interest
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProduce.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
            <Info className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-xl font-bold text-muted-foreground">No matching produce found.</p>
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="bg-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest mb-6">Consumer Assurance</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 tracking-tight">Direct From The Earth</h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed">
              Every purchase on KrishiMitra goes directly to the farmer. By cutting out middlemen, you get the freshest produce at honest prices while supporting local agriculture.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <CheckCircle2 className="h-8 w-8 mb-4 opacity-60" />
              <p className="font-bold text-sm">Quality Guaranteed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <ShoppingBag className="h-8 w-8 mb-4 opacity-60" />
              <p className="font-bold text-sm">No Middlemen</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <MapPin className="h-8 w-8 mb-4 opacity-60" />
              <p className="font-bold text-sm">Local Sourcing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <Clock className="h-8 w-8 mb-4 opacity-60" />
              <p className="font-bold text-sm">Same Day Harvest</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
