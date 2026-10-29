// ==========================================
// NeuroLearn Multi-Agent Orchestrator
// Coordinates the 7 specialized agents through structured inputs/outputs
// File: src/agents/orchestrator.ts
// ==========================================

import {
  OrchestratorWorkflowStep,
  OrchestrationCycleResult,
  QuizResult,
  QuestionAnswerRecord,
} from '../types';

import { profilingAgent } from './profilingAgent';
import { performanceAgent } from './performanceAgent';
import { recommendationAgent } from './recommendationAgent';
import { studyPlannerAgent } from './studyPlannerAgent';
import { quizAgent } from './quizAgent';
import { doubtAgent } from './doubtAgent';
import { progressAgent } from './progressAgent';
import {
  saveQuizResult,
  savePerformanceData,
  saveRecommendations,
  saveStudyPlan,
  saveLearningProgress,
  saveStudentProfile,
} from '../services/firebase/dataService';

export type OrchestratorListener = (step: OrchestratorWorkflowStep) => void;

export class AgentOrchestrator {
  private listeners: OrchestratorListener[] = [];
  private lastCycleResult: OrchestrationCycleResult | null = null;
  private isExecuting: boolean = false;

  public subscribe(listener: OrchestratorListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyStep(step: OrchestratorWorkflowStep) {
    this.listeners.forEach((listener) => listener(step));
  }

  public isBusy(): boolean {
    return this.isExecuting;
  }

  public getLastCycleResult(): OrchestrationCycleResult | null {
    return this.lastCycleResult;
  }

  /**
   * Complete Adaptive Cycle:
   * 1. Quiz Agent evaluates quiz
   * 2. Performance Agent analyzes result & flags weaknesses
   * 3. Recommendation Agent curates targeted resources
   * 4. Study Planner Agent reschedules timetable prioritizing weak topics
   * 5. Progress Agent updates telemetry, hours & accuracy
   * 6. Profiling Agent updates learner knowledge profile
   */
  public async runPostAssessmentCycle(
    quizId: string,
    studentId: string,
    subjectId: string,
    topicId: string,
    answers: QuestionAnswerRecord[]
  ): Promise<OrchestrationCycleResult> {
    this.isExecuting = true;
    const cycleId = `cycle-${Date.now()}`;
    const workflow: OrchestratorWorkflowStep[] = [];

    try {
      // STEP 1: Quiz Agent Evaluation
      const step1: OrchestratorWorkflowStep = {
        stepNumber: 1,
        agent: 'quiz',
        action: 'evaluateQuiz',
        inputSummary: `Evaluating ${answers.length} answers for Quiz: ${quizId}`,
        outputSummary: 'Evaluating...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step1);

      const quizOutput = await quizAgent.evaluateQuiz({
        agentType: 'quiz',
        action: 'evaluateQuiz',
        studentId,
        payload: { quizId, studentId, subjectId, topicId, answers },
      });
      const quizResult: QuizResult = quizOutput.data;

      step1.outputSummary = `Score: ${quizResult.score}%, Accuracy: ${quizResult.accuracy}% (${quizResult.correctCount}/${quizResult.totalQuestions} correct)`;
      step1.status = 'completed';
      workflow.push({ ...step1 });
      this.notifyStep(step1);

      // STEP 2: Performance Analysis Agent
      const step2: OrchestratorWorkflowStep = {
        stepNumber: 2,
        agent: 'performance',
        action: 'analyzePerformance',
        inputSummary: `Analyzing diagnostic score for ${topicId}`,
        outputSummary: 'Analyzing trends & mastery...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step2);

      const perfOutput = await performanceAgent.execute({
        agentType: 'performance',
        action: 'analyzePerformance',
        studentId,
        payload: { studentId, newQuizResult: quizResult },
      });

      step2.outputSummary = `Updated overall score: ${perfOutput.data.overallScore}%. Weak topics: [${perfOutput.data.weaknesses.join(', ')}]`;
      step2.status = 'completed';
      workflow.push({ ...step2 });
      this.notifyStep(step2);

      // STEP 3: Content Recommendation Agent
      const step3: OrchestratorWorkflowStep = {
        stepNumber: 3,
        agent: 'recommendation',
        action: 'generateRecommendations',
        inputSummary: `Generating resources for weak topics: ${perfOutput.data.weaknesses.join(', ')}`,
        outputSummary: 'Curating materials aligned with student learning style...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step3);

      const recOutput = await recommendationAgent.execute({
        agentType: 'recommendation',
        action: 'generateRecommendations',
        studentId,
        payload: {
          studentId,
          profile: profilingAgent.getProfile(),
          performance: perfOutput.data,
        },
      });

      step3.outputSummary = `Curated ${recOutput.data.length} priority interventions tailored to visual/practical preference`;
      step3.status = 'completed';
      workflow.push({ ...step3 });
      this.notifyStep(step3);

      // STEP 4: Study Planner Agent
      const step4: OrchestratorWorkflowStep = {
        stepNumber: 4,
        agent: 'studyPlanner',
        action: 'adaptStudyPlan',
        inputSummary: 'Escalating priority & study duration for struggling topics',
        outputSummary: 'Recalculating calendar slots...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step4);

      const planOutput = await studyPlannerAgent.execute({
        agentType: 'studyPlanner',
        action: 'adaptStudyPlan',
        studentId,
        payload: {
          studentId,
          profile: profilingAgent.getProfile(),
          performance: perfOutput.data,
        },
      });

      step4.outputSummary = `Timetable adapted: ${planOutput.data.tasks.length} active tasks scheduled with priority escalation`;
      step4.status = 'completed';
      workflow.push({ ...step4 });
      this.notifyStep(step4);

      // STEP 5: Progress Monitoring Agent
      const step5: OrchestratorWorkflowStep = {
        stepNumber: 5,
        agent: 'progress',
        action: 'logAssessmentProgress',
        inputSummary: 'Recording telemetry, streak metrics, and accuracy benchmarks',
        outputSummary: 'Updating student progress ledger...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step5);

      const progOutput = await progressAgent.execute({
        agentType: 'progress',
        action: 'logAssessmentProgress',
        studentId,
        payload: {
          studentId,
          newQuizResult: quizResult,
        },
      });

      step5.outputSummary = `Logged quiz #${progOutput.data.quizzesTaken}. Streak: ${progOutput.data.studyStreakDays} days, Accuracy: ${progOutput.data.overallAccuracy}%`;
      step5.status = 'completed';
      workflow.push({ ...step5 });
      this.notifyStep(step5);

      // STEP 6: Student Profiling Agent
      const step6: OrchestratorWorkflowStep = {
        stepNumber: 6,
        agent: 'profiling',
        action: 'updateLearnerProfile',
        inputSummary: 'Syncing cognitive strengths, deficits, and mastery index',
        outputSummary: 'Updating student knowledge state...',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
      };
      this.notifyStep(step6);

      const profOutput = await profilingAgent.execute({
        agentType: 'profiling',
        action: 'updateLearnerProfile',
        studentId,
        payload: {
          studentId,
          newQuizResult: quizResult,
        },
      });

      step6.outputSummary = `Profile updated. Strengths: [${profOutput.data.strengths.slice(0, 2).join(', ')}], Weaknesses: [${profOutput.data.weaknesses.slice(0, 2).join(', ')}]`;
      step6.status = 'completed';
      workflow.push({ ...step6 });
      this.notifyStep(step6);

      // Persist all agent outputs to Firebase Firestore
      try {
        await Promise.all([
          saveQuizResult(quizResult),
          savePerformanceData(studentId, perfOutput.data),
          saveRecommendations(studentId, recOutput.data),
          saveStudyPlan(studentId, planOutput.data),
          saveLearningProgress(studentId, progOutput.data),
          saveStudentProfile(studentId, profOutput.data),
        ]);
        console.log(`✅ [Orchestrator] Saved multi-agent results to Firestore for student: ${studentId}`);
      } catch (err) {
        console.warn('⚠️ [Orchestrator] Firestore save warning:', err);
      }

      const result: OrchestrationCycleResult = {
        cycleId,
        triggerEvent: `Quiz Completed: ${topicId} (Score: ${quizResult.score}%)`,
        studentId,
        workflow,
        completedAt: new Date().toISOString(),
      };

      this.lastCycleResult = result;
      return result;
    } finally {
      this.isExecuting = false;
    }
  }

  // Access individual specialized agents directly
  public get profiling() {
    return profilingAgent;
  }
  public get performance() {
    return performanceAgent;
  }
  public get recommendation() {
    return recommendationAgent;
  }
  public get studyPlanner() {
    return studyPlannerAgent;
  }
  public get quiz() {
    return quizAgent;
  }
  public get doubt() {
    return doubtAgent;
  }
  public get progress() {
    return progressAgent;
  }
}

export const orchestrator = new AgentOrchestrator();
