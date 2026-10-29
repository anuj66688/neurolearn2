import React, { useState } from 'react';
import {
  Brain,
  UserCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Activity,
  ArrowRight,
  Play,
  RotateCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { AgentType } from '../../types';

interface AgentInfo {
  type: AgentType;
  title: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  inputs: string[];
  outputs: string[];
  file: string;
}

const AGENTS: AgentInfo[] = [
  {
    type: 'profiling',
    title: 'Student Profiling Agent',
    role: 'Synthesizes cognitive habits, strengths, deficits, and pacing preferences',
    icon: <UserCheck className="w-5 h-5 text-blue-500" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    inputs: ['Student Profile', 'Assessment Scores', 'Learning Goals', 'Study Velocity'],
    outputs: ['Cognitive Profile', 'Preference Matrix', 'Strength/Deficit Index'],
    file: 'src/agents/profilingAgent.ts',
  },
  {
    type: 'performance',
    title: 'Performance Analysis Agent',
    role: 'Computes topic mastery percentiles, error patterns, and learning curve trends',
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    inputs: ['Raw Quiz Answers', 'Historical Submissions', 'Time per Question'],
    outputs: ['Mastery Breakdown', 'Accuracy Metrics', 'Flagged Weak Subtopics'],
    file: 'src/agents/performanceAgent.ts',
  },
  {
    type: 'recommendation',
    title: 'Content Recommendation Agent',
    role: 'Curates multimodal learning resources aligned with detected cognitive gaps',
    icon: <Sparkles className="w-5 h-5 text-pink-500" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/40',
    borderColor: 'border-pink-200 dark:border-pink-800',
    inputs: ['Weak Topics List', 'Learning Style (Visual/Practical)', 'Current Level'],
    outputs: ['Targeted Articles', 'Visual Simulations', 'Practice Exercises'],
    file: 'src/agents/recommendationAgent.ts',
  },
  {
    type: 'studyPlanner',
    title: 'Study Planner Agent',
    role: 'Dynamically adapts daily & weekly calendar to reallocate time to deficit topics',
    icon: <Calendar className="w-5 h-5 text-amber-500" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    inputs: ['Available Study Hours', 'Deficit Topics', 'Target Exam Deadline'],
    outputs: ['Prioritized Schedule', 'Time Allocations', 'Spaced Repetition Slots'],
    file: 'src/agents/studyPlannerAgent.ts',
  },
  {
    type: 'quiz',
    title: 'Quiz / Assessment Agent',
    role: 'Generates targeted diagnostic assessments and provides automated evaluation',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    inputs: ['Syllabus Objectives', 'Target Difficulty (Easy/Med/Hard)', 'Topic Focus'],
    outputs: ['Adaptive MCQs', 'Step-by-Step Explanations', 'Detailed Score Breakdown'],
    file: 'src/agents/quizAgent.ts',
  },
  {
    type: 'doubt',
    title: 'Doubt-Solving Agent',
    role: 'Interactive academic assistant providing step-by-step tutoring on complex topics',
    icon: <MessageSquare className="w-5 h-5 text-cyan-500" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    inputs: ['Student Queries', 'Conversation Context', 'Code Snippets'],
    outputs: ['Pedagogical Explanations', 'Concrete Analogies', 'Follow-up Prompts'],
    file: 'src/agents/doubtAgent.ts',
  },
  {
    type: 'progress',
    title: 'Progress Monitoring Agent',
    role: 'Tracks study streaks, time telemetry, mastery milestones, and predictive velocity',
    icon: <Activity className="w-5 h-5 text-indigo-500" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    inputs: ['Session Durations', 'Task Completions', 'Assessment Milestones'],
    outputs: ['Learning Streak', 'Completion Percentile', 'Velocity Action Insights'],
    file: 'src/agents/progressAgent.ts',
  },
];

const ADAPTIVE_CYCLE_STEPS = [
  { num: 1, agent: 'Quiz Agent', action: 'Student submits quiz; Agent evaluates answers & accuracy' },
  { num: 2, agent: 'Performance Agent', action: 'Identifies performance drop in Subnetting & CIDR (42%)' },
  { num: 3, agent: 'Recommendation Agent', action: 'Curates visual CIDR guide matched to student profile' },
  { num: 4, agent: 'Study Planner Agent', action: 'Escalates Subnetting priority & schedules 40m study block' },
  { num: 5, agent: 'Progress Agent', action: 'Records 7th day streak and recalculates mastery trends' },
  { num: 6, agent: 'Profiling Agent', action: 'Updates learner knowledge profile for next adaptive session' },
];

export const AgentArchitectureDiagram: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(AGENTS[0]);
  const [activeCycleStep, setActiveCycleStep] = useState<number>(1);
  const [isCycleSimulating, setIsCycleSimulating] = useState<boolean>(false);

  const simulateCycle = () => {
    setIsCycleSimulating(true);
    let step = 1;
    setActiveCycleStep(1);

    const interval = setInterval(() => {
      step += 1;
      if (step > 6) {
        clearInterval(interval);
        setIsCycleSimulating(false);
        setActiveCycleStep(1);
      } else {
        setActiveCycleStep(step);
      }
    }, 1200);
  };

  return (
    <div className="w-full py-8">
      {/* Visual Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-3">
          <Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          Multi-Agent System Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Coordinated Intelligence, Modular Specialization
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Rather than a single monolithic chatbot, NeuroLearn implements 7 autonomous agents coordinated by an
          Agent Orchestrator to deliver continuous, personalized learning adaptation.
        </p>
      </div>

      {/* Main Multi-Agent Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 7 Specialized Agents List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Specialized Agents (Click to Inspect)
            </h3>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              Modular TypeScript Implementations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.map((agent) => {
              const isSelected = selectedAgent.type === agent.type;
              return (
                <button
                  key={agent.type}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-xl text-left transition-all duration-200 border ${
                    isSelected
                      ? `${agent.bgColor} ${agent.borderColor} shadow-md ring-2 ring-brand-500/20`
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {agent.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {agent.role}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Orchestrator Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-900/90 via-indigo-900/90 to-purple-900/90 text-white border border-brand-500/30 shadow-lg mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Brain className="w-6 h-6 text-brand-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Central Agent Orchestrator</h4>
                  <p className="text-xs text-brand-200">
                    Coordinates message buses, pipeline states, and data contracts between all 7 agents
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-1 rounded bg-white/10 text-brand-200 border border-white/10">
                src/agents/orchestrator.ts
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Agent Deep-Dive & Live Cycle Simulator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Agent Inspector Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {selectedAgent.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedAgent.title}
                  </h4>
                  <span className="font-mono text-xs text-brand-600 dark:text-brand-400">
                    {selectedAgent.file}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {selectedAgent.role}
            </p>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-brand-500" />
                  Structured Inputs:
                </span>
                <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                  {selectedAgent.inputs.map((inp, idx) => (
                    <li key={idx} className="truncate">• {inp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Structured Outputs:
                </span>
                <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                  {selectedAgent.outputs.map((out, idx) => (
                    <li key={idx} className="truncate">• {out}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Continuous Adaptive Cycle Demonstration */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCw className={`w-4 h-4 text-brand-400 ${isCycleSimulating ? 'animate-spin' : ''}`} />
                <h4 className="font-bold text-sm text-white">Live Adaptive Cycle Simulation</h4>
              </div>
              <button
                onClick={simulateCycle}
                disabled={isCycleSimulating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Play className="w-3 h-3" />
                {isCycleSimulating ? 'Running Cycle...' : 'Simulate Loop'}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Watch the multi-agent feedback loop dynamically react when a student takes a quiz.
            </p>

            <div className="space-y-2">
              {ADAPTIVE_CYCLE_STEPS.map((step) => {
                const isActive = activeCycleStep === step.num;
                return (
                  <div
                    key={step.num}
                    className={`p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-brand-950/80 border-brand-500/80 text-white font-medium shadow-sm'
                        : 'bg-slate-800/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isActive ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {step.num}
                    </span>
                    <div>
                      <span className={`font-semibold ${isActive ? 'text-brand-300' : 'text-slate-300'}`}>
                        {step.agent}:
                      </span>{' '}
                      {step.action}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
