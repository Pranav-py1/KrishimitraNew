
'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Phone, MessageSquare, Search, Wheat, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const ALL_DISTRICTS = [
  "Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana",
  "Yavatmal", "Washim", "Aurangabad", "Beed", "Jalna", "Osmanabad", "Nanded", "Latur",
  "Parbhani", "Hingoli", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Nagpur",
  "Wardha", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar", "Nashik", "Mumbai City",
  "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg"
];

const FARMERS = [
  { id: 'a1', name: "Atul Mahalle", district: "Akola" },
  { id: 'a2', name: "Ravi Khadse", district: "Akola" },
  { id: 'am1', name: "Vijay Lajurkar", district: "Amravati" },
  { id: 'am2', name: "Randhe", district: "Amravati" },
  { id: 'am3', name: "Cheetan Zod", district: "Amravati" },
  { id: 'am4', name: "Hemant Lajurkar", district: "Amravati" },
  { id: 'r1', name: "Ranjit Udeg", district: "Ratnagiri", phone: "8459908922" },
  { id: 'r2', name: "Guruthnath Udeg", district: "Ratnagiri", phone: "9921210840" },
  { id: 'r3', name: "Vishawas Ghadsghi", district: "Ratnagiri", phone: "9850996148" },
  { id: 'r4', name: "Rohidas Gurav", district: "Ratnagiri", phone: "9960652110" },
  { id: 'r5', name: "Girish Shirke", district: "Ratnagiri", phone: "9011965455" },
  { id: 'r6', name: "Suyog Vichare", district: "Ratnagiri", phone: "9552465435" },
  { id: 'r7', name: "Ashwin Aitrekar", district: "Ratnagiri", phone: "9767701653" },
  { id: 'r8', name: "Tushar Kale", district: "Ratnagiri", phone: "9405071410" },
  { id: 'r9', name: "Santosh Khanre", district: "Ratnagiri", phone: "9112639501" },
];

export default function FarmersConnectPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = ALL_DISTRICTS.filter(district => 
    district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    FARMERS.some(f => f.district === district && f.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000 bg-background/50">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Wheat className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Connect with Fellow Farmers</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Network with agricultural producers across Maharashtra. Share knowledge, collaborate, and grow together.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by district or farmer name..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-16 max-w-5xl mx-auto">
        {filteredDistricts.map((district) => {
          const districtFarmers = FARMERS.filter(f => f.district === district);
          
          return (
            <section key={district} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-headline">{district}</h2>
              </div>
              <Separator className="mb-8 bg-primary/20" />
              
              {districtFarmers.length === 0 ? (
                <div className="py-10 px-8 rounded-[2rem] bg-muted/20 border-2 border-dashed border-muted flex flex-col items-center justify-center text-center">
                  <User className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground font-medium">No farmers available in this district yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {districtFarmers.map((farmer) => (
                    <Card key={farmer.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="pb-2 pt-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <User className="h-7 w-7" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                              {farmer.name}
                            </CardTitle>
                            {farmer.phone && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 font-medium">
                                <Phone className="h-3 w-3 text-primary" />
                                {farmer.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-6 pt-4 grid grid-cols-2 gap-3 border-t border-dashed mt-2">
                        <Button variant="outline" className="rounded-xl font-bold h-10 border-2 border-primary/10 hover:border-primary/30 transition-all" asChild>
                          <Link href={`/farmer/profile/${farmer.id}`}>View Profile</Link>
                        </Button>
                        <Button className="rounded-xl font-bold h-10 shadow-lg shadow-primary/10 transition-all hover:scale-105" asChild>
                          <Link href="/messages">
                            <MessageSquare className="mr-2 h-4 w-4" /> Chat Now
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-4 border-dashed border-muted">
          <Search className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
          <p className="text-2xl text-muted-foreground font-bold">No matching districts or farmers found.</p>
        </div>
      )}
    </div>
  );
}
