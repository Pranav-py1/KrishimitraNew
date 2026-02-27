'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Apple,
  Leaf,
  Wheat,
  Sprout,
  Milk,
  Flower2,
  Search,
  MapPin,
  ArrowRight,
  Star,
  MessageCircle,
  ShoppingBag,
  Filter,
  Tag,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Categories data
const categories = [
  { id: 'fruits', name: { en: 'Fruits', mr: 'फळे' }, icon: Apple, count: 42, color: 'bg-red-500/10 text-red-600' },
  { id: 'vegetables', name: { en: 'Vegetables', mr: 'भाज्या' }, icon: Leaf, count: 128, color: 'bg-green-500/10 text-green-600' },
  { id: 'grains', name: { en: 'Grains', mr: 'धान्ये' }, icon: Wheat, count: 85, color: 'bg-amber-500/10 text-amber-600' },
  { id: 'pulses', name: { en: 'Pulses', mr: 'कडधान्ये' }, icon: Sprout, count: 64, color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'dairy', name: { en: 'Dairy', mr: 'दुग्धजन्य' }, icon: Milk, count: 31, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'organic', name: { en: 'Organic', mr: 'सेंद्रिय' }, icon: Flower2, count: 56, color: 'bg-purple-500/10 text-purple-600' },
];

// Sample Products
const sampleProduce = [
  {
    id: 'p1',
    title: 'Organic Alphonso Mangoes',
    farmerName: 'Sanjay Patil',
    district: 'Ratnagiri',
    price: 850,
    unit: 'Dozen',
    quantity: 15,
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p2',
    title: 'Fresh Red Onions',
    farmerName: 'Rahul Deshmukh',
    district: 'Nashik',
    price: 35,
    unit: 'kg',
    quantity: 500,
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1729292933757-5e9d9e8d4ead?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p3',
    title: 'Premium Basmati Rice',
    farmerName: 'Vijay Kulkarni',
    district: 'Gondia',
    price: 120,
    unit: 'kg',
    quantity: 200,
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1609412058473-c199497c3c5d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p4',
    title: 'Natural Cow Ghee',
    farmerName: 'Sunita Pawar',
    district: 'Kolhapur',
    price: 750,
    unit: 'Litre',
    quantity: 25,
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=600&auto=format&fit=crop',
  },
];

// Sample Farmers
const featuredFarmers = [
  {
    id: 'f1',
    name: 'Sanjay Patil',
    specialization: 'Organic Mangoes',
    district: 'Ratnagiri',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Sunita Pawar',
    specialization: 'Dairy Products',
    district: 'Kolhapur',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'f3',
    name: 'Rahul Deshmukh',
    specialization: 'Vegetables',
    district: 'Nashik',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  },
];

