import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PlayCircle,
  FileText,
  Code,
  ExternalLink,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { recommendationAgent } from '../../agents/recommendationAgent';
import { ResourceType, Recommendation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getRecommendations } from '../../services/firebase/dataService';

export const RecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    recommendationAgent.getRecommendations()
  );

  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    async function load() {
      try {
        const remoteRecs = await getRecommendations(uid);
        if (remoteRecs && remoteRecs.length > 0) {
          setRecommendations(remoteRecs);
        }
      } catch (err) {
        console.warn('Failed to load recommendations from Firestore:', err);
      }
    }
    load();
  }, [user?.id]);

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-purple-500" />;
      case 'practice_problem':
        return <Code className="w-5 h-5 text-emerald-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'ai_explanation':
      default:
        return <Sparkles className="w-5 h-5 text-pink-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Recommendations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Synthesized by Content Recommendation Agent to close knowledge gaps and accelerate mastery
        </p>
      </div>

      {/* Rationale Banner */}
      <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 text-pink-950 dark:text-pink-200 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Recommendation Algorithm Logic:</strong>
          Materials are curated based on your recent quiz errors in Subnetting, paired with your preferred learning style (45% visual, 40% practical).
        </div>
      </div>

      {/* Grid of Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-pink-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {getResourceIcon(rec.resourceType)}
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    rec.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : rec.priority === 'high'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 capitalize">
                  {rec.resourceType.replace('_', ' ')} • {rec.subjectName}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  {rec.title}
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Trigger: {rec.triggerReason}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" /> {rec.durationMinutes} mins
              </span>

              <button className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all">
                <span>Start Review</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
