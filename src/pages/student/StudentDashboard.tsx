import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  Award,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { suggestMoreTopics } from '../../services/ai/geminiService';
import {
  demoStudentProfile,
  demoPerformanceData,
  demoStudyPlan,
  demoRecommendations,
} from '../../data/demoData';
import {
  StudentProfile,
  PerformanceData,
  StudyPlan,
  Recommendation,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentProfile,
  getPerformanceData,
  getStudyPlan,
  getRecommendations,
  getStudentQuizResults,
  initializeStudentData,
} from '../../services/firebase/dataService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(() => ({
    ...demoStudentProfile,
    name: user?.name || 'Student',
  }));
  const [performance, setPerformance] = useState<PerformanceData>(demoPerformanceData);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(demoStudyPlan);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(demoRecommendations);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    const userName = user.name || 'Student';
    let isMounted = true;

    async function loadData() {
      try {
        let prof = await getStudentProfile(uid);
        if (!prof) {
          prof = await initializeStudentData(uid, userName);
        } else if (prof.name !== userName && userName !== 'Student') {
          prof.name = userName;
        }

        if (!isMounted) return;
        if (prof) {
          setProfile(prof);
          try {
            const topics = await suggestMoreTopics(prof.weaknesses || []);
            if (isMounted) setSuggestedTopics(topics);
          } catch {
            // fallback
          }
        }

        const [perf, plan, recs, quizResults] = await Promise.all([
          getPerformanceData(uid),
          getStudyPlan(uid),
          getRecommendations(uid),
          getStudentQuizResults(uid),
        ]);

        if (!isMounted) return;
        if (perf) {
          if (quizResults && quizResults.length > 0) {
            const totalScore = quizResults.reduce((acc, q) => acc + q.score, 0);
            const avgAccuracy = Math.round(totalScore / quizResults.length);
            setPerformance({
              ...perf,
              quizzesCompleted: quizResults.length,
              accuracy: avgAccuracy,
              recentScores: quizResults.slice(0, 6).map((q) => ({
                date: new Date(q.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                score: q.score,
                topic: q.topicId || 'Quiz',
              })),
            });
          } else {
            setPerformance(perf);
          }
        }
        if (plan) setStudyPlan(plan);
        if (recs && recs.length > 0) setRecommendations(recs);
      } catch (err) {
        console.warn('Error loading real profile data from Firestore:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.name]);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent System Adaptive Loop: Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-brand-100 text-sm max-w-xl">
              You are currently on a <strong className="text-white">{profile.currentStreak}-day learning streak</strong>.
              Your AI Study Planner adjusted your schedule today to strengthen <span className="underline decoration-amber-400 font-semibold">{profile.weaknesses[0] || 'Core Concepts'}</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/quizzes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-sm hover:bg-brand-50 shadow-md transition-all"
            >
              <span>Take Daily Diagnostic</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/student/assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold text-sm transition-all"
            >
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Streak
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {profile.currentStreak} Days
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Top 10% consistency
            </div>
          </div>
        </div>

        {/* Study Hours */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Hours
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {profile.totalStudyHours} hrs
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              +4.5 hrs this week
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quiz Accuracy
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {performance.accuracy}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +5.2% improvement
            </div>
          </div>
        </div>

        {/* Overall Mastery */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Curriculum Mastery
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {profile.overallMastery}%
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              8 of 16 topics mastered
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Performance Trend Chart & Today's Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Trend Rechart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Score Performance Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated by Performance Analysis Agent across recent diagnostic assessments
              </p>
            </div>
            <Link
              to="/student/progress"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance.recentScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
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
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Adaptive Study Plan */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Today's Adaptive Plan
              </h3>
            </div>
            <Link to="/student/planner" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View Calendar
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Generated by AI Study Planner Agent based on your available 2.5 hours
          </p>

          <div className="space-y-2.5 flex-1">
            {studyPlan.tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {task.title}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-[11px]">
                    <span className="font-medium text-brand-600 dark:text-brand-400">
                      {task.subjectName}
                    </span>
                    <span>• {task.durationMinutes} mins</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic">
            💡 {studyPlan.adaptabilityNote}
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Strengths/Weaknesses & Priority Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagnostic Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Concept Strengths vs Identified Deficits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Strong Foundations
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {profile.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50">
              <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Active Intervention Focus
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {profile.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
                {/* AI Suggested Topics */}
                <div className="p-4 mt-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
                  <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4" /> AI Suggested Topics
                  </div>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    {suggestedTopics.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Content Recommendation Agent
            </h3>
            <Link
              to="/student/recommendations"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              All Materials
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {rec.title}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1">
                    {rec.description}
                  </p>
                  <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                    Trigger: {rec.triggerReason}
                  </div>
                </div>
                <Link
                  to="/student/recommendations"
                  className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-[11px] shrink-0"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
