
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShoppingBasket,
  Tractor,
  Wheat,
  Store,
  User,
  Truck,
  Wrench,
  BookOpen,
  Loader2,
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
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    heroTitle: 'Cultivating Trust, Powering Growth',
    heroSub: 'Your all-in-one digital platform for modern farming. Rent advanced machinery, source quality agri-inputs, and trade produce directly with your community.',
    getStarted: 'Explore Now',
    ourServices: 'Empowering Farmers',
    servicesSub: 'Everything you need to boost productivity and sustainability, right at your fingertips.',
    registerTitle: 'Join the KrishiMitra Community',
    registerSub: 'Be part of a growing network of farmers, dealers, and consumers transforming the agricultural landscape.',
    registerBtn: 'Get Started',
    alreadyRegistered: 'Already registered on KrishiMitra?',
    goDashboard: 'Go to Dashboard',
    continueDashboard: 'Continue to Dashboard',
    welcomeBack: 'Welcome back',
    accessTools: 'Access your profile and management tools instantly.',
    features: [
      { title: 'Rent Machinery', description: 'Access top-tier farm equipment on-demand to optimize your labor and yield.', href: '/machines' },
      { title: 'Agri Products', description: 'Verified seeds, fertilizers, and tools from trusted local retailers.', href: '/products' },
      { title: 'Direct Market', description: 'Eliminate middlemen. Sell your fresh harvest directly to consumers.', href: '/market' },
      { title: 'Smart Guide', description: 'Expert insights and production trends tailored for Maharashtra.', href: '/guide' },
    ],
    roles: [
      { title: 'Farmer', description: 'Maximize your yield and connect directly with markets.' },
      { title: 'Exporter', description: 'Purchase agricultural products in bulk directly from farmers and distribute them to national and international markets.' },
      { title: 'Consumer', description: 'Enjoy fresh, traceable produce straight from the source.' },
      { title: 'Supplier', description: 'Provide essential farming products like seeds, fertilizers, tools, and equipment directly to farmers based on their needs.' },
      { title: 'Expert', description: 'Offer specialized services like soil testing and advice.' },
    ]
  },
  mr: {
    heroTitle: 'विश्वास जोपासा, प्रगती साधा',
    heroSub: 'आधुनिक शेतीसाठी तुमचे सर्वसमावेशक डिजिटल व्यासपीठ. प्रगत यंत्रसामग्री भाड्याने घ्या, दर्जेदार निविष्ठा मिळवा आणि थेट समुदायाशी व्यापार करा.',
    getStarted: 'आत्ताच एक्सप्लोर करा',
    ourServices: 'शेतकऱ्यांचे सक्षमीकरण',
    servicesSub: 'उत्पादकता आणि शाश्वतता वाढवण्यासाठी तुम्हाला आवश्यक असलेले सर्व काही, एकाच ठिकाणी.',
    registerTitle: 'कृषिमित्र समुदायात सामील व्हा',
    registerSub: 'कृषी क्षेत्राचा कायापालट करणाऱ्या शेतकरी, विक्रेते आणि ग्राहकांच्या वाढत्या नेटवर्कचा भाग व्हा.',
    registerBtn: 'सुरुवात करा',
    alreadyRegistered: 'कृषिमित्र वर आधीच नोंदणी केली आहे का?',
    goDashboard: 'डॅशबोर्डवर जा',
    continueDashboard: 'डॅशबोर्ड सुरू ठेवा',
    welcomeBack: 'पुनश्च स्वागत',
    accessTools: 'तुमचे प्रोफाइल आणि व्यवस्थापन साधने त्वरित मिळवा.',
    features: [
      { title: 'यंत्रसामग्री भाड्याने', description: 'तुमचे श्रम आणि उत्पादन ऑप्टिमाइझ करण्यासाठी मागणीनुसार सर्वोत्तम उपकरणे मिळवा.', href: '/machines' },
      { title: 'कृषी उत्पादने', description: 'विश्वासू स्थानिक विक्रेत्यांकडून प्रमाणित बियाणे, खते आणि साधने.', href: '/products' },
      { title: 'थेट बाजार', description: 'मध्यस्थ काढा. तुमचा ताजा माल थेट ग्राहकांना विका.', href: '/market' },
      { title: 'स्मार्ट मार्गदर्शक', description: 'महाराष्ट्रासाठी खास तज्ज्ञ सल्ला आणि उत्पादन कल.', href: '/guide' },
    ],
    roles: [
      { title: 'शेतकरी', description: 'तुमचे उत्पादन वाढवा och थेट बाजारपेठेशी जोडा.' },
      { title: 'निर्यातदार', description: 'शेतकऱ्यांकडून थेट मोठ्या प्रमाणात कृषी उत्पादने खरेदी करा आणि त्यांची राष्ट्रीय आणि आंतरराष्ट्रीय बाजारपेठेत विक्री करा.' },
      { title: 'ग्राहक', description: 'थेट शेतातून आलेल्या ताज्या मालाचा आनंद घ्या.' },
      { title: 'पुरवठादार', description: 'शेतकऱ्यांच्या गरजेनुसार बियाणे, खते, अवजारे आणि उपकरणे यांसारखी आवश्यक शेती उत्पादने थेट शेतकऱ्यांना पुरवा.' },
      { title: 'तज्ज्ञ', description: 'माती परीक्षण आणि सल्ल्यासारख्या विशेष सेवा द्या.' },
    ]
  }
};

