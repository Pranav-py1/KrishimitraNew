'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { query, collection, where, doc } from 'firebase/firestore';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar,
  Loader2,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type Article = {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function ExpertArticlesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Removed orderBy to avoid index issues during demo
  const articlesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'expertArticles'), where('expertId', '==', user.uid)) : null,
    [user?.uid, firestore]
  );
  const { data: articlesData, isLoading } = useCollection<Article>(articlesQuery);

  // Manual sort by date
  const articles = articlesData?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = (id: string) => {
    const ref = doc(firestore, 'expertArticles', id);
    deleteDocumentNonBlocking(ref);
    toast({ title: 'Article Deleted', description: 'Your post has been removed.' });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const filteredArticles = articles?.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Button asChild variant="ghost" className="mb-4 rounded-xl font-bold">
            <Link href="/dashboard/expert"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Your Guidance Articles</h1>
          <p className="text-muted-foreground">Share your knowledge with the farming community.</p>
        </div>
        <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20 h-12 px-6">
          <Link href="/expert/articles/new"><Plus className="mr-2 h-5 w-5" /> Write New Article</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your articles..." 
            className="pl-10 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl h-12 px-6 border-2 font-bold"><Filter className="mr-2 h-4 w-4" /> Category</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : !filteredArticles || filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <BookOpen className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-lg font-bold text-muted-foreground">No articles found.</p>
          <Button asChild variant="link" className="text-primary font-bold mt-2">
            <Link href="/expert/articles/new">Start writing your first post!</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="border-none shadow-soft rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-md transition-all group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                  <BookOpen className="h-12 w-12" />
                </div>
                <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary font-black uppercase tracking-widest text-[9px] border-none shadow-sm px-3 py-1 rounded-full">
                  {article.category}
                </Badge>
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors line-clamp-2">{article.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 font-bold">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(article.createdAt), 'PPP')}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter className="border-t border-dashed flex justify-between pt-4 pb-6">
                <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold">
                  <Link href={`/expert/articles/edit/${article.id}`}><Edit3 className="mr-2 h-4 w-4" /> Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-xl font-bold" onClick={() => handleDelete(article.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
