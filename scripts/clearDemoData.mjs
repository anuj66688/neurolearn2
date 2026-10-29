import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Update this path to point to your Firebase service account key JSON file.
const serviceAccount = "./neuro-learn-4732e-firebase-adminsdk-fbsvc-b6d0ab133b.json";
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const collections = [
  'studentProfiles',
  'performance',
  'quizResults',
  'quizzes',
  'studyPlans',
  'recommendations',
  'learningProgress',
];

async function deleteAll() {
  for (const col of collections) {
    const docs = await db.collection(col).listDocuments();
    const promises = docs.map(doc => doc.delete());
    await Promise.all(promises);
    console.log(`✅ Deleted ${col}`);
  }
  console.log('All demo collections cleared.');
}

deleteAll().catch(console.error);
