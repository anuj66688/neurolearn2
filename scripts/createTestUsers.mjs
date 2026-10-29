import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Update this path to point to your Firebase service‑account JSON file.
const serviceAccount = "./neuro-learn-4732e-firebase-adminsdk-fbsvc-b6d0ab133b.json";
initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

const testUsers = [
  { email: 'admin@test.com',    password: 'AdminPass123!',    role: 'admin' },
  { email: 'teacher1@test.com', password: 'TeachPass123!',   role: 'teacher' },
  { email: 'teacher2@test.com', password: 'TeachPass123!',   role: 'teacher' },
  { email: 'student1@test.com', password: 'StudPass123!',    role: 'student' },
  { email: 'student2@test.com', password: 'StudPass123!',    role: 'student' },
  { email: 'student3@test.com', password: 'StudPass123!',    role: 'student' },
];

async function createUsers() {
  for (const u of testUsers) {
    try {
      const userRecord = await auth.createUser({
        email: u.email,
        password: u.password,
        emailVerified: true,
      });
      // Add matching Firestore document with role
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: u.email,
        name: u.email.split('@')[0],
        role: u.role,
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ Created ${u.role}: ${u.email}`);
    } catch (e) {
      console.error('⚠️ Error creating', u.email, e.message);
    }
  }
}

createUsers().catch(console.error);
