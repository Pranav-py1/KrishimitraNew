'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, useCollection, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Egg, Bird, Plus, Trash2, CheckCircle, Clock, Milk } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { type LivestockListing } from '@/lib/data';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function FarmerLivestockPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (Controlled with default empty strings)
  const [formData, setFormData] = useState({
    category: 'dairy' as 'dairy' | 'poultry',
    title: '',
    description: '',
    price: '',
    quantity: '',
    imageURL: ''
  });

  const listingsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'livestockListings'), where('farmerId', '==', user.uid)) : null,
    [user?.uid, firestore]
  );
  const { data: listings, isLoading: isLoadingListings } = useCollection<LivestockListing>(listingsQuery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title || !formData.price || !formData.quantity) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const listingData: Omit<LivestockListing, 'id'> = {
        farmerId: user.uid,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        imageURL: formData.imageURL || `https://picsum.photos/seed/${Math.random()}/600/400`,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      await addDocumentNonBlocking(collection(firestore, 'livestockListings'), listingData);
      
      setFormData({
        category: 'dairy',
        title: '',
        description: '',
        price: '',
        quantity: '',
        imageURL: ''
      });
      
      toast({ title: 'Listing Created', description: 'Your livestock listing is now active.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create listing.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const ref = doc(firestore, 'livestockListings', id);
      setDocumentNonBlocking(ref, { status: 'sold' }, { merge: true });
      toast({ title: 'Status Updated', description: 'Listing marked as sold.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update listing.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const ref = doc(firestore, 'livestockListings', id);
      deleteDocumentNonBlocking(ref);
      toast({ title: 'Listing Deleted', description: 'The listing has been removed.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete listing.' });
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
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 tracking-tight">Livestock Selling</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Create and manage your livestock listings for the community.</p>
      </div>

      <Tabs defaultValue="sell" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="sell" className="rounded-lg font-bold">Sell Livestock</TabsTrigger>
          <TabsTrigger value="manage" className="rounded-lg font-bold">Manage Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="sell">
          <Card className="border-none shadow-soft rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-2xl">New Listing</CardTitle>
              <CardDescription>Fill in the details to post a new listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy (Cattle, Milk)</SelectItem>
                        <SelectItem value="poultry">Poultry (Birds, Eggs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. High Quality Gir Cow" 
                      value={formData.title ?? ""} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide details about the breed, age, health, etc." 
                    value={formData.description ?? ""} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="0" 
                      value={formData.price ?? ""} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="1" 
                      value={formData.quantity ?? ""} 
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageURL">Image URL (Optional)</Label>
                  <Input 
                    id="imageURL" 
                    placeholder="https://example.com/image.jpg" 
                    value={formData.imageURL ?? ""} 
                    onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                  Create Listing
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          {isLoadingListings ? (
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !listings || listings.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-4 border-dashed">
              <Egg className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-lg font-bold text-muted-foreground">No listings found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="border-none shadow-soft rounded-3xl overflow-hidden group">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                      <Image 
                        src={listing.imageURL} 
                        alt={listing.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute top-2 left-2">
                        {listing.category === 'dairy' ? (
                          <Badge className="bg-blue-500 hover:bg-blue-600"><Milk className="h-3 w-3 mr-1" /> Dairy</Badge>
                        ) : (
                          <Badge className="bg-orange-500 hover:bg-orange-600"><Bird className="h-3 w-3 mr-1" /> Poultry</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold font-headline">{listing.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {listing.status === 'active' ? (
                              <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-50"><Clock className="h-3 w-3 mr-1" /> Active</Badge>
                            ) : (
                              <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" /> Sold</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary">₹{listing.price}</p>
                          <p className="text-xs text-muted-foreground">Qty: {listing.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{listing.description}</p>
                      <div className="flex gap-2 mt-auto">
                        {listing.status === 'active' && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsSold(listing.id)} className="rounded-xl font-bold flex-1">
                            Mark as Sold
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(listing.id)} className="text-destructive hover:bg-destructive/10 rounded-xl font-bold px-4">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
