import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { studyPlannerAgent } from '../../agents/studyPlannerAgent';
import { profilingAgent } from '../../agents/profilingAgent';
import { performanceAgent } from '../../agents/performanceAgent';
import { StudyPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getStudyPlan, saveStudyPlan } from '../../services/firebase/dataService';

export const StudyPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const currentStudentId = user?.id || 'usr-student-01';

  const [plan, setPlan] = useState<StudyPlan>(studyPlannerAgent.getStudyPlan());
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    async function load() {
      try {
        const remotePlan = await getStudyPlan(uid);
        if (remotePlan) setPlan(remotePlan);
      } catch (err) {
        console.warn('Failed to load study plan from Firestore:', err);
      }
    }
    load();
  }, [user?.id]);

  const handleToggleTask = async (taskId: string) => {
    const updated = studyPlannerAgent.toggleTaskStatus(taskId);
    setPlan({ ...updated });
    if (user?.id) {
      try {
        await saveStudyPlan(user.id, updated);
      } catch (e) {
        console.warn('Error syncing task toggle to Firestore:', e);
      }
    }
  };

  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    try {
      const output = await studyPlannerAgent.execute({
        agentType: 'studyPlanner',
        action: 'adaptStudyPlan',
        studentId: currentStudentId,
        payload: {
          studentId: currentStudentId,
          profile: profilingAgent.getProfile(),
          performance: performanceAgent.getData(),
          availableHours: 2.5,
        },
      });
      setPlan({ ...output.data });
      if (user?.id) {
        await saveStudyPlan(user.id, output.data);
      }
    } catch (e) {
      console.warn('Error saving adapted plan to Firestore:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const filteredTasks = plan.tasks.filter((t) => {
    if (filterPriority === 'all') return true;
    return t.priority === filterPriority;
  });

  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const totalMinutes = plan.tasks.reduce((sum, t) => sum + t.durationMinutes, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Adaptive Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic calendar schedules recalibrated by AI Study Planner Agent
          </p>
        </div>

        <button
          onClick={handleRegeneratePlan}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Adapting Schedule...' : 'Regenerate Plan with AI'}</span>
        </button>
      </div>

      {/* Adaptive Notice Card */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Continuous Adaptive Logic:</strong>
          {plan.adaptabilityNote}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Scheduled Duration</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {Math.round(totalMinutes / 60 * 10) / 10} Hours ({totalMinutes} mins)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Tasks Completed Today</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {completedCount} of {plan.tasks.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Priority Exam Targets</div>
          <div className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1 truncate">
            {plan.priorityTopics.slice(0, 2).join(', ')}
          </div>
        </div>
      </div>

      {/* Filter and Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-brand-600" />
            Active Tasks for Today
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div
                      className={`text-sm font-bold ${
                        isDone
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {task.subjectName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{task.scheduledDate}</span>
                    </div>

                    {task.adaptiveReason && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{task.adaptiveReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
