'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Initializes the Firebase app and returns the typed SDK instances.
 * Ensures a singleton instance is used across the entire application.
 */
export function initializeFirebase() {
  let app: FirebaseApp;

  // Verify that ONLY ONE initializeApp() exists and uses the correct config
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Ensure Firestore and Auth are created using the SAME app instance
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app)
  };
}

export { FirebaseProvider, useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from './non-blocking-updates';
export { FirestorePermissionError } from './errors';
export { errorEmitter } from './error-emitter';
