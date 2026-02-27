'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { type Sale } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart as BarChartIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid hydration mismatch
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

const COLORS = ['#166534', '#f59e0b', '#3b82f6', '#f97316', '#a855f7', '#64748b'];

export default function RetailerStatsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    const loading = isUserLoading || isUserDataLoading;
    if (mounted && !loading && (!user || userData?.role !== 'retailer')) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be a retailer to access this page.' });
      router.push('/');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router, toast, mounted]);

  const salesQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'sales'), where('sellerId', '==', user.uid))
        : null,
    [firestore, user]
  );

  const { data: sales, isLoading: isLoadingSales, error } = useCollection<Sale>(salesQuery);

  const chartData = useMemo(() => {
    if (!sales) return [];
    const salesByDay = sales.reduce((acc, sale) => {
      const day = format(new Date(sale.saleDate), 'MMM dd');
      if (!acc[day]) {
        acc[day] = { name: day, Sales: 0, date: new Date(sale.saleDate) };
      }
      acc[day].Sales += sale.totalPrice;
      return acc;
    }, {} as Record<string, { name: string; Sales: number, date: Date }>);
    
    return Object.values(salesByDay).sort((a,b) => a.date.getTime() - b.date.getTime());
  }, [sales]);

  const categoryData = useMemo(() => {
    if (!sales) return [];
    const byItem = sales.reduce((acc, sale) => {
      if (!acc[sale.itemName]) {
        acc[sale.itemName] = 0;
      }
      acc[sale.itemName] += sale.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byItem)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [sales]);

  const totalRevenue = useMemo(() => sales?.reduce((sum, sale) => sum + sale.totalPrice, 0) || 0, [sales]);
  const totalSales = sales?.length || 0;

  if (!mounted || isUserLoading || isUserDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (userData?.role !== 'retailer') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BarChartIcon className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Sales Statistics</h1>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl">
          An overview of your business performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent>
            {isLoadingSales ? <Loader2 className="h-6 w-6 animate-spin" /> :
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
             <span className="text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
             {isLoadingSales ? <Loader2 className="h-6 w-6 animate-spin" /> :
              <div className="text-2xl font-bold">{totalSales}</div>
             }
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Daily revenue trends from recent activity.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSales ? (
              <div className="flex items-center justify-center h-[350px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : error ? (
               <p className="text-center text-destructive">Could not load sales data.</p>
            ) : chartData.length === 0 ? (
               <p className="text-center text-muted-foreground h-[350px] flex items-center justify-center">No sales data available.</p>
            ): (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="Sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
            <CardDescription>Visual breakdown of your top-selling items.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSales ? (
              <div className="flex items-center justify-center h-[350px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : categoryData.length === 0 ? (
              <p className="text-center text-muted-foreground h-[350px] flex items-center justify-center">No product data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
