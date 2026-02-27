
'use client';

import { useState, useEffect } from 'react';
import { Tractor, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';

const translations = {
  en: {
    title: "Farm Machinery for Rent",
    comingSoon: "Machinery Rental Feature Coming Soon 🚜",
    description: "We are currently developing our farm machinery rental system. This feature will be launched in an upcoming update. Stay connected for exciting new services.",
    notify: "Notify Me"
  },
  mr: {
    title: "भाड्याने शेती यंत्रसामग्री",
    comingSoon: "यंत्रसामग्री भाडे तत्व वैशिष्ट्य लवकरच येत आहे 🚜",
    description: "आम्ही सध्या आमची शेती यंत्रसामग्री भाड्याने देण्याची प्रणाली विकसित करत आहोत. हे वैशिष्ट्य आगामी अपडेटमध्ये लाँच केले जाईल. नवीन सेवांसाठी संपर्कात रहा.",
    notify: "मला कळवा"
  }
};

export default function MachinesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-1000">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 tracking-tight">
          {t.title}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <Card className="border-none shadow-soft-xl rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm border border-primary/5">
          <CardContent className="p-12 md:p-20 flex flex-col items-center">
            <div className="bg-primary/10 p-8 rounded-[2.5rem] mb-10 group transition-transform duration-500 hover:rotate-6">
              <Tractor className="h-24 w-24 text-primary transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6 tracking-tight text-foreground">
              {t.comingSoon}
            </h2>
            
            <p className="text-muted-foreground text-lg md:text-xl mb-12 leading-relaxed font-medium">
              {t.description}
            </p>
            
            <Button size="lg" className="h-14 px-10 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
              <Bell className="h-5 w-5" />
              {t.notify}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
