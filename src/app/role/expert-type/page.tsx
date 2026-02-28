'use client';

import { useRole } from '@/components/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Monitor, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExpertTypePage() {
  const { setRole } = useRole();
  const { language } = useLanguage();

  const isEn = language === 'en';

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> {isEn ? 'Back to Roles' : 'भूमिका निवडीकडे परत'}
          </Link>
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">
            {isEn ? 'Select Guidance Type' : 'मार्गदर्शनाचा प्रकार निवडा'}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            {isEn ? 'Choose how you would like to offer your agricultural expertise.' : 'तुम्ही तुमचे कृषी कौशल्य कसे देऊ इच्छिता ते निवडा.'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Online Expert */}
          <Card className="border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-card flex flex-col h-full overflow-hidden group">
            <CardHeader className="pt-12 pb-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Monitor className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-headline mb-3">
                {isEn ? 'Online Guidance' : 'ऑनलाइन मार्गदर्शन'}
              </CardTitle>
              <CardDescription className="text-base px-4">
                {isEn ? 'Provide remote consultation via chat or video call to help farmers solve problems instantly.' : 'शेतकऱ्यांना समस्यांचे त्वरित निराकरण करण्यात मदत करण्यासाठी चॅट किंवा व्हिडिओ कॉलद्वारे दूरस्थ सल्ला प्रदान करा.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12 px-8 mt-auto">
              <Button 
                onClick={() => setRole('expert-online')}
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
              >
                {isEn ? 'Continue as Online Expert' : 'ऑनलाइन तज्ज्ञ म्हणून सुरू ठेवा'}
              </Button>
            </CardContent>
          </Card>

          {/* Offline Expert */}
          <Card className="border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-card flex flex-col h-full overflow-hidden group">
            <CardHeader className="pt-12 pb-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-accent/10 text-accent-foreground flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <MapPin className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-headline mb-3">
                {isEn ? 'Offline Guidance' : 'ऑफलाइन मार्गदर्शन'}
              </CardTitle>
              <CardDescription className="text-base px-4">
                {isEn ? 'Visit farms physically and provide on-field crop and soil consultation.' : 'शेतांना प्रत्यक्ष भेट द्या आणि ऑन-फील्ड पीक आणि माती सल्ला प्रदान करा.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12 px-8 mt-auto">
              <Button 
                onClick={() => setRole('expert-offline')}
                variant="default"
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
              >
                {isEn ? 'Continue as Offline Expert' : 'ऑफलाइन तज्ज्ञ म्हणून सुरू ठेवा'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
