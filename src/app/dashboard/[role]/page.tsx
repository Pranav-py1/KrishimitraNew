
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RoleDashboards } from './dashboard-views';
import { useRole } from '@/components/role-context';

export default function DynamicDashboardPage() {
  const { role } = useParams();
  const { role: activeRole, isLoading } = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!activeRole) {
      router.push('/');
      return;
    }

    const normalizedActiveRole = activeRole.replace('_', '-');
    const urlRole = typeof role === 'string' ? role.toLowerCase() : '';

    if (normalizedActiveRole !== urlRole) {
      router.push(`/dashboard/${normalizedActiveRole}`);
    }
  }, [activeRole, isLoading, role, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!activeRole) return null;

  const normalizedRole = activeRole.trim().toLowerCase();
  const DashboardComponent = RoleDashboards[normalizedRole];

  if (DashboardComponent) {
    return <DashboardComponent />;
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold font-headline mb-4">Welcome to KrishiMitra</h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Your specialized dashboard for <strong>{activeRole}</strong> is currently under development.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
