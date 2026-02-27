
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, onAuthStateChanged, signInAnonymously, User as FirebaseUser } from 'firebase/auth';
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
 * Enhanced user hook that listens to real Firebase Auth state.
 * Returns a profile based on real Auth UID and the selected mock role.
 */
export const useUser = () => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // 1. Real Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // 2. Mock Role Loading & Anonymous Auth Trigger
    const savedRole = localStorage.getItem('krishimitra-role');
    setRole(savedRole);
    
    // Auto sign-in anonymously if a role is selected but no user session exists
    // This provides the request.auth context needed for Firestore Security Rules
    if (savedRole && !auth.currentUser && !user) {
      signInAnonymously(auth).catch((err) => {
        console.error("Critical: Anonymous sign-in failed. Firestore access will be blocked.", err);
      });
    }
  }, [auth, user]);

  const userData = (user && role) ? { 
    id: user.uid,
    name: user.displayName || role.charAt(0).toUpperCase() + role.slice(1), 
    role: role,
    phone: '+91 98765 43210',
    preferredLanguage: 'English',
    expertiseCategory: role === 'expert' ? 'Organic Farming & Crop Yield' : undefined,
    experienceYears: role === 'expert' ? 12 : undefined,
    bio: role === 'expert' ? 'Agricultural scientist specialized in sustainable crop practices and soil nutrient management with over 12 years of field experience across Maharashtra.' : undefined,
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
    isUserLoading: isAuthLoading, 
    isUserDataLoading: isAuthLoading, 
    userError: null 
  };
};
