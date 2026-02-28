
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Milk, Bird, Zap, Stethoscope, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const translations = {
  en: {
    title: 'Livestock Management',
    description: 'Empowering your farm with modern livestock solutions. Manage dairy, poultry, nutrition, and veterinary needs all in one digital hub.',
    dairy: 'Dairy',
    dairyDesc: 'Optimized milk production, cattle management, and high-quality dairy equipment.',
    poultry: 'Poultry',
    poultryDesc: 'Essential tools and insights for layer and broiler farming efficiency.',
    feed: 'Feed & Nutrition',
    feedDesc: 'Access to premium quality fodder, silages, and balanced nutritional supplements.',
    health: 'Health & Vet Services',
    healthDesc: 'Connect with certified local veterinarians and source essential medical supplies.',
    viewSection: 'Explore Now',
  },
  mr: {
    title: 'पशुपालन व्यवस्थापन',
    description: 'आधुनिक पशुपालन उपायांसह तुमच्या शेतीचे सक्षमीकरण करा. दुग्धव्यवसाय, कुक्कुटपालन, पोषण आणि पशुवैद्यकीय गरजा एकाच ठिकाणी व्यवस्थापित करा.',
    dairy: 'दुग्धव्यवसाय',
    dairyDesc: 'इष्टतम दूध उत्पादन, गुरेढोरे व्यवस्थापन आणि उच्च दर्जाची दुग्धशाळा उपकरणे.',
    poultry: 'कुक्कुटपालन',
    poultryDesc: 'लेयर आणि ब्रॉयलर फार्मिंग कार्यक्षमतेसाठी आवश्यक साधने आणि माहिती.',
    feed: 'चारा आणि पोषण',
    feedDesc: 'दर्जेदार चारा, सायलेज आणि संतुलित पोषण पूरक आहाराची उपलब्धता.',
    health: 'आरोग्य आणि पशुवैद्यकीय सेवा',
    healthDesc: 'प्रमाणित स्थानिक पशुवैद्यकांशी संपर्क साधा आणि आवश्यक औषधांचा पुरवठा मिळवा.',
    viewSection: 'आत्ताच पहा',
  }
};

const categories = [
  {
    id: 'dairy',
    icon: Milk,
    href: '/livestock/dairy',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 'poultry',
    icon: Bird,
    href: '/livestock/poultry',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    id: 'feed',
    icon: Zap,
    href: '/livestock/feed',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    id: 'health',
    icon: Stethoscope,
    href: '/livestock/health',
    color: 'bg-red-500/10 text-red-600',
  },
];

export default function LivestockPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const t = translations[language];

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
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">Livestock Hub</span>
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const categoryKey = cat.id as keyof typeof t;
            const descKey = `${cat.id}Desc` as keyof typeof t;

            return (
              <Card 
                key={cat.id}
                className="group border-none shadow-soft transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-3 rounded-[2.5rem] bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <CardHeader className="pt-10 flex flex-col items-center text-center">
                  <div className={cn("p-6 rounded-[2rem] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm mb-6", cat.color)}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl font-headline mb-3">{t[categoryKey] as string}</CardTitle>
                  <CardDescription className="text-base px-2 leading-relaxed">
                    {t[descKey] as string}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-10 px-8">
                  <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-bold border-2 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                    <Link href={cat.href}>
                      {t.viewSection} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
