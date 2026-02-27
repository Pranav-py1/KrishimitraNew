
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, useCollection, addDocumentNonBlocking, useUser } from '@/firebase';
import { doc, query, collection, where, orderBy } from 'firebase/firestore';
import { 
  User, 
  MapPin, 
  Award, 
  Calendar, 
  MessageSquare, 
  ArrowLeft, 
  Loader2, 
  BookOpen, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { User as UserType, ExpertArticle, Consultation } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ExpertProfilePage() {
  const { id } = useParams();
  const expertId = Array.isArray(id) ? id[0] : id;
  const firestore = useFirestore();
  const { user, userData } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    subject: '',
    message: '',
    preferredDate: ''
  });

  const expertRef = useMemoFirebase(() => expertId ? doc(firestore, 'users', expertId) : null, [firestore, expertId]);
  const { data: expert, isLoading: isExpertLoading } = useDoc<UserType>(expertRef);

  const articlesQuery = useMemoFirebase(() => 
    expertId ? query(collection(firestore, 'expertArticles'), where('expertId', '==', expertId), orderBy('createdAt', 'desc')) : null,
    [firestore, expertId]
  );
  const { data: articles, isLoading: isArticlesLoading } = useCollection<ExpertArticle>(articlesQuery);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please select a role to book a consultation.' });
      return;
    }

    if (!bookingForm.subject || !bookingForm.message || !bookingForm.preferredDate) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all details.' });
      return;
    }

    setIsBooking(true);
    try {
      const consultationData: Omit<Consultation, 'id'> = {
        farmerId: user.uid,
        expertId: expertId as string,
        farmerName: userData?.name || 'Farmer',
        subject: bookingForm.subject,
        message: bookingForm.message,
        preferredDate: new Date(bookingForm.preferredDate).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDocumentNonBlocking(collection(firestore, 'consultations'), consultationData);
      toast({ title: 'Request Sent', description: `Your request for ${expert?.name} has been submitted.` });
      setBookingForm({ subject: '', message: '', preferredDate: '' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send request.' });
    } finally {
      setIsBooking(false);
    }
  };

  if (isExpertLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!expert) return <div className="text-center py-20">Expert not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-in fade-in duration-700">
      <Button asChild variant="ghost" className="mb-8 rounded-xl font-bold">
        <Link href="/farmer/experts"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Experts</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden bg-primary text-white">
            <CardHeader className="text-center pb-10 pt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className="mx-auto w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 mb-6 relative z-10 shadow-xl">
                <User className="h-14 w-14" />
              </div>
              <CardTitle className="text-3xl font-headline relative z-10">{expert.name}</CardTitle>
              <Badge className="bg-white/90 text-primary border-none font-black uppercase text-[10px] tracking-widest mt-2 px-4 py-1.5 rounded-full relative z-10">
                {expert.expertiseCategory || 'General Expert'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pb-12 pt-4 px-8 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <p className="text-sm font-medium leading-relaxed italic opacity-90">
                  "{expert.bio || 'Expert advisor dedicated to sustainable farming practices and crop yield optimization.'}"
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                  <Award className="h-5 w-5 mx-auto mb-2 opacity-60" />
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">Experience</p>
                  <p className="text-lg font-bold">{expert.experienceYears || '10+'} Yrs</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                  <MapPin className="h-5 w-5 mx-auto mb-2 opacity-60" />
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">District</p>
                  <p className="text-lg font-bold truncate">{expert.location?.district || 'Regional'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Consultation
              </CardTitle>
              <CardDescription>Request a 1-on-1 session with {expert.name.split(' ')[0]}.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookConsultation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="e.g. Tomato crop wilting" 
                    className="rounded-xl h-12"
                    value={bookingForm.subject}
                    onChange={(e) => setBookingForm({ ...bookingForm, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="rounded-xl h-12"
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="msg" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</Label>
                  <Textarea 
                    id="msg" 
                    placeholder="Describe your issue in detail..." 
                    className="rounded-xl min-h-[100px]"
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={isBooking} className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  {isBooking ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MessageSquare className="mr-2 h-5 w-5" />}
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Content Main */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-2xl"><BookOpen className="h-6 w-6 text-primary" /></div>
            <h2 className="text-3xl font-bold font-headline tracking-tight">Guidance Articles</h2>
          </div>

          {isArticlesLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed">
              <p className="text-muted-foreground font-bold">This expert hasn't published any articles yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="border-none shadow-soft rounded-[2rem] overflow-hidden hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 aspect-video md:aspect-auto overflow-hidden">
                      <img src={article.imageURL} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary font-black uppercase tracking-widest text-[8px] border-none shadow-sm px-2">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">
                        <Clock className="h-3 w-3" /> {format(new Date(article.createdAt), 'PP')}
                      </div>
                      <h3 className="text-xl font-bold font-headline mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {article.content.substring(0, 200)}...
                      </p>
                      <Button variant="outline" className="rounded-xl font-bold border-2 h-10 group-hover:bg-primary group-hover:text-white transition-all">
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
