import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  Bot,
  Zap,
} from 'lucide-react';
import { AgentArchitectureDiagram } from '../../components/landing/AgentArchitectureDiagram';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 to-purple-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Next-Generation Multi-Agent AI for Higher Education</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto">
            Neuro<span className="text-brand-600 dark:text-brand-400">Learn</span>
          </h1>

          <p className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            Learn Smarter. Learn Your Way.
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An AI-driven multi-agent personalized education system that adapts learning to every student.
            Seven specialized cognitive agents collaborate in real time to understand your strengths, close knowledge gaps,
            and dynamically engineer your path to mastery.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#architecture"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
            >
              <Bot className="w-5 h-5 text-brand-500" />
              <span>Explore NeuroLearn</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">7 Agents</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specialized Modular Subsystems</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adaptive Feedback Cycle</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Real-Time</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Timetable Re-optimization</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Zero Leak</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Secure Architecture Layer</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              How NeuroLearn Works
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Traditional platforms present rigid static videos. NeuroLearn closes the loop with continuous adaptive intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Diagnose & Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The Profiling and Quiz agents calibrate your current knowledge level, identifying strong foundations
                and specific concept vulnerabilities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Orchestrate & Plan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The Performance and Recommendation agents analyze error patterns, directing the Study Planner agent to
                dynamically reallocate your calendar slots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Adapt & Master</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Engage in targeted practice with our 24/7 AI Academic Assistant. As you conquer weak topics, the system
                automatically unlocks progressive material.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MULTI-AGENT ARCHITECTURE SECTION (Interactive Diagram) */}
      <section id="architecture" className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AgentArchitectureDiagram />
        </div>
      </section>

      {/* 4. CORE FEATURES SHOWCASE */}
      <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Built for Engineering Students & Educators
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Every feature is driven by specialized data contracts rather than generic prompting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Personalized Learning Paths</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visual subject roadmaps track granular subtopic completion and guide you to the exact next high-impact concept.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Assessment Engine</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Adaptive MCQs calibrate to your skill level. Instant feedback breaks down why an option was right or wrong.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Academic Assistant</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ask questions like "Explain OSI model" or "Explain TCP 3-way handshake". Receive step-by-step Socratic breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Adaptive Study Planner</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When you struggle on a quiz, study hours automatically reallocate to reinforce that topic before exam deadlines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contextual Recommendations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resource curation tailored to your learning style (video animations for visual learners, code for practical coders).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Progress Telemetry & Analytics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recharts-powered score trends, study streak tracking, and predictive readiness metrics for university placements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-tr from-brand-900 to-indigo-950 border border-brand-700/50 shadow-2xl text-white relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Multi-Agent Learning?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-brand-200 max-w-xl mx-auto">
              Launch the Student Learning Dashboard or inspect Teacher & Admin analytics.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/student/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-900 font-bold hover:bg-slate-100 shadow-lg transition-all"
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/teacher/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-800/80 hover:bg-brand-800 text-white font-semibold border border-brand-600/50 transition-all"
              >
                <span>Teacher Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
