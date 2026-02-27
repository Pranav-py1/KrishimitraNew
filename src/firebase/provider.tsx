'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseContext = createContext<FirebaseContextState | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: true,
    firebaseApp,
    firestore,
    auth,
  }), [firebaseApp, firestore, auth]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
export const useFirebaseApp = () => useFirebase().firebaseApp;

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}

/**
 * Enhanced mock user hook for the frontend-only prototype.
 * Returns a mock profile based on the selected role in localStorage.
 */
export const useUser = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('krishimitra-role');
    setRole(savedRole);
    setIsLoading(false);
  }, []);

  const user = role ? { 
    uid: `mock-${role}-id`, 
    displayName: role.charAt(0).toUpperCase() + role.slice(1),
    email: `${role}@example.com` 
  } : null;

  const userData = role ? { 
    name: user?.displayName, 
    role: role,
    phone: '+91 98765 43210',
    preferredLanguage: 'English',
    expertiseCategory: role === 'expert' ? 'Organic Farming' : undefined,
    bio: role === 'expert' ? 'Agricultural scientist with 15+ years of experience in crop management and soil health.' : undefined,
    location: {
      village: 'Kisanpur',
      taluka: 'Agri-Taluka',
      district: 'Green-District',
      pincode: '400001',
      address: 'Main Farm Road, Near Post Office'
    }
  } : null;

  return { 
    user, 
    userData, 
    isUserLoading: isLoading, 
    isUserDataLoading: isLoading, 
    userError: null 
  };
};