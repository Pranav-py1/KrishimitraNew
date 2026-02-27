'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Authentication service not available.",
        description: "Please try again later.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Reset Email Sent",
        description: "If an account exists for this email, you will receive a password reset link shortly.",
      });
      form.reset();
    } catch (error: any) {
      let message = "Could not send reset email. Please try again.";
      if (error.code === 'auth/user-not-found') {
        // We still show success-like behavior for security to prevent email enumeration, 
        // but for an MVP we can be specific or stay generic.
        message = "Please check the email address and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-none rounded-[2rem] overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4">
            <KeyRound className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline tracking-tight">Forgot Password?</CardTitle>
          <CardDescription className="text-base">
            No worries! Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
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
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          value={field.value ?? ""}
                          className="pl-11 h-12 rounded-xl bg-muted/30" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="px-8 pb-10 flex flex-col items-center">
          <Button variant="link" className="text-primary font-bold" asChild>
            <Link href="/login" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
