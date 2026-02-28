'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { query, collection, where, doc } from 'firebase/firestore';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  User,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Consultation = {
  id: string;
  farmerId: string;
  farmerName?: string;
  farmerPhone?: string;
  subject: string;
  message: string;
  preferredDate: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
};

export default function ExpertConsultationsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Removed orderBy to avoid index issues during demo
  const consultationsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'consultations'), where('expertId', '==', user.uid)) : null,
    [user?.uid, firestore]
  );
  const { data: consultationsData, isLoading } = useCollection<Consultation>(consultationsQuery);

  // Manual sort by date
  const consultations = consultationsData?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleUpdateStatus = (id: string, newStatus: Consultation['status']) => {
    const ref = doc(firestore, 'consultations', id);
    updateDocumentNonBlocking(ref, { status: newStatus });
    toast({ title: 'Status Updated', description: `Consultation marked as ${newStatus}.` });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 rounded-xl font-bold">
          <Link href="/dashboard/expert"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Consultation Requests</h1>
        <p className="text-muted-foreground">Review and manage advice requests from local farmers.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : !consultations || consultations.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
          <MessageSquare className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-lg font-bold text-muted-foreground">No consultation requests found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {consultations.map((item) => (
            <Card key={item.id} className="border-none shadow-soft rounded-3xl overflow-hidden group">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{item.subject}</CardTitle>
                      <CardDescription>Farmer: {item.farmerName || 'Anonymous Farmer'}</CardDescription>
                    </div>
                  </div>
                  <Badge className={cn(
                    "rounded-lg font-black text-[10px] uppercase py-1 px-3",
                    item.status === 'approved' ? "bg-green-100 text-green-700" :
                    item.status === 'pending' ? "bg-orange-100 text-orange-700" :
                    item.status === 'completed' ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"
                  )}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm font-medium leading-relaxed mb-6 italic text-foreground/80">"{item.message}"</p>
                <div className="flex flex-wrap gap-6 border-t border-dashed pt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Preferred: {format(new Date(item.preferredDate), 'PPP')}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Requested: {format(new Date(item.createdAt), 'PPp')}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex flex-wrap justify-end gap-3 pt-4 pb-4">
                {item.status === 'pending' && (
                  <>
                    <Button variant="outline" className="rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(item.id, 'rejected')}>
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button className="rounded-xl font-bold" onClick={() => handleUpdateStatus(item.id, 'approved')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Request
                    </Button>
                  </>
                )}
                {item.status === 'approved' && (
                  <Button className="rounded-xl font-bold" onClick={() => handleUpdateStatus(item.id, 'completed')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                  </Button>
                )}
                {item.status === 'completed' && (
                  <p className="text-xs font-bold text-green-600 flex items-center"><CheckCircle2 className="mr-2 h-4 w-4" /> Consultation successfully concluded</p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
