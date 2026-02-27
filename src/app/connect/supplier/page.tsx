'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  Loader2, 
  Store,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const companies = [
  { id: 'dhanuka', name: 'Dhanuka Agri Tech', type: 'Agro Chemicals & Pesticides', location: 'Maharashtra, India' },
  { id: 'gsp', name: 'GSP Crop Science', type: 'Crop Protection & Nutrition', location: 'Gujarat, India' },
  { id: 'mankind', name: 'Mankind', type: 'Agricultural Inputs', location: 'Delhi, India' },
  { id: 'sumitomo', name: 'Sumitomo Chemicals', type: 'Pesticides & Bio-solutions', location: 'Maharashtra, India' },
  { id: 'crystal', name: 'Crystal Crop', type: 'Seed & Crop Protection', location: 'Haryana, India' },
  { id: 'royal-kisan', name: 'Royal Kisan', type: 'Modern Farm Equipment', location: 'Punjab, India' },
  { id: 'sanyog', name: 'Sanyog Enterprises Chemical', type: 'Industrial Agro Chemicals', location: 'Maharashtra, India' },
  { id: 'mahalaxmi', name: 'Mahalaxmi Agro Equipments', type: 'Tractors & Tools', location: 'Maharashtra, India' },
  { id: 'parekh', name: 'Parekh Traders', type: 'Irrigation & Tools', location: 'Maharashtra, India' },
  { id: 'nirmal', name: 'Nirmal Seeds', type: 'High Yield Hybrid Seeds', location: 'Maharashtra, India' },
  { id: 'aim', name: 'Aim Pesticides', type: 'Crop Protection', location: 'Gujarat, India' },
  { id: 'alpha', name: 'Alpha Bio Product Industries', type: 'Bio Fertilizers', location: 'Maharashtra, India' },
  { id: 'shri', name: 'Shri Enterprises', type: 'General Agri Suppliers', location: 'Karnataka, India' },
  { id: 'india-pesticides', name: 'India Pesticides', type: 'Technical Grade Pesticides', location: 'Uttar Pradesh, India' },
  { id: 'ju', name: 'JU Agriculture', type: 'Fertilizers & Nutrients', location: 'Delhi, India' },
  { id: 'national', name: 'National Pesticides', type: 'Insecticides & Herbicides', location: 'Maharashtra, India' },
  { id: 'kisan-craft', name: 'Kisan Craft', type: 'Small Farm Machinery', location: 'Karnataka, India' },
  { id: 'benson', name: 'Benson Agro Engineering', type: 'Harvesting Machinery', location: 'Punjab, India' },
  { id: 'srishti', name: 'Srishti Agro', type: 'Organic Inputs', location: 'Maharashtra, India' },
  { id: 'excel', name: 'Excel Industries', type: 'Crop Nutrition', location: 'Maharashtra, India' },
];

export default function SuppliersListPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/connect/supplier');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 animate-in fade-in duration-1000">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 p-5 rounded-3xl w-fit mb-6 shadow-soft">
          <Store className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 tracking-tight">Agri Companies & Suppliers</h1>
        <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
          Browse trusted agricultural companies and choose products based on your farming needs.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        <Input 
          placeholder="Search by company name or specialty..." 
          className="h-16 pl-12 rounded-3xl border-none shadow-soft-xl bg-white text-lg focus:ring-4 ring-primary/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!filteredCompanies || filteredCompanies.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <Building2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-muted-foreground">No companies matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="group border-none shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-10 px-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center border-2 border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="secondary" className="rounded-lg font-bold text-[9px] uppercase tracking-wider">
                    Verified Partner
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors min-h-[4rem]">
                  {company.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {company.location}
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 flex-1">
                <div className="pt-4 border-t border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Primary Focus</p>
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                    {company.type}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-0 border-t border-dashed">
                <Button asChild className="w-full h-16 rounded-none bg-white text-primary hover:bg-primary hover:text-white transition-all font-bold text-lg border-none shadow-none group">
                  <Link href={`/connect/supplier/${company.id}`}>
                    View Products <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
