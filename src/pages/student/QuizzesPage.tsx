import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { demoQuizzes } from '../../data/demoData';
import { Quiz, QuizResult, QuestionAnswerRecord } from '../../types';
import { orchestrator } from '../../agents/orchestrator';
import { useAuth } from '../../context/AuthContext';
import { getAllQuizzes } from '../../services/firebase/dataService';

export const QuizzesPage: React.FC = () => {
  const { user } = useAuth();
  const currentStudentId = user?.id || 'usr-student-01';

  const [quizzes, setQuizzes] = useState<Quiz[]>(demoQuizzes);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(demoQuizzes[0].id);
  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0] || demoQuizzes[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (activeQuiz.timeLimitMinutes || 10) * 60
  );

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const remote = await getAllQuizzes();
        if (remote && remote.length > 0) {
          setQuizzes(remote);
          setSelectedQuizId(remote[0].id);
        }
      } catch (err) {
        console.warn('Using fallback quizzes:', err);
      }
    }
    fetchQuizzes();
  }, []);

  const switchQuiz = (id: string) => {
    const q = quizzes.find((item) => item.id === id);
    if (q) {
      setSelectedQuizId(id);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
      setCurrentQuestionIndex(0);
      setSecondsRemaining((q.timeLimitMinutes || 10) * 60);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (quizSubmitted || isSubmitting) return;
    setIsSubmitting(true);

    const questions = activeQuiz.questions;
    const answerRecords: QuestionAnswerRecord[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1;
      const isCorrect = selected === q.correctOptionIndex;
      return {
        questionId: q.id,
        selectedOptionIndex: selected,
        isCorrect,
        timeSpentSeconds: 30,
      };
    });

    try {
      // Trigger the complete multi-agent adaptive cycle with real authenticated UID!
      await orchestrator.runPostAssessmentCycle(
        activeQuiz.id,
        currentStudentId,
        activeQuiz.subjectId,
        activeQuiz.topicName,
        answerRecords
      );

      const correctCount = answerRecords.filter((a) => a.isCorrect).length;
      const accuracy = Math.round((correctCount / answerRecords.length) * 100);

      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: activeQuiz.id,
        studentId: currentStudentId,
        subjectId: activeQuiz.subjectId,
        topicId: activeQuiz.topicName,
        score: accuracy,
        correctCount,
        totalQuestions: answerRecords.length,
        accuracy,
        answers: answerRecords,
        strongTopicsIdentified: accuracy >= 70 ? [activeQuiz.topicName] : [],
        weakTopicsIdentified: accuracy < 70 ? [activeQuiz.topicName] : [],
        aiAnalysisSummary:
          accuracy >= 70
            ? 'Commendable performance! You demonstrated sound conceptual grasp of subnet calculation boundaries.'
            : 'Deficit identified in IP host boundary calculations. Recommendation and Study Planner agents have refreshed your curriculum.',
        recommendedAction:
          accuracy >= 70
            ? 'Proceed to Routing Protocols'
            : 'Review CIDR Step-by-Step guide and complete 2 targeted practice sets',
        completedAt: new Date().toISOString(),
      };

      setQuizResult(result);
      setQuizSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeQuiz, isSubmitting, quizSubmitted, selectedAnswers]);

  // Timer countdown
  useEffect(() => {
    if (quizSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizSubmitted, handleSubmitQuiz]);

  const handleSelectOption = (optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setSecondsRemaining(activeQuiz.timeLimitMinutes * 60);
  };

  const currentQ = activeQuiz.questions[currentQuestionIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            {activeQuiz.subjectName} • {activeQuiz.difficulty.toUpperCase()}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {activeQuiz.title}
          </h1>
        </div>

        {/* Timer */}
        {!quizSubmitted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm shrink-0">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Available Quizzes Switcher */}
      {quizzes.length > 1 && !quizSubmitted && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0">Available Quizzes:</span>
          {quizzes.map((q) => (
            <button
              key={q.id}
              onClick={() => switchQuiz(q.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                q.id === activeQuiz.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500'
              }`}
            >
              {q.subjectName}: {q.topicName || q.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Assessment Container */}
      {!quizSubmitted ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Question Stepper */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span>
              Question <strong className="text-slate-900 dark:text-white">{currentQuestionIndex + 1}</strong> of{' '}
              {activeQuiz.questions.length}
            </span>
            <span>
              Answered: {Object.keys(selectedAnswers).length} / {activeQuiz.questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-100 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(activeQuiz.questions.length - 1, prev + 1)
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/30"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Orchestrating Agents...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Run Multi-Agent Loop</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assessment Complete
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Evaluation & Diagnostics
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                    {quizResult?.score}%
                  </div>
                  <div className="text-xs text-slate-400">
                    {quizResult?.correctCount} / {quizResult?.totalQuestions} Correct
                  </div>
                </div>
                <button
                  onClick={handleRetakeQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            </div>

            {/* AI Multi-Agent Analysis Notification */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
              <div className="font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" />
                Adaptive Agent Orchestration Triggered
              </div>
              <p>{quizResult?.aiAnalysisSummary}</p>
              <div className="font-semibold text-brand-700 dark:text-brand-300">
                Next Recommended Step: {quizResult?.recommendedAction}
              </div>
            </div>

            {/* Question by Question Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Answer Explanations
              </h3>

              {activeQuiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctOptionIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>

                    <div className="text-slate-600 dark:text-slate-300">
                      Your answer: <strong>{userAns !== undefined ? q.options[userAns] : 'Not answered'}</strong>
                    </div>

                    {!isCorrect && (
                      <div className="text-emerald-700 dark:text-emerald-400">
                        Correct answer: <strong>{q.options[q.correctOptionIndex]}</strong>
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 italic">
                      💡 {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
