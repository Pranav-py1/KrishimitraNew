
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  BookOpen, 
  Tag, 
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const categories = [
  'Crop Advice',
  'Soil Health',
  'Irrigation',
  'Pest Control',
  'Organic Farming',
  'General Guidance'
];

export default function NewArticlePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    imageURL: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.category || !formData.content) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        expertId: user.uid,
        title: formData.title,
        category: formData.category,
        content: formData.content,
        imageURL: formData.imageURL || `https://picsum.photos/seed/${Math.random()}/800/400`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDocumentNonBlocking(collection(firestore, 'expertArticles'), articleData);
      toast({ title: 'Article Published', description: 'Your knowledge has been shared with the community.' });
      router.push('/expert/articles');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not publish article.' });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" className="mb-6 rounded-xl font-bold">
          <Link href="/expert/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles</Link>
        </Button>

        <Card className="border-none shadow-soft rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8 pt-8 text-center border-b border-dashed">
            <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Write New Article</CardTitle>
            <CardDescription>Share your agricultural insights and advice.</CardDescription>
          </CardHeader>
          <CardContent className="pt-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Article Title</Label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                  <Input 
                    id="title" 
                    placeholder="e.g. Best practices for Kharif sowing" 
                    className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all text-lg font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="h-14 rounded-2xl border-2 font-bold">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary/40" />
                      <SelectValue placeholder="Select Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-xl font-medium">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="imageURL" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image URL (Optional)</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                  <Input 
                    id="imageURL" 
                    placeholder="https://example.com/image.jpg" 
                    className="h-14 pl-12 rounded-2xl border-2"
                    value={formData.imageURL}
                    onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Article Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Share your detailed guidance here..." 
                  className="min-h-[300px] rounded-2xl border-2 p-6 text-lg leading-relaxed resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Plus className="mr-2 h-6 w-6" />}
                Publish Article
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
