
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'farmer' | 'exporter' | 'consumer' | 'supplier' | 'service_provider' | 'admin';

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedRole = localStorage.getItem('krishimitra-role') as UserRole;
    if (savedRole) {
      setRoleState(savedRole);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('krishimitra-role', newRole);
    router.push(`/dashboard/${newRole.replace('_', '-')}`);
  };

  const clearRole = () => {
    setRoleState(null);
    localStorage.removeItem('krishimitra-role');
    router.push('/');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