const featureIcons = [
  <Tractor key="t" className="mb-4 h-12 w-12 text-primary" />,
  <ShoppingBasket key="s" className="mb-4 h-12 w-12 text-primary" />,
  <Wheat key="w" className="mb-4 h-12 w-12 text-primary" />,
  <BookOpen key="b" className="mb-4 h-12 w-12 text-primary" />,
];

const roleIcons = [Wheat, Truck, User, Store, Wrench];
const roleValues = ['farmer', 'exporter', 'consumer', 'supplier', 'service_provider'];

export default function Home() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const t = translations[language];
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-farmer');

  const { user, userData, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardRedirect = () => {
    if (user && userData?.role) {
      const normalizedRole = userData.role.trim().toLowerCase().replace('_', '-');
      router.push(`/dashboard/${normalizedRole}`);
    } else {
      router.push('/login');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh overflow-hidden bg-background">
      <main className="flex-1">
        <section className="relative w-full h-[75vh] min-h-[600px] overflow-hidden">
          {heroImage && (
             <Image
              alt="Farmer in a field"
              src={heroImage.imageUrl}
              fill
              className="object-cover scale-105 animate-in fade-in duration-1000 zoom-in-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative container mx-auto h-full px-4 md:px-6 flex flex-col items-start justify-center text-left text-white">
            <div className="max-w-3xl animate-in fade-in slide-in-from-left-8 duration-700">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-sm font-bold mb-6 border border-white/10">
                {language === 'en' ? 'Trusted by 10,000+ Farmers' : '१०,०००+ शेतकऱ्यांचा विश्वास'}
              </span>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl font-headline mb-6 drop-shadow-sm">
                {t.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg md:text-2xl text-white/90 mb-10 leading-relaxed">
                {t.heroSub}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 rounded-full shadow-lg shadow-accent/20 text-lg font-bold">
                  <Link href="/machines">
                    {t.getStarted} <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 border-2 border-white bg-muted text-primary hover:bg-muted/90 backdrop-blur-sm transition-all rounded-full text-lg font-bold shadow-lg">
                  <Link href="/guide">
                    {language === 'en' ? 'View Guide' : 'मार्गदर्शक पहा'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">{t.ourServices}</h2>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                {t.servicesSub}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {t.features.map((feature, idx) => (
                <Card 
                  key={idx} 
                  className={cn(
                    "group flex flex-col items-center text-center transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-3 border-none bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-2 p-4 rounded-3xl bg-primary/5 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      {featureIcons[idx]}
                    </div>
                    <CardTitle className="font-headline text-2xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed px-2">{feature.description}</CardDescription>
                  </CardHeader>
                  <div className="flex-grow flex items-end w-full pb-8 px-8">
                    <Button variant="ghost" asChild className="w-full h-12 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Link href={feature.href} className="font-bold">
                        {t.registerBtn} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-20 md:py-32 border-y relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-6">{t.registerTitle}</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl/relaxed">
                {t.registerSub}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-16">
              {t.roles.map((role, index) => {
                const Icon = roleIcons[index];
                return (
                  <Card 
                    key={index} 
                    className={cn(
                      "flex flex-col text-center items-center justify-between transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-4 border-none bg-card group shadow-soft",
                      index === 4 && "sm:col-span-2 lg:col-span-1"
                    )}
                  >
                    <CardHeader className="flex flex-col items-center pt-8">
                      <div className="p-5 rounded-[2rem] bg-primary/10 mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 scale-100 group-hover:rotate-12">
                        <Icon className="h-10 w-10 text-primary group-hover:text-current" />
                      </div>
                      <CardTitle className="font-headline text-2xl mb-3">{role.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{role.description}</CardDescription>
                    </CardHeader>
                    <div className="w-full pb-10 px-8">
                      <Button asChild className="w-full h-12 rounded-2xl shadow-lg transition-all group-hover:scale-105 font-bold">
                        <Link href={`/register?role=${roleValues[index]}`}>
                          {t.registerBtn} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Already Registered Section */}
            <div className="max-w-2xl mx-auto">
              <Card className="border-none shadow-soft-xl rounded-[2.5rem] bg-primary/5 p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex flex-col items-center gap-6">
                  {user ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold font-headline">{t.welcomeBack}, {userData?.name || 'Friend'}</h3>
                        <p className="text-muted-foreground text-lg">You are already signed in to your KrishiMitra account.</p>
                      </div>
                      <Button onClick={handleDashboardRedirect} size="lg" className="h-14 px-10 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all">
                        {t.continueDashboard} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold font-headline text-foreground">{t.alreadyRegistered}</h3>
                        <p className="text-muted-foreground text-lg">{t.accessTools}</p>
                      </div>
                      <Button onClick={() => router.push('/login')} variant="outline" size="lg" className="h-14 px-10 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold text-lg shadow-md transition-all">
                        {t.goDashboard} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
