// ==========================================
// NeuroLearn Admin Seed Script
// Run ONCE from the browser console (or a Node script) to create
// teacher & admin Firestore docs after you create those users in
// Firebase Console > Authentication manually.
//
// USAGE:
//   1. Go to Firebase Console → Authentication → Add User
//      for each teacher/admin email.
//   2. Copy the generated UID.
//   3. Call the functions below with the correct UID.
//
// This file is a utility helper — it is NOT imported anywhere automatically.
// ==========================================

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserRole } from '../../types';

interface SeedUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

/**
 * Write a user profile doc to Firestore.
 * Call this once for each teacher / admin after creating them in
 * Firebase Console → Authentication.
 */
export async function seedUserDoc(user: SeedUser): Promise<void> {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl ?? null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`✅ Seeded Firestore doc for ${user.email} (${user.role})`);
}

// ─── Example seed calls — fill in real UIDs from Firebase Console ─────────────
//
// seedUserDoc({
//   uid: 'REPLACE_WITH_TEACHER_UID',
//   name: 'Dr. Priya Raman',
//   email: 'p.raman@btech.edu',
//   role: 'teacher',
// });
//
// seedUserDoc({
//   uid: 'REPLACE_WITH_ADMIN_UID',
//   name: 'System Administrator',
//   email: 'admin@neurolearn.io',
//   role: 'admin',
// });
