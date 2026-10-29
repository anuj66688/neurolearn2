// ==========================================
// NeuroLearn Firestore Data Service
// Replaces mock data with real Firestore reads/writes.
// ==========================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  StudentProfile,
  Subject,
  PerformanceData,
  Quiz,
  StudyPlan,
  Recommendation,
  LearningProgress,
  QuizResult,
} from '../../types';
import {
  demoStudentProfile,
  demoPerformanceData,
  demoStudyPlan,
  demoRecommendations,
  demoLearningProgress,
} from '../../data/demoData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tsToString(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

// ─── Student Profile ──────────────────────────────────────────────────────────

export async function getStudentProfile(uid: string): Promise<StudentProfile | null> {
  const ref = doc(db, 'studentProfiles', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, updatedAt: tsToString(d.updatedAt) } as StudentProfile;
}

export async function saveStudentProfile(uid: string, profile: StudentProfile): Promise<void> {
  await setDoc(doc(db, 'studentProfiles', uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  });
}

// ─── Subjects (shared catalogue) ──────────────────────────────────────────────

export async function getSubjects(): Promise<Subject[]> {
  const snap = await getDocs(collection(db, 'subjects'));
  return snap.docs.map((d) => d.data() as Subject);
}

export async function saveSubject(subject: Subject): Promise<void> {
  await setDoc(doc(db, 'subjects', subject.id), subject);
}

// ─── Performance Data ─────────────────────────────────────────────────────────

export async function getPerformanceData(uid: string): Promise<PerformanceData | null> {
  const ref = doc(db, 'performance', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, lastAnalyzedAt: tsToString(d.lastAnalyzedAt) } as PerformanceData;
}

export async function savePerformanceData(uid: string, data: PerformanceData): Promise<void> {
  await setDoc(doc(db, 'performance', uid), {
    ...data,
    lastAnalyzedAt: serverTimestamp(),
  });
}

// ─── Quiz Results ─────────────────────────────────────────────────────────────

export async function saveQuizResult(result: QuizResult): Promise<string> {
  const ref = await addDoc(collection(db, 'quizResults'), {
    ...result,
    completedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getStudentQuizResults(uid: string): Promise<QuizResult[]> {
  const q = query(collection(db, 'quizResults'), where('studentId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return { ...data, id: d.id, completedAt: tsToString(data.completedAt) } as QuizResult;
    })
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

// ─── Quizzes (agent-generated / database-seeded) ───────────────────────────────

export async function saveQuiz(quiz: Quiz): Promise<void> {
  await setDoc(doc(db, 'quizzes', quiz.id), {
    ...quiz,
    createdAt: serverTimestamp(),
  });
}

export async function getQuizzesBySubject(subjectId: string): Promise<Quiz[]> {
  const q = query(collection(db, 'quizzes'), where('subjectId', '==', subjectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Quiz);
}

export async function getAllQuizzes(): Promise<Quiz[]> {
  const snap = await getDocs(collection(db, 'quizzes'));
  return snap.docs.map((d) => d.data() as Quiz);
}

// ─── Study Plans ──────────────────────────────────────────────────────────────

export async function getStudyPlan(uid: string): Promise<StudyPlan | null> {
  const ref = doc(db, 'studyPlans', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, generatedDate: tsToString(d.generatedDate) } as StudyPlan;
}

export async function saveStudyPlan(uid: string, plan: StudyPlan): Promise<void> {
  await setDoc(doc(db, 'studyPlans', uid), {
    ...plan,
    generatedDate: serverTimestamp(),
  });
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export async function getRecommendations(uid: string): Promise<Recommendation[]> {
  const q = query(collection(db, 'recommendations'), where('studentId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return { ...data, id: d.id, createdAt: tsToString(data.createdAt) } as Recommendation;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveRecommendations(uid: string, recs: Recommendation[]): Promise<void> {
  for (const rec of recs) {
    await setDoc(doc(db, 'recommendations', `${uid}_${rec.id}`), {
      ...rec,
      createdAt: serverTimestamp(),
    });
  }
}

// ─── Learning Progress ────────────────────────────────────────────────────────

export async function getLearningProgress(uid: string): Promise<LearningProgress | null> {
  const ref = doc(db, 'learningProgress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, lastUpdated: tsToString(d.lastUpdated) } as LearningProgress;
}

export async function saveLearningProgress(uid: string, progress: LearningProgress): Promise<void> {
  await setDoc(doc(db, 'learningProgress', uid), {
    ...progress,
    lastUpdated: serverTimestamp(),
  });
}

// ─── Initialize Student Baseline in Firestore ─────────────────────────────────

export async function initializeStudentData(uid: string, name: string): Promise<StudentProfile> {
  const existing = await getStudentProfile(uid);
  if (existing) return existing;

  const initialProfile: StudentProfile = {
    ...demoStudentProfile,
    id: `prof-${uid}`,
    userId: uid,
    name: name || demoStudentProfile.name,
    updatedAt: new Date().toISOString(),
  };

  const initialPerf: PerformanceData = {
    ...demoPerformanceData,
    studentId: uid,
  };

  const initialPlan: StudyPlan = {
    ...demoStudyPlan,
    id: `plan-${uid}`,
    studentId: uid,
  };

  const initialProgress: LearningProgress = {
    ...demoLearningProgress,
    studentId: uid,
  };

  const initialRecs: Recommendation[] = demoRecommendations.map((r, i) => ({
    ...r,
    id: `rec-${uid}-${i}`,
    studentId: uid,
  }));

  try {
    await Promise.all([
      saveStudentProfile(uid, initialProfile),
      savePerformanceData(uid, initialPerf),
      saveStudyPlan(uid, initialPlan),
      saveLearningProgress(uid, initialProgress),
      saveRecommendations(uid, initialRecs),
    ]);
  } catch (err) {
    console.warn('Could not auto-seed baseline data in Firestore (check rules/permissions):', err);
  }

  return initialProfile;
}

