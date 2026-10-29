// ==========================================
// NeuroLearn System Core Data Types
// ==========================================

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// 1. Student Profiling Types
export interface LearningPreferences {
  visual: number;        // percentage e.g. 0-100
  practical: number;     // hands-on / coding / problems
  theoretical: number;   // conceptual reading
  pace: 'slow' | 'moderate' | 'fast';
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  gradeLevel: string;
  targetExam?: string;
  enrolledSubjects: string[];
  learningGoals: string[];
  preferences: LearningPreferences;
  strengths: string[];
  weaknesses: string[];
  currentStreak: number;
  totalStudyHours: number;
  overallMastery: number; // percentage
  updatedAt: string;
}

// 2. Performance Analysis Types
export interface TopicPerformance {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  quizzesTaken: number;
  averageScore: number;
  masteryLevel: number; // 0 to 100%
  status: 'mastered' | 'proficient' | 'developing' | 'struggling';
  lastAssessedAt: string;
  trend: 'improving' | 'declining' | 'stable';
}

export interface PerformanceData {
  studentId: string;
  overallScore: number;
  quizzesCompleted: number;
  accuracy: number;
  topicBreakdown: Record<string, TopicPerformance>;
  strengths: string[];
  weaknesses: string[];
  recentScores: { date: string; score: number; topic: string }[];
  improvementRate: number; // percentage change
  lastAnalyzedAt: string;
}

// 3. Quiz & Assessment Types
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  generatedByAgent: boolean;
  createdAt: string;
}

export interface QuestionAnswerRecord {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  subjectId: string;
  topicId: string;
  score: number;             // percentage 0-100
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  answers: QuestionAnswerRecord[];
  strongTopicsIdentified: string[];
  weakTopicsIdentified: string[];
  aiAnalysisSummary: string;
  recommendedAction: string;
  completedAt: string;
}

// 4. Study Planner Types
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  durationMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  scheduledDate: string; // YYYY-MM-DD
  adaptiveReason?: string; // Reason provided by AI Study Planner
}

export interface StudyPlan {
  id: string;
  studentId: string;
  generatedDate: string;
  availableHoursPerDay: number;
  targetExamDate?: string;
  tasks: StudyTask[];
  priorityTopics: string[];
  weeklyGoals: string[];
  adaptabilityNote: string;
}

// 5. Content Recommendation Types
export type ResourceType = 'notes' | 'article' | 'video' | 'practice_problem' | 'ai_explanation';

export interface Recommendation {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  resourceType: ResourceType;
  title: string;
  description: string;
  url?: string;
  durationMinutes: number;
  priority: 'urgent' | 'high' | 'medium';
  triggerReason: string; // e.g. "Low quiz score in Subnetting (40%)"
  isCompleted: boolean;
  createdAt: string;
}

// 6. Doubt-Solving & Chat Types
export interface ChatMessage {
  id: string;
  sender: 'student' | 'agent';
  agentName?: string;
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  suggestedFollowUps?: string[];
  relatedTopic?: string;
}

// 7. Progress Monitoring Types
export interface LearningProgress {
  studentId: string;
  studyStreakDays: number;
  totalStudyHours: number;
  quizzesTaken: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  completionPercentage: number;
  overallAccuracy: number;
  weeklyProgress: {
    week: string;
    hours: number;
    quizzes: number;
    avgScore: number;
  }[];
  insights: string[];
  lastUpdated: string;
}

// 8. Multi-Agent Orchestration Types
export type AgentType =
  | 'profiling'
  | 'performance'
  | 'recommendation'
  | 'studyPlanner'
  | 'quiz'
  | 'doubt'
  | 'progress'
  | 'orchestrator';

export interface AgentInput<T = unknown> {
  agentType: AgentType;
  action: string;
  payload: T;
  studentId: string;
  metadata?: Record<string, unknown>;
}

export interface AgentOutput<T = unknown> {
  agentType: AgentType;
  success: boolean;
  data: T;
  message: string;
  executionTimeMs: number;
  timestamp: string;
  nextRecommendedAgents?: AgentType[];
}

export interface OrchestratorWorkflowStep {
  stepNumber: number;
  agent: AgentType;
  action: string;
  inputSummary: string;
  outputSummary: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  timestamp?: string;
}

export interface OrchestrationCycleResult {
  cycleId: string;
  triggerEvent: string;
  studentId: string;
  workflow: OrchestratorWorkflowStep[];
  completedAt: string;
}

// Subject & Topic Hierarchy
export interface SubTopic {
  id: string;
  name: string;
  masteryPercentage: number;
  isCompleted: boolean;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  subtopics: SubTopic[];
  masteryLevel: number;
  difficulty: Difficulty;
  isRecommendedNext?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  description: string;
  topics: Topic[];
  overallMastery: number;
}
