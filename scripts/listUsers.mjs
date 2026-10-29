import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Use existing service‑account key
const serviceAccount = "./neuro-learn-4732e-firebase-adminsdk-fbsvc-b6d0ab133b.json";
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function listUsers() {
  const snapshot = await db.collection('users').get();
  console.log('--- Users collection ---');
  snapshot.forEach(doc => {
    console.log(`${doc.id}:`, doc.data());
  });
}

listUsers().catch(console.error);
