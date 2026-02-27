'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Verifies authentication before proceeding with Firestore write.
 */
function ensureAuth() {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("Firestore write attempted before authentication was ready.");
  }
}

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  try {
    ensureAuth();
    setDoc(docRef, data, options).catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: data,
        })
      )
    })
  } catch (err: any) {
    console.error(err.message);
  }
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  try {
    ensureAuth();
    const promise = addDoc(colRef, data)
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
          })
        )
      });
    return promise;
  } catch (err: any) {
    console.error(err.message);
    return Promise.reject(err);
  }
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  try {
    ensureAuth();
    updateDoc(docRef, data)
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
          })
        )
      });
  } catch (err: any) {
    console.error(err.message);
  }
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  try {
    ensureAuth();
    deleteDoc(docRef)
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
          })
        )
      });
  } catch (err: any) {
    console.error(err.message);
  }
}