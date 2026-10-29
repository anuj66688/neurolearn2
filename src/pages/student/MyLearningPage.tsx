import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { demoSubjects } from '../../data/demoData';
import { Subject, Topic } from '../../types';
import { Link } from 'react-router-dom';
import { getSubjects } from '../../services/firebase/dataService';

export const MyLearningPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(demoSubjects);
  const [selectedSubject, setSelectedSubject] = useState<Subject>(demoSubjects[0]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(demoSubjects[0].topics[0]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const remote = await getSubjects();
        if (remote && remote.length > 0) {
          setSubjects(remote);
          setSelectedSubject(remote[0]);
          setSelectedTopic(remote[0].topics[0]);
        }
      } catch (err) {
        console.warn('Could not load subjects from Firestore:', err);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Learning Paths
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hierarchical curriculum navigation with automated next-topic recommendation
          </p>
        </div>

        {/* AI Next Recommended Topic Pill */}
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-brand-700 dark:text-brand-300 block">
              AI Next Priority: {selectedSubject?.topics[0]?.name || 'Core Foundations'}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {selectedSubject?.name} • Next Adaptive Objective
            </span>
          </div>
          <Link
            to="/student/quizzes"
            className="ml-auto px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs whitespace-nowrap"
          >
            Start Quiz
          </Link>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubject.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub);
                setSelectedTopic(sub.topics[0]);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {sub.overallMastery}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Topics Hierarchy & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics Breakdown List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Curriculum Topics ({selectedSubject.topics.length})
          </div>

          <div className="space-y-2">
            {selectedSubject.topics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500/60 shadow-sm ring-1 ring-brand-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {topic.name}
                        {topic.isRecommendedNext && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {topic.masteryLevel}%
                    </span>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topic.masteryLevel >= 80
                          ? 'bg-emerald-500'
                          : topic.masteryLevel >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${topic.masteryLevel}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Topic Deep Dive & Subtopics */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 uppercase tracking-wider font-semibold">
                  {selectedSubject.name} • {selectedTopic.difficulty.toUpperCase()}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedTopic.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {selectedTopic.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {selectedTopic.masteryLevel}%
                </div>
                <span className="text-xs text-slate-400">Mastery Score</span>
              </div>
            </div>

            {/* Subtopics Checklist */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Subtopic Milestones
              </h3>

              <div className="space-y-2">
                {selectedTopic.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {subtopic.isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          subtopic.isCompleted
                            ? 'text-slate-900 dark:text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {subtopic.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {subtopic.masteryPercentage}%
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          subtopic.isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {subtopic.isCompleted ? 'Mastered' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar for this topic */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <Link
                to="/student/quizzes"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <span>Take Topic Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student/assistant"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all"
              >
                <span>Explain with AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
