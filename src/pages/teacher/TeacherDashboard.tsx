import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertTriangle, Activity } from 'lucide-react';
import { demoStudentProfile } from '../../data/demoData';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';

interface StudentRow {
  uid: string;
  name: string;
  email: string;
  mastery: number;
  weakTopic: string;
  streak: number;
  status: string;
}

export const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentRow[]>([
    {
      uid: 'demo-1',
      name: demoStudentProfile.name,
      email: 'aarav.sharma@btech.edu',
      mastery: demoStudentProfile.overallMastery,
      weakTopic: demoStudentProfile.weaknesses[0],
      streak: demoStudentProfile.currentStreak,
      status: 'Active & Adapting',
    },
    {
      uid: 'demo-2',
      name: 'Sneha Patel',
      email: 'sneha.p@btech.edu',
      mastery: 84,
      weakTopic: 'Deadlock Avoidance',
      streak: 12,
      status: 'Active & Adapting',
    },
    {
      uid: 'demo-3',
      name: 'Rohan Mehta',
      email: 'rohan.m@btech.edu',
      mastery: 62,
      weakTopic: 'AVL Tree Rotations',
      streak: 4,
      status: 'High Priority Intervention',
    },
  ]);

  useEffect(() => {
    async function fetchRealStudents() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const loaded: StudentRow[] = snap.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              uid: data.uid || docSnap.id,
              name: data.name || 'Student',
              email: data.email || 'N/A',
              mastery: 74,
              weakTopic: 'Subnetting & CIDR',
              streak: 3,
              status: 'Real Time Sync Active',
            };
          });
          setStudents(loaded);
        }
      } catch (err) {
        console.warn('Teacher dashboard using fallback cohort:', err);
      }
    }
    fetchRealStudents();
  }, []);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Teacher & Faculty Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor class diagnostics, detect curriculum vulnerabilities, and inspect student agent recommendations
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Enrolled Students</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">64</div>
          <div className="text-[11px] text-slate-500">B.Tech CS 3rd Year</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Avg Class Mastery</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">72.4%</div>
          <div className="text-[11px] text-emerald-500 font-medium">+3.8% this month</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Top Concept Deficit</div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1 truncate">Subnetting</div>
          <div className="text-[11px] text-rose-500">42% average accuracy</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Agent Loops</div>
          <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">64 / 64</div>
          <div className="text-[11px] text-slate-500">Real-time adaptive syncing</div>
        </div>
      </div>

      {/* Cohort Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          Active Student Cohort Diagnostics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Overall Mastery</th>
                <th className="p-3">Identified Weak Topic</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Agent Orchestrator Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((st) => (
                <tr key={st.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.email}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {st.mastery}%
                  </td>
                  <td className="p-3 text-rose-500 font-medium">
                    {st.weakTopic}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{st.streak} Days</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
