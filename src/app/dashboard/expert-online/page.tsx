'use client';

import { useState } from 'react';
import { 
  Monitor, 
  Youtube, 
  Instagram, 
  Facebook, 
  ExternalLink, 
  Video, 
  MessageSquare,
  Award,
  MapPin,
  Loader2,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const ONLINE_EXPERTS = [
  {
    id: '1',
    name: 'Santosh Kolekar',
    district: 'Ratnagiri',
    specialization: 'Organic Farming & Crop Management',
    experience: '10 Years',
    bio: 'Specialist in Konkan fruit crops and sustainable organic practices. Helping farmers maximize yield with minimal chemicals.',
    youtube: 'https://youtube.com/sample1',
    social: 'https://instagram.com/sample1',
  },
  {
    id: '2',
    name: 'Vijay Ladole',
    district: 'Amravati',
    specialization: 'Pest Management',
    experience: '8 Years',
    bio: 'Expert in integrated pest management (IPM) for cotton and soybean. Providing real-time solutions for crop infestations.',
    youtube: 'https://youtube.com/sample2',
    social: 'https://facebook.com/sample2',
  },
  {
    id: '3',
    name: 'Subash Tale',
    district: 'Akola',
    specialization: 'Seed Treatment',
    experience: '12 Years',
    bio: 'Academic expert focusing on seed quality and treatment protocols to ensure high germination rates and healthy starts.',
    youtube: 'https://youtube.com/sample3',
    social: 'https://sample3.com',
  }
];

export default function OnlineExpertDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExperts = ONLINE_EXPERTS.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Monitor className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Online Agricultural Experts</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Connect with experts through video platforms and digital resources. Access world-class guidance from anywhere.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by name or specialization..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredExperts.map((expert) => (
          <Card key={expert.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-card overflow-hidden flex flex-col">
            <CardHeader className="pt-10 px-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <Youtube className="h-8 w-8" />
                </div>
                <Badge variant="secondary" className="rounded-lg font-black uppercase text-[9px] tracking-widest px-3">
                  Online Advisor
                </Badge>
              </div>
              <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">{expert.name}</CardTitle>
              <p className="text-primary font-bold text-sm mt-1">{expert.specialization}</p>
            </CardHeader>
            <CardContent className="px-8 pb-8 flex-1">
              <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Award className="h-4 w-4 text-primary" /> {expert.experience}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {expert.district}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{expert.bio}"
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 border-red-100 text-red-600 hover:bg-red-50" asChild>
                    <Link href={expert.youtube} target="_blank"><Youtube className="mr-2 h-4 w-4" /> Channel</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl h-9 px-4" asChild>
                    <Link href={expert.social} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> Links</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-3">
              <Button variant="secondary" className="rounded-xl font-bold h-12">
                <Video className="mr-2 h-4 w-4" /> Watch Videos
              </Button>
              <Button className="rounded-xl font-bold h-12 shadow-lg shadow-primary/10">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
