// ==========================================
// NeuroLearn Firebase Auth Service
// Handles sign-in, sign-up, sign-out and
// user-role resolution from Firestore.
// ==========================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { UserRole } from '../../types';

// ─── Firestore user document shape ────────────────────────────────────────────
export interface FirestoreUserDoc {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: ReturnType<typeof serverTimestamp> | string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fetch the Firestore profile document for a given UID */
export async function fetchUserDoc(uid: string): Promise<FirestoreUserDoc | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FirestoreUserDoc) : null;
}

/** Create (or overwrite) the Firestore profile document */
export async function writeUserDoc(data: Omit<FirestoreUserDoc, 'createdAt'>): Promise<void> {
  const ref = doc(db, 'users', data.uid);
  await setDoc(ref, { ...data, createdAt: serverTimestamp() }, { merge: true });
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

/**
 * Sign in with email/password.
 * Returns the Firestore user doc (which contains the role).
 */
export async function signIn(
  email: string,
  password: string
): Promise<FirestoreUserDoc> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  let userDoc = await fetchUserDoc(credential.user.uid);
  if (!userDoc || !userDoc.role) {
    const fallbackDoc: Omit<FirestoreUserDoc, 'createdAt'> = {
      uid: credential.user.uid,
      name: credential.user.displayName || email.split('@')[0],
      email: credential.user.email || email,
      role: (userDoc?.role as UserRole) || 'student',
    };
    try {
      await writeUserDoc(fallbackDoc);
      userDoc = { ...fallbackDoc, createdAt: new Date().toISOString() };
    } catch {
      userDoc = { ...fallbackDoc, createdAt: new Date().toISOString() };
    }
  }
  return userDoc;
}

/**
 * Register a new student account.
 * Creates the Firebase Auth user and writes the Firestore profile.
 */
export async function registerStudent(
  name: string,
  email: string,
  password: string
): Promise<FirestoreUserDoc> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  const newDoc: Omit<FirestoreUserDoc, 'createdAt'> = {
    uid: credential.user.uid,
    name,
    email,
    role: 'student',
  };
  await writeUserDoc(newDoc);
  return { ...newDoc, createdAt: new Date().toISOString() };
}

/** Sign out the current user */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes.
 * Returns the unsubscribe function.
 */
export function onAuthChange(
  callback: (fbUser: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
