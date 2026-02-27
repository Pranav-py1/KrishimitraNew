'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Tractor,
  Wheat,
  Store,
  User,
  Truck,
  Wrench,
  BookOpen,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';
import { useRole, type UserRole } from '@/components/role-context';

const translations = {
  en: {
    heroTitle: 'Cultivating Trust, Powering Growth',
    heroSub: 'An all-in-one digital marketplace connecting farmers directly with consumers, retailers, and exporters. Enable bulk order management, seamless delivery logistics, quality certification, transparent pricing, and secure farmer payment tracking — without middlemen.',
    selectRole: 'Choose Your Role',
    selectRoleSub: 'Select a persona to explore tailored dashboards and specialized agricultural tools.',
    continueAs: 'Continue as',
    roles: [
      { id: 'farmer', title: 'Farmer', description: 'Maximize your yield and connect directly with markets.', icon: Wheat },
      { id: 'exporter', title: 'Exporter', description: 'Purchase products in bulk and distribute to international markets.', icon: Truck },
      { id: 'consumer', title: 'Consumer', description: 'Enjoy fresh, traceable produce straight from the source.', icon: User },
      { id: 'supplier', title: 'Supplier', description: 'Provide essential inputs like seeds and tools to farmers.', icon: Store },
    ]
  },
  mr: {
    heroTitle: 'विश्वास जोपासा, प्रगती साधा',
    heroSub: 'शेतकऱ्यांना ग्राहक, किरकोळ विक्रेते आणि निर्यातदारांशी थेट जोडणारी सर्वसमावेशक डिजिटल बाजारपेठ. मोठ्या प्रमाणात ऑर्डर व्यवस्थापन, अखंड वितरण लॉजिस्टिक, गुणवत्ता प्रमाणपत्र, पारदर्शक किंमत आणि सुरक्षित शेतकरी पेमेंट ट्रॅकिंग सक्षम करा — मध्यस्थांशिवाय.',
    selectRole: 'तुमची भूमिका निवडा',
    selectRoleSub: 'तुमच्या गरजेनुसार डॅशबोर्ड आणि कृषी साधनांमध्ये प्रवेश करण्यासाठी एक पर्याय निवडा.',
    continueAs: 'म्हणून सुरू ठेवा',
    roles: [
      { id: 'farmer', title: 'शेतकरी', description: 'तुमचे उत्पादन वाढवा आणि थेट बाजारपेठेशी जोडा.', icon: Wheat },
      { id: 'exporter', title: 'निर्यातदार', description: 'मोठ्या प्रमाणात माल खरेदी करा आणि आंतरराष्ट्रीय बाजारात विक्री करा.', icon: Truck },
      { id: 'consumer', title: 'ग्राहक', description: 'थेट शेतातून आलेल्या ताज्या मालाचा आनंद घ्या.', icon: User },
      { id: 'supplier', title: 'पुरवठादार', description: 'शेतकऱ्यांना बियाणे आणि अवजारे यांसारख्या निविष्ठा पुरवा.', icon: Store },
    ]
  }
};

export default function Home() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const { setRole, role: currentRole, isLoading } = useRole();
  const t = translations[language];
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-farmer');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh overflow-hidden bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
          {heroImage && (
             <Image
              alt="Farmer in a field"
              src={heroImage.imageUrl}
              fill
              className="object-cover animate-in fade-in duration-1000 brightness-[0.85] dark:brightness-[0.75]"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto h-full px-4 md:px-6 flex flex-col items-center justify-center text-center text-white">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl font-headline mb-6">
                {t.heroTitle}
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/90 mb-10 leading-relaxed">
                {t.heroSub}
              </p>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section className="py-20 md:py-32 relative -mt-20 z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">{t.selectRole}</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl/relaxed">
                {t.selectRoleSub}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {t.roles.map((role) => {
                const Icon = role.icon;
                const isSelected = currentRole === role.id;

                return (
                  <Card 
                    key={role.id} 
                    onClick={() => setRole(role.id as UserRole)}
                    className={cn(
                      "flex flex-col text-center items-center justify-between transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-4 border-none bg-card group cursor-pointer relative overflow-hidden",
                      isSelected ? "ring-4 ring-primary ring-offset-4 ring-offset-background" : "shadow-soft"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    )}
                    <CardHeader className="flex flex-col items-center pt-10">
                      <div className={cn(
                        "p-6 rounded-[2.5rem] mb-8 transition-all duration-500 scale-100 group-hover:rotate-12",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      )}>
                        <Icon className="h-12 w-12" />
                      </div>
                      <CardTitle className="font-headline text-2xl mb-3">{role.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{role.description}</CardDescription>
                    </CardHeader>
                    <div className="w-full pb-10 px-8">
                      <Button className={cn(
                        "w-full h-12 rounded-2xl shadow-lg transition-all font-bold",
                        isSelected ? t.continueAs : t.selectRole
                      )}>
                        {isSelected ? t.continueAs : t.selectRole} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
