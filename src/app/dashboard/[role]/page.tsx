'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RoleDashboards } from './dashboard-views';

export default function DynamicDashboardPage() {
  const { role } = useParams();
  const { user, userData, isUserLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isUserLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (userData?.role) {
      const normalizedUserRole = userData.role.trim().toLowerCase().replace('_', '-');
      const normalizedUrlRole = typeof role === 'string' ? role.trim().toLowerCase() : '';

      const isBusinessGroup = ['exporter', 'supplier'].includes(normalizedUserRole);
      const isBusinessUrl = ['exporter', 'supplier'].includes(normalizedUrlRole);

      if (normalizedUserRole !== normalizedUrlRole && !(isBusinessGroup && isBusinessUrl)) {
        router.push(`/dashboard/${normalizedUserRole}`);
      }
    }
  }, [user, userData, isUserLoading, role, router, mounted]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!userData?.role) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4">Profile Incomplete</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          We couldn't find a valid role associated with your account.
        </p>
        <Button asChild>
          <Link href="/register">Complete Registration</Link>
        </Button>
      </div>
    );
  }

  const normalizedRole = userData.role.trim().toLowerCase();
  const DashboardComponent = RoleDashboards[normalizedRole];

  if (DashboardComponent) {
    return <DashboardComponent />;
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold font-headline mb-4">Welcome, {userData.name}</h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Your specialized dashboard for <strong>{userData.role}</strong> is currently under development.
      </p>
    </div>
  );
}
