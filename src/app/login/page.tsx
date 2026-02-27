
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { user, userData, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Redirection logic ONLY after loading is fully completed and userData is available
  useEffect(() => {
    if (!mounted || isUserLoading || isSubmitting) return;

    if (user && userData?.role) {
      const normalizedRole = userData.role.trim().toLowerCase().replace('_', '-');
      router.push(`/dashboard/${normalizedRole}`);
    }
  }, [user, userData, router, isUserLoading, mounted, isSubmitting]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!auth) {
      toast({ variant: "destructive", title: "Auth service unavailable." });
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Login Successful!", description: "Welcome back." });
    } catch (error: any) {
      let message = "Please check your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Invalid email or password.";
      }
      toast({ variant: "destructive", title: "Login Failed", description: message });
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-none rounded-[2rem] overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Login to your KrishiMitra account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {isUserLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Syncing session...</p>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="name@example.com" {...field} className="pl-11 h-12 rounded-xl bg-muted/30" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link href="/forgot-password" size="sm" className="text-primary font-bold text-xs hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-11 h-12 rounded-xl bg-muted/30" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Login'}
                  </Button>
                </form>
              </Form>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-bold text-primary hover:underline">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