export default function MarketPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488459711635-de03ef46d5e7?q=80&w=1200&auto=format&fit=crop"
          alt="Fresh market produce"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-sm font-bold mb-4 border border-white/10 uppercase tracking-widest">
            {language === 'en' ? 'Farm to Table' : 'शेतातून थेट ताटात'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight">
            {language === 'en' ? "Farmer's Market" : 'शेतकरी बाजारपेठ'}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-medium">
            {language === 'en' 
              ? 'The heartbeat of local agriculture. Source fresh, organic, and seasonal produce directly from the farmers who grow them.' 
              : 'स्थानिक शेतीचा केंद्रबिंदू. ताज्या, सेंद्रिय आणि हंगामी उत्पादने थेट उत्पादक शेतकऱ्यांकडून मिळवा.'}
          </p>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-12 bg-secondary/20 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <ShoppingBag className="text-primary h-6 w-6" />
              {language === 'en' ? 'Browse by Category' : 'प्रकारानुसार शोधा'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className="group cursor-pointer border-none shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={cn("p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110", cat.color)}>
                    <cat.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{cat.name[language]}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{cat.count} Items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-[6rem] z-30 py-6 bg-background/80 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={language === 'en' ? "Search products..." : "उत्पादने शोधा..."} 
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger className="w-[160px] h-12 rounded-xl bg-card">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <SelectValue placeholder={language === 'en' ? "District" : "जिल्हा"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nashik">Nashik</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="kolhapur">Kolhapur</SelectItem>
                  <SelectItem value="ratnagiri">Ratnagiri</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px] h-12 rounded-xl bg-card">
                  <Filter className="mr-2 h-4 w-4 text-primary" />
                  <SelectValue placeholder={language === 'en' ? "Category" : "प्रकार"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name[language]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] h-12 rounded-xl bg-card">
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  <SelectValue placeholder={language === 'en' ? "Sort By" : "क्रमवारी"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                  <SelectItem value="new">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh From Farmers Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">
                {language === 'en' ? 'Fresh From Farmers' : 'शेतकऱ्यांकडून थेट ताजे'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'en' ? 'Support local agriculture by buying directly.' : 'स्थानिक शेतीला पाठिंबा देण्यासाठी थेट खरेदी करा.'}
              </p>
            </div>
            <Button variant="link" className="text-primary font-bold p-0 group">
              {language === 'en' ? 'View All' : 'सर्व पहा'} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleProduce.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-[2rem] bg-card">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/50 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.district}</span>
                  </div>
                </div>
                <CardHeader className="pt-6 pb-2">
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors line-clamp-1">{product.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {product.farmerName}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between py-3 border-y border-dashed">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Price</p>
                      <p className="text-2xl font-black text-primary tracking-tight">₹{product.price}<span className="text-xs font-normal text-muted-foreground ml-1">/ {product.unit}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Quantity</p>
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-bold">{product.quantity} {product.unit}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pb-6 px-6">
                  <Button variant="outline" className="rounded-xl font-bold h-11 border-2">View Details</Button>
                  <Button className="rounded-xl font-bold h-11 shadow-lg shadow-primary/20">
                    <MessageCircle className="mr-2 h-4 w-4" /> Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farmers Section */}
      <section className="py-20 border-y relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight mb-4">
              {language === 'en' ? 'Featured Farmers' : 'वैशिष्ट्यीकृत शेतकरी'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Directly connect with the producers who are transforming agriculture with quality and dedication.' 
                : 'गुणवत्ता आणि निष्ठेने शेती बदलणाऱ्या उत्पादकांशी थेट संपर्क साधा.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {featuredFarmers.map((farmer) => (
              <Card key={farmer.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-[2.5rem] p-6 bg-card text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-dashed animate-spin duration-[10s]" />
                  <div className="absolute inset-1.5 rounded-full overflow-hidden border-2 border-primary">
                    <Image src={farmer.image} alt={farmer.name} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline mb-1">{farmer.name}</h3>
                <div className="flex items-center justify-center gap-1 text-primary font-bold text-sm mb-3">
                  <Star className="h-4 w-4 fill-primary" />
                  {farmer.rating}
                </div>
                <div className="space-y-1 mb-6">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{farmer.specialization}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {farmer.district}
                  </div>
                </div>
                <Button variant="ghost" className="w-full rounded-2xl font-bold text-primary hover:bg-primary hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="relative rounded-[3rem] bg-primary overflow-hidden p-8 md:p-16 text-center text-primary-foreground">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10"><Wheat className="h-32 w-32 rotate-12" /></div>
            <div className="absolute bottom-10 right-10"><Sprout className="h-32 w-32 -rotate-12" /></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
              {language === 'en' ? 'Sell Your Harvest Directly' : 'तुमचा माल थेट विका'}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed font-medium">
              {language === 'en' 
                ? 'Join KrishiMitra and connect directly with consumers and exporters. Get the best price for your hard work.' 
                : 'कृषिमित्र मध्ये सामील व्हा आणि ग्राहक आणि निर्यातदारांशी थेट संपर्क साधा. तुमच्या मेहनतीला योग्य भाव मिळवा.'}
            </p>
            <Button size="lg" className="h-14 px-10 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all" asChild>
              <Link href="/farmer/add-produce">
                {language === 'en' ? 'Add Your Product' : 'तुमचे उत्पादन जोडा'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
