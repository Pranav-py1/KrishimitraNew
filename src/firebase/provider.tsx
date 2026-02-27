
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  userData: any | null;
  isUserLoading: boolean;
  isUserDataLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult { 
  user: User | null;
  userData: any | null;
  isUserLoading: boolean;
  isUserDataLoading: boolean;
  userError: Error | null;
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
  const [authState, setAuthState] = useState<{
    user: User | null;
    userData: any | null;
    isUserLoading: boolean;
    isUserDataLoading: boolean;
    userError: Error | null;
  }>({
    user: null,
    userData: null,
    isUserLoading: true, 
    isUserDataLoading: false,
    userError: null,
  });

  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAuthState(prev => {
        if (prev.isUserLoading) {
          setHasTimedOut(true);
          return { ...prev, isUserLoading: false };
        }
        return prev;
      });
    }, 5000);

    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => { 
        if (!firebaseUser) {
          if (unsubscribeDoc) unsubscribeDoc();
          clearTimeout(timeoutId);
          setAuthState({ user: null, userData: null, isUserLoading: false, isUserDataLoading: false, userError: null });
          return;
        }

        setAuthState(prev => ({ ...prev, user: firebaseUser, isUserLoading: false, isUserDataLoading: true }));

        unsubscribeDoc = onSnapshot(
          doc(firestore, 'users', firebaseUser.uid),
          (docSnap) => {
            clearTimeout(timeoutId);
            setAuthState({ 
              user: firebaseUser, 
              userData: docSnap.exists() ? docSnap.data() : null, 
              isUserLoading: false, 
              isUserDataLoading: false,
              userError: null 
            });
          },
          (error) => {
            clearTimeout(timeoutId);
            setAuthState({ 
              user: firebaseUser, 
              userData: null, 
              isUserLoading: false, 
              isUserDataLoading: false,
              userError: error 
            });
          }
        );
      },
      (error) => { 
        clearTimeout(timeoutId);
        setAuthState({ user: null, userData: null, isUserLoading: false, isUserDataLoading: false, userError: error });
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
      clearTimeout(timeoutId);
    };
  }, [auth, firestore]); 

  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: true,
    firebaseApp,
    firestore,
    auth,
    user: authState.user,
    userData: authState.userData,
    isUserLoading: authState.isUserLoading,
    isUserDataLoading: authState.isUserDataLoading,
    userError: authState.userError,
  }), [firebaseApp, firestore, auth, authState]);

  if (hasTimedOut && !authState.user && authState.isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Connection Timeout</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Taking too long to connect. Please check your internet or try refreshing.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
export const useFirebaseApp = () => useFirebase().firebaseApp;

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}

export const useUser = (): UserHookResult => { 
  const { user, userData, isUserLoading, isUserDataLoading, userError } = useFirebase(); 
  return { user, userData, isUserLoading, isUserDataLoading, userError };
};
