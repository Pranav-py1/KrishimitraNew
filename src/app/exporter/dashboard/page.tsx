
'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Map, 
  CreditCard, 
  Users, 
  BarChart3, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Package, 
  Globe, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'orders' | 'requirements' | 'regions' | 'payments' | 'network' | 'analytics';

const stats = [
  { title: 'Total Orders', value: '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Buying Requests', value: '12', icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-100' },
  { title: 'Regions Covered', value: '8', icon: Globe, color: 'text-orange-600', bg: 'bg-orange-100' },
  { title: 'Payments Processed', value: '₹12.4L', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const buyingRequirements = [
  { id: 1, product: 'Wheat', category: 'Grains', price: '₹25/kg', qty: '5 Tons', quality: 'Grade A', region: 'Maharashtra', status: 'Open', type: 'Processing Company' },
  { id: 2, product: 'Onion', category: 'Vegetables', price: '₹18/kg', qty: '10 Tons', quality: 'Export Quality', region: 'Nashik', status: 'Open', type: 'Export Firm' },
  { id: 3, product: 'Mangoes', category: 'Fruits', price: '₹800/box', qty: '500 Boxes', quality: 'Alphonso', region: 'Ratnagiri', status: 'Urgent', type: 'Retail Chain' },
  { id: 4, product: 'Turmeric', category: 'Spices', price: '₹120/kg', qty: '2 Tons', quality: 'High Curcumin', region: 'Sangli', status: 'Closed', type: 'Exporter' },
];

const orders = [
  { id: 'ORD-001', farmer: 'Sanjay Patil', product: 'Wheat', qty: '2 Tons', price: '₹50,000', status: 'Accepted', payment: 'Pending' },
  { id: 'ORD-002', farmer: 'Sunita Pawar', product: 'Onions', qty: '5 Tons', price: '₹90,000', status: 'Pending', payment: 'Unpaid' },
  { id: 'ORD-003', farmer: 'Rahul Deshmukh', product: 'Mangoes', qty: '100 Boxes', price: '₹80,000', status: 'Completed', payment: 'Completed' },
];

const buyerNetwork = [
  { name: 'Global Agri Exports', type: 'Export Firm', location: 'Mumbai', products: 'Grains, Spices', priceRange: 'High', contact: 'Contact' },
  { name: 'FreshMart Retail', type: 'Retail Chain', location: 'Pune', products: 'Fruits, Vegetables', priceRange: 'Premium', contact: 'Contact' },
  { name: 'Village Spice Processing', type: 'Processing Unit', location: 'Sangli', products: 'Turmeric, Chilli', priceRange: 'Competitive', contact: 'Contact' },
];

export default function ExporterDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const SidebarItem = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm",
        activeTab === id 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-[calc(100vh-6rem)] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-sm p-6 hidden lg:flex flex-col gap-2">
        <div className="mb-8 px-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50">Exporter Menu</h2>
        </div>
        <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} />
        <SidebarItem id="orders" label="Orders" icon={ShoppingBag} />
        <SidebarItem id="requirements" label="Buying Requirements" icon={ClipboardList} />
        <SidebarItem id="regions" label="Regions" icon={Map} />
        <SidebarItem id="payments" label="Payments" icon={CreditCard} />
        <SidebarItem id="network" label="Buyer Network" icon={Users} />
        <SidebarItem id="analytics" label="Analytics" icon={BarChart3} />
        
        <div className="mt-auto pt-6 border-t border-dashed">
          <div className="bg-primary/5 rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase text-primary mb-2">Support</p>
            <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary">Contact Manager</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold font-headline capitalize tracking-tight">{activeTab}</h1>
            <p className="text-muted-foreground">Manage your export operations and buyer requirements.</p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-full font-bold shadow-lg shadow-primary/20">
              <ClipboardList className="mr-2 h-4 w-4" /> Post New Requirement
            </Button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-soft rounded-3xl group hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground">{stat.title}</CardTitle>
                    <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                    <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +12% from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Buying Opportunities Highlight */}
            <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest mb-4">Urgent Opportunities</Badge>
                  <h2 className="text-3xl font-bold font-headline mb-4">High Demand Season</h2>
                  <p className="text-primary-foreground/80 font-medium leading-relaxed">
                    Exporters are currently looking for premium quality Alphonso Mangoes and Nasik Onions. 
                    Top prices offered for bulk quantities with quality certification.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-white/60 mb-1">Top Demand</p>
                    <p className="font-bold text-lg">Mangoes</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-white/60 mb-1">Max Price</p>
                    <p className="font-bold text-lg">₹800/box</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recent Orders Overview */}
              <Card className="border-none shadow-soft rounded-[2rem]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Farmer Orders</CardTitle>
                    <CardDescription>Latest incoming supply requests.</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-primary font-bold rounded-xl" onClick={() => setActiveTab('orders')}>View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border bg-card/50 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{order.farmer}</p>
                            <p className="text-xs text-muted-foreground">{order.product} • {order.qty}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-lg font-bold text-[10px] uppercase">{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Buying Requests Shortlist */}
              <Card className="border-none shadow-soft rounded-[2rem]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Active Requirements</CardTitle>
                    <CardDescription>Your current market requests.</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-primary font-bold rounded-xl" onClick={() => setActiveTab('requirements')}>Manage</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {buyingRequirements.slice(0, 3).map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl border bg-card/50">
                        <div>
                          <p className="font-bold text-sm">{req.product}</p>
                          <p className="text-xs text-muted-foreground">{req.region} • {req.price}</p>
                        </div>
                        <Badge className={cn("rounded-lg font-black text-[10px] uppercase", req.status === 'Urgent' ? "bg-red-500" : "bg-green-600")}>
                          {req.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Filters Bar */}
            <Card className="border-none shadow-soft rounded-3xl p-4 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 h-11 rounded-xl" placeholder="Search requirements..." />
              </div>
              <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-2"><Filter className="mr-2 h-4 w-4" /> Category</Button>
              <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-2"><Map className="mr-2 h-4 w-4" /> Region</Button>
              <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-2"><Users className="mr-2 h-4 w-4" /> Buyer Type</Button>
            </Card>

            {/* Buying Table */}
            <Card className="border-none shadow-soft rounded-[2rem] overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-none">
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground px-6 py-4">Product</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Price Offered</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Quantity</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Region</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Buyer Type</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-muted-foreground text-right px-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyingRequirements.map((req) => (
                    <TableRow key={req.id} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{req.product}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">{req.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary text-sm">{req.price}</TableCell>
                      <TableCell className="text-sm font-medium">{req.qty}</TableCell>
                      <TableCell className="text-sm">{req.region}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-lg text-[10px] font-bold">{req.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Badge className={cn(
                          "rounded-lg font-black text-[10px] uppercase px-2 py-0.5",
                          req.status === 'Open' ? "bg-green-100 text-green-700" : 
                          req.status === 'Urgent' ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"
                        )}>
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-soft rounded-[2rem] overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-none">
                    <TableHead className="px-6 py-4 font-black text-[10px] uppercase">Order ID</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Farmer</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Product</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Payment</TableHead>
                    <TableHead className="px-6 text-right font-black text-[10px] uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-6 py-5 font-medium text-sm">{order.id}</TableCell>
                      <TableCell className="font-bold text-sm">{order.farmer}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{order.product}</span>
                          <span className="text-[10px] text-muted-foreground">{order.qty} • {order.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "rounded-lg font-bold text-[10px] uppercase",
                          order.status === 'Accepted' ? "border-green-200 text-green-700 bg-green-50" : 
                          order.status === 'Pending' ? "border-orange-200 text-orange-700 bg-orange-50" : ""
                        )}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", order.payment === 'Completed' ? "bg-green-500" : "bg-orange-500")} />
                          <span className="text-xs font-bold">{order.payment}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <Button size="sm" variant="ghost" className="font-bold text-primary hover:bg-primary/5 rounded-xl">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
            {buyerNetwork.map((buyer, i) => (
              <Card key={i} className="border-none shadow-soft rounded-[2rem] p-6 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Globe className="h-7 w-7" />
                  </div>
                  <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase">{buyer.type}</Badge>
                </div>
                <h3 className="text-xl font-bold mb-1">{buyer.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Map className="h-3 w-3" /> {buyer.location}
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Top Products</p>
                    <p className="text-sm font-bold">{buyer.products}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Pricing Tier</p>
                    <Badge variant="outline" className="rounded-full border-primary/20 text-primary font-black text-[10px] uppercase">{buyer.priceRange}</Badge>
                  </div>
                </div>
                <Button className="w-full rounded-2xl font-bold h-11 shadow-lg shadow-primary/10">Connect Now</Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-none shadow-soft rounded-[2rem] p-8 bg-muted/20 border-2 border-dashed border-muted">
                <div className="text-center py-12">
                  <Map className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Regional Logistics Map</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">Visual map of covered districts and warehouse locations is currently loading.</p>
                </div>
              </Card>
              <div className="space-y-6">
                <Card className="border-none shadow-soft rounded-3xl p-6">
                  <CardTitle className="text-lg mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600" /> Active Districts</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {['Nashik', 'Sangli', 'Ratnagiri', 'Kolhapur', 'Pune', 'Ahmednagar'].map(d => (
                      <Badge key={d} className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-bold">{d}</Badge>
                    ))}
                  </div>
                </Card>
                <Card className="border-none shadow-soft rounded-3xl p-6">
                  <CardTitle className="text-lg mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-blue-600" /> Logistics Partners</CardTitle>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold p-3 bg-muted/30 rounded-xl">
                      <span>KrishiTransport Ltd.</span>
                      <Badge className="bg-blue-100 text-blue-700">Primary</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold p-3 bg-muted/30 rounded-xl">
                      <span>Village Logistics Co.</span>
                      <Badge variant="outline">Secondary</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'payments' || activeTab === 'analytics') && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
            <div className="bg-primary/5 p-10 rounded-full mb-6">
              <AlertCircle className="h-16 w-16 text-primary/40" />
            </div>
            <h3 className="text-2xl font-bold font-headline mb-2">Section Under Development</h3>
            <p className="text-muted-foreground max-w-sm">We are building advanced payment tracking and analytics tools for exporters. Coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
