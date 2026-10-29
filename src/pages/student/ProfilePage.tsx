import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { profilingAgent } from '../../agents/profilingAgent';
import { StudentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, saveStudentProfile } from '../../services/firebase/dataService';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(profilingAgent.getProfile());
  const [newGoal, setNewGoal] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    async function load() {
      try {
        const remote = await getStudentProfile(uid);
        if (remote) setProfile(remote);
      } catch (err) {
        console.warn('Failed to load profile from Firestore:', err);
      }
    }
    load();
  }, [user?.id]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const updated: StudentProfile = {
      ...profile,
      learningGoals: [...profile.learningGoals, newGoal.trim()],
    };
    setProfile(updated);
    setNewGoal('');
    setIsSaved(true);

    if (user?.id) {
      try {
        await saveStudentProfile(user.id, updated);
      } catch (err) {
        console.warn('Error saving updated goal to Firestore:', err);
      }
    }

    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
          {profile.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {profile.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              Student
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.gradeLevel} • Target: <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.targetExam}</span>
          </p>
          <div className="text-[11px] text-slate-400 pt-1">
            Student Profiling Agent ID: <span className="font-mono">{profile.id}</span>
          </div>
        </div>
      </div>

      {/* Learning Style Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Learning Preferences (Multimodal Weights)
          </h2>
          <span className="text-xs text-slate-400">Calibrated by AI Profiling Agent</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Visual */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Visual & Conceptual (Diagrams, Architecture, Videos)</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{profile.preferences.visual}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${profile.preferences.visual}%` }} />
            </div>
          </div>

          {/* Practical */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Practical & Hands-On (Coding, Problem Solving)</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{profile.preferences.practical}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profile.preferences.practical}%` }} />
            </div>
          </div>

          {/* Theoretical */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Theoretical & Academic Textbooks</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">{profile.preferences.theoretical}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${profile.preferences.theoretical}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-500" />
          Active Academic Goals
        </h2>

        <div className="space-y-2 text-xs">
          {profile.learningGoals.map((goal, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{goal}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddGoal} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add new learning target (e.g. 'Master B-Trees and Disk Storage')..."
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Add Goal
          </button>
        </form>

        {isSaved && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Goal saved and registered with Student Profiling Agent!
          </div>
        )}
      </div>
    </div>
  );
};
