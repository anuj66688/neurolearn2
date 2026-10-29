import React, { useState, useEffect } from 'react';
import {
  Clock,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { demoLearningProgress } from '../../data/demoData';
import { LearningProgress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getLearningProgress } from '../../services/firebase/dataService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>(demoLearningProgress);

  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    async function load() {
      try {
        const remote = await getLearningProgress(uid);
        if (remote) setProgress(remote);
      } catch (err) {
        console.warn('Failed to load progress from Firestore:', err);
      }
    }
    load();
  }, [user?.id]);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learning Progress & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Telemetry aggregated by Progress Monitoring Agent and Performance Analysis Agent
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Study Hours
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {progress.totalStudyHours} hrs
          </div>
          <div className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">
            Avg 1.8 hrs/day
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Study Streak
          </div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">
            {progress.studyStreakDays} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Target: 14 days
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Curriculum Completion
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {progress.completionPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {progress.completedTopicsCount} of {progress.totalTopicsCount} topics
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Accuracy
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {progress.overallAccuracy}%
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">
            Across 14 assessments
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Weekly Study Hours
            </h3>
            <span className="text-xs text-slate-400">Past 4 Weeks</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Assessment Scores Line Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Average Weekly Assessment Score (%)
            </h3>
            <span className="text-xs text-slate-400">Past 4 Weeks</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Agent Insights */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          Progress Monitoring Agent Insights
        </h3>

        <div className="space-y-2 text-xs">
          {demoLearningProgress.insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
