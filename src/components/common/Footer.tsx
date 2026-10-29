import React from 'react';
import { Brain, Layers, GitBranch, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-600 dark:text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">NeuroLearn</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              AI-Driven Multi-Agent Personalized Education System designed for adaptive higher education.
              Powered by 7 collaborating specialized intelligent agents orchestrated in a continuous feedback loop.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-brand-500" /> 7 Specialized Agents
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-emerald-500" /> Modular Orchestration
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Strict Data Isolation
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Specialized Agents</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-brand-500 cursor-pointer">Student Profiling Agent</li>
              <li className="hover:text-brand-500 cursor-pointer">Performance Analysis Agent</li>
              <li className="hover:text-brand-500 cursor-pointer">Content Recommendation Agent</li>
              <li className="hover:text-brand-500 cursor-pointer">Study Planner Agent</li>
              <li className="hover:text-brand-500 cursor-pointer">Quiz / Assessment Agent</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Project Modules</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-brand-500 cursor-pointer">Student Learning Portal</li>
              <li className="hover:text-brand-500 cursor-pointer">Teacher Analytics Dashboard</li>
              <li className="hover:text-brand-500 cursor-pointer">Curriculum Administration</li>
              <li className="hover:text-brand-500 cursor-pointer">Live Orchestrator Pipeline</li>
              <li className="hover:text-brand-500 cursor-pointer">Offline Fallback Engine</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NeuroLearn – B.Tech Computer Science Project. Designed for Viva & Academic Demonstration.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Orchestrator Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
