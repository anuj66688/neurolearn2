import React, { useState, useEffect } from 'react';
import { Search, BookOpen, CheckCircle2, AlertTriangle, Users, Award, BarChart3 } from 'lucide-react';
import { generateQuiz } from '../../services/ai/geminiService';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { demoStudentProfile, demoQuizzes } from '../../data/demoData';
import { db } from '../../services/firebase/firebaseConfig';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StudentItem {
  uid: string;
  name: string;
  email: string;
  gradeLevel: string;
  mastery: number;
  weakness: string;
}

export const TeacherStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([
    {
      uid: 'demo-1',
      name: demoStudentProfile.name,
      email: 'aarav.sharma@btech.edu',
      gradeLevel: demoStudentProfile.gradeLevel,
      mastery: demoStudentProfile.overallMastery,
      weakness: demoStudentProfile.weaknesses[0],
    },
    {
      uid: 'demo-2',
      name: 'Sneha Patel',
      email: 'sneha.p@btech.edu',
      gradeLevel: 'B.Tech CS 3rd Year',
      mastery: 84,
      weakness: 'Deadlock Avoidance',
    },
    {
      uid: 'demo-3',
      name: 'Rohan Mehta',
      email: 'rohan.m@btech.edu',
      gradeLevel: 'B.Tech CS 3rd Year',
      mastery: 62,
      weakness: 'AVL Tree Rotations',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadStudents() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const loaded: StudentItem[] = snap.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              uid: data.uid || docSnap.id,
              name: data.name || 'Student',
              email: data.email || 'N/A',
              gradeLevel: 'B.Tech CS 3rd Year',
              mastery: 75,
              weakness: 'Subnetting & CIDR',
            };
          });
          setStudents(loaded);
        }
      } catch (err) {
        console.warn('Teacher students roster using cached fallback:', err);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Cohort Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student profiles, cognitive diagnostic history, and AI intervention trajectories
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or email..."
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.uid}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.email} • {s.gradeLevel}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Focus Deficit</div>
                  <div className="text-xs font-bold text-rose-500">{s.weakness}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Mastery</div>
                  <div className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                    {s.mastery}%
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">No students match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TeacherAssessmentsPage: React.FC = () => {
  const handleGenerateQuiz = async () => {
    try {
      const topic = 'General Knowledge';
      const quiz = await generateQuiz('general', topic, 'medium', 5);
      const quizId = `quiz-${Date.now()}`;
      const quizDoc = {
        id: quizId,
        subjectId: 'general',
        subjectName: 'General Knowledge',
        title: `Quiz on ${topic}`,
        topicName: topic,
        difficulty: 'medium',
        timeLimitMinutes: 10,
        questions: quiz,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'quizzes'), quizDoc);
      alert('AI-generated quiz saved!');
    } catch (e) {
      console.error(e);
      alert('Failed to generate quiz');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Assessment Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review curriculum diagnostic quizzes, questions bank, and automated scoring rubrics
        </p>
        <button
          onClick={handleGenerateQuiz}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Generate AI Quiz
        </button>
      </div>

      <div className="space-y-4">
        {demoQuizzes.map((q) => (
          <div
            key={q.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {q.subjectName}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{q.title}</h3>
                <p className="text-xs text-slate-500">Topic: {q.topicName} • Difficulty: {q.difficulty}</p>
              </div>
              <div className="text-right text-xs text-slate-400 font-medium">
                {q.questions.length} Questions • {q.timeLimitMinutes} Mins
              </div>
            </div>

            <div className="space-y-3">
              {q.questions.map((ques, idx) => (
                <div
                  key={ques.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Q{idx + 1}. {ques.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                    {ques.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border text-[11px] ${
                          oIdx === ques.correctOptionIndex
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {opt} {oIdx === ques.correctOptionIndex && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export const TeacherAnalyticsPage: React.FC = () => {
  const topicData = [
    { topic: 'OSI Reference Model', averageScore: 92 },
    { topic: 'Binary Trees & BSTs', averageScore: 65 },
    { topic: 'CPU Process Scheduling', averageScore: 88 },
    { topic: 'Subnetting & CIDR', averageScore: 42 },
    { topic: 'Semaphores & Deadlock', averageScore: 52 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Curriculum Diagnostics & Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Aggregated class performance trends, concept mastery distribution, and intervention targets
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" /> Topic Mastery Distribution (%)
          </h3>
          <span className="text-xs text-slate-400">Computer Science 3rd Year Cohort</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="averageScore" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
