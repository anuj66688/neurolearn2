import React from 'react';
import { Server } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Administration Console
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage system users, curriculum taxonomies, agent telemetry, and platform security rules
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Users</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">128</div>
          <div className="text-[11px] text-slate-500">Students, Faculty & Admins</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Subjects Configured</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">3</div>
          <div className="text-[11px] text-slate-500">CN, DSA, OS</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">AI Agent Nodes</div>
          <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">7 / 7 Online</div>
          <div className="text-[11px] text-emerald-500">0 latency errors</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Firebase Firestore</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Connected</div>
          <div className="text-[11px] text-emerald-500">Project: neuro-learn-4732e</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          Multi-Agent Runtime Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Central Agent Orchestrator</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Operational
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Doubt-Solving Agent (LLM Adapter)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Operational
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Study Planner Agent</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Operational
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Offline Fallback Engine</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Standby & Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
