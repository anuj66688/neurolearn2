// ==========================================
// NeuroLearn AuthContext
// Real Firebase Auth + Firestore role resolution.
// ==========================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User as FirebaseUser } from 'firebase/auth';
import { User, UserRole } from '../types';
import {
  signIn,
  signOut,
  onAuthChange,
  fetchUserDoc,
  writeUserDoc,
  registerStudent,
  type FirestoreUserDoc,
} from '../services/firebase/authService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true); // true until first auth state resolved

  // ─── Subscribe to Firebase Auth state ────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch Firestore profile to get the role
        let userDoc = await fetchUserDoc(fbUser.uid);
        if (!userDoc || !userDoc.role) {
          const fallbackDoc: Omit<FirestoreUserDoc, 'createdAt'> = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            role: (userDoc?.role as UserRole) || 'student',
          };
          try {
            await writeUserDoc(fallbackDoc);
            userDoc = { ...fallbackDoc, createdAt: new Date().toISOString() };
          } catch {
            userDoc = { ...fallbackDoc, createdAt: new Date().toISOString() };
          }
        }

        setUser({
          id: userDoc.uid || fbUser.uid,
          name: userDoc.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: userDoc.email || fbUser.email || '',
          role: userDoc.role || 'student',
          avatarUrl: userDoc.avatarUrl,
          createdAt:
            typeof userDoc.createdAt === 'string'
              ? userDoc.createdAt
              : new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userDoc = await signIn(email, password);
      setUser({
        id: userDoc.uid,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        avatarUrl: userDoc.avatarUrl,
        createdAt:
          typeof userDoc.createdAt === 'string'
            ? userDoc.createdAt
            : new Date().toISOString(),
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      return { success: false, error: friendlyAuthError(msg) };
    }
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userDoc = await registerStudent(name, email, password);
      setUser({
        id: userDoc.uid,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        createdAt:
          typeof userDoc.createdAt === 'string'
            ? userDoc.createdAt
            : new Date().toISOString(),
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      return { success: false, error: friendlyAuthError(msg) };
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut();
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// ─── Convert Firebase error codes to human-readable messages ─────────────────
function friendlyAuthError(msg: string): string {
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
    return 'Invalid email or password.';
  if (msg.includes('email-already-in-use')) return 'This email is already registered.';
  if (msg.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (msg.includes('invalid-email')) return 'Please enter a valid email address.';
  if (msg.includes('no Firestore profile')) return msg;
  return 'Authentication error. Please try again.';
}
