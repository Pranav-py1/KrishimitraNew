
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  IndianRupee, 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  MessageCircle,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Static Sample Data
const summaryStats = [
  { title: 'Total Products', value: '42', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Active Orders', value: '18', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-100' },
  { title: 'Nearby Farmers', value: '156', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  { title: 'Total Revenue', value: '₹4.2L', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const nearbyCompanies = [
  { name: 'Kisan Seva Kendra', type: 'Local Shop', location: 'Nashik, MH', categories: 'Seeds, Tools', icon: Building2 },
  { name: 'GreenAgri Solutions', type: 'Agri Company', location: 'Pune, MH', categories: 'Fertilizers', icon: Building2 },
  { name: 'Bharat Distributors', type: 'Distributor', location: 'Sangli, MH', categories: 'All Inputs', icon: Building2 },
];

const supplierProducts = [
  { id: 1, name: 'Hybrid Cotton Seeds', category: 'Seeds', price: '₹1200/bag', stock: '50 Bags', location: 'Pune', status: 'Active' },
  { id: 2, name: 'NPK 19:19:19', category: 'Fertilizers', price: '₹850/bag', stock: '120 Bags', location: 'Nashik', status: 'Active' },
  { id: 3, name: 'Neem-based Pesticide', category: 'Pesticides', price: '₹450/L', stock: '30 Litres', location: 'Nagpur', status: 'Inactive' },
  { id: 4, name: 'Heavy Duty Plough', category: 'Tools & Equipment', price: '₹15,000', stock: '5 Units', location: 'Solapur', status: 'Active' },
  { id: 5, name: 'Organic Compost', category: 'Organic Products', price: '₹300/kg', stock: '500 kg', location: 'Satara', status: 'Active' },
];

const farmerRequests = [
  { farmer: 'Suresh Patil', product: 'Wheat Seeds', qty: '10 Bags', location: 'Nashik', price: '₹1000/bag' },
  { farmer: 'Anil Deshmukh', product: 'Drip Irrigation Kit', qty: '2 Sets', location: 'Pune', price: '₹25,000' },
  { farmer: 'Sunita Pawar', product: 'Organic Fertilizer', qty: '200 kg', location: 'Sangli', price: '₹250/kg' },
];

const topSelling = [
  { category: 'Seeds', orders: 124, growth: '+15%' },
  { category: 'Fertilizers', orders: 89, growth: '+8%' },
  { category: 'Tools', orders: 45, growth: '+12%' },
];

export default function SupplierDashboard() {
  const { isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-2 text-foreground flex items-center gap-3">
            <LayoutDashboard className="h-10 w-10 text-primary" /> Supplier Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage your agri-inventory and monitor local farmer demand.</p>
        </div>
        <Button className="rounded-full font-bold shadow-lg shadow-primary/20 h-12 px-6">
          <Plus className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {summaryStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-soft rounded-3xl group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <p className="text-[10px] text-green-600 font-bold mt-1">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        {/* Nearby Companies */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-headline">Nearby Companies & Shops</h2>
              <Button variant="ghost" className="text-primary font-bold">View Map</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {nearbyCompanies.map((company, i) => (
                <Card key={i} className="border-none shadow-soft rounded-3xl hover:shadow-md transition-all p-5">
                  <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <company.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base mb-1">{company.name}</h3>
                  <p className="text-[10px] uppercase font-black text-muted-foreground/60 mb-3">{company.type}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <MapPin className="h-3 w-3" /> {company.location}
                  </div>
                  <Badge variant="secondary" className="text-[9px] font-bold mb-4">{company.categories}</Badge>
                  <Button variant="outline" className="w-full rounded-xl text-xs font-bold h-9">Contact</Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Product Listings Table */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold font-headline">Your Product Listings</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-9 h-10 w-[200px] rounded-xl" />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex flex-wrap h-auto bg-muted/50 rounded-2xl p-1 gap-1 mb-6">
                {['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Organic'].map(tab => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()} className="rounded-xl font-bold px-4 py-2">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <Card className="border-none shadow-soft rounded-[2rem] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-none">
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground px-6 py-4">Product Name</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Category</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Price</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Stock</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Status</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-muted-foreground text-right px-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierProducts.map((prod) => (
                        <TableRow key={prod.id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="px-6 py-4 font-bold text-sm">{prod.name}</TableCell>
                          <TableCell className="text-xs font-medium">{prod.category}</TableCell>
                          <TableCell className="text-xs font-bold text-primary">{prod.price}</TableCell>
                          <TableCell className="text-xs">{prod.stock}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "rounded-lg font-black text-[9px] uppercase px-2",
                              prod.status === 'Active' ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                            )}>
                              {prod.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary"><MessageCircle className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Top Selling */}
          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Top Selling
              </CardTitle>
              <CardDescription>Highest demand categories this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSelling.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                  <div>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.category}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">{item.orders} Orders</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-none font-bold text-[10px]">{item.growth}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Farmer Demand */}
          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl">Farmer Demand Requests</CardTitle>
              <CardDescription>Products being requested by local farmers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {farmerRequests.map((req, i) => (
                <div key={i} className="p-4 rounded-2xl border bg-card/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm">{req.product}</p>
                    <Badge variant="outline" className="text-[9px] font-bold">{req.qty}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {req.farmer}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {req.location}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-dashed">
                    <span className="text-xs font-bold text-primary">{req.price}</span>
                    <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-primary">Contact Farmer</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
