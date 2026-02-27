'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, collection, where, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Consultation = {
  id: string;
  farmerId: string;
  farmerName?: string;
  subject: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
};

type Article = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
};

export default function ExpertDashboard() {
  const { user, userData, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'articles'>('overview');

  const consultationsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'consultations'), where('expertId', '==', user.uid), orderBy('createdAt', 'desc')) : null,
    [user?.uid, firestore]
  );
  const { data: consultations, isLoading: isConsultationsLoading } = useCollection<Consultation>(consultationsQuery);

  const articlesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'expertArticles'), where('expertId', '==', user.uid), orderBy('createdAt', 'desc')) : null,
    [user?.uid, firestore]
  );
  const { data: articles, isLoading: isArticlesLoading } = useCollection<Article>(articlesQuery);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) return null;

  const stats = [
    { title: 'Total Consultations', value: consultations?.length || 0, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Requests', value: consultations?.filter(c => c.status === 'pending').length || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Approved', value: consultations?.filter(c => c.status === 'approved').length || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Articles Posted', value: articles?.length || 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2 tracking-tight">Welcome, Expert {userData.name}</h1>
          <p className="text-muted-foreground text-lg">Manage your consultations and share agricultural insights.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20">
            <Link href="/expert/articles/new"><Plus className="mr-2 h-4 w-4" /> New Article</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Consultation Requests */}
          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Consultations</CardTitle>
                <CardDescription>Review and respond to farmer requests.</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary font-bold rounded-xl">
                <Link href="/expert/consultations">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isConsultationsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !consultations || consultations.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-[2rem] border-4 border-dashed">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-bold text-muted-foreground">No requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultations.slice(0, 5).map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-5 rounded-3xl border bg-card hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">{consultation.subject}</p>
                          <p className="text-xs text-muted-foreground">From: {consultation.farmerName || 'Farmer'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={cn(
                          "rounded-lg font-bold text-[10px] uppercase",
                          consultation.status === 'approved' ? "bg-green-50 text-green-700 border-green-200" :
                          consultation.status === 'pending' ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-muted"
                        )}>
                          {consultation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2rem] bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary"><LayoutDashboard className="h-5 w-5" /></div>
                <CardTitle className="text-xl">Expert Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Expertise</p>
                <Badge variant="secondary" className="rounded-lg">{userData.expertiseCategory}</Badge>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">About You</p>
                <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">{userData.bio}</p>
              </div>
              <Button variant="outline" className="w-full rounded-xl font-bold">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Your Articles</CardTitle>
              <FileText className="h-5 w-5 text-primary/40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {isArticlesLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !articles || articles.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">You haven't posted any articles yet.</p>
              ) : (
                <div className="space-y-3">
                  {articles.slice(0, 3).map(article => (
                    <div key={article.id} className="p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <p className="text-sm font-bold truncate">{article.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black">{article.category}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button asChild variant="link" className="w-full text-primary font-bold">
                <Link href="/expert/articles">Manage Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}