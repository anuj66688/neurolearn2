// ==========================================
// 7. Progress Monitoring Agent
// Purpose: Continuous telemetry tracking of study time, streaks, accuracy trends and milestone insights
// File: src/agents/progressAgent.ts
// ==========================================

import {
  AgentInput,
  AgentOutput,
  LearningProgress,
  QuizResult,
  StudyTask,
} from '../types';
import { demoLearningProgress } from '../data/demoData';

export interface ProgressInputPayload {
  studentId: string;
  loggedStudyMinutes?: number;
  completedTask?: StudyTask;
  newQuizResult?: QuizResult;
}

export class ProgressAgent {
  public readonly agentType = 'progress';
  private progressData: LearningProgress = { ...demoLearningProgress };

  public async execute(
    input: AgentInput<ProgressInputPayload>
  ): Promise<AgentOutput<LearningProgress>> {
    const startTime = performance.now();
    const payload = input.payload;
    const progress = { ...this.progressData };

    // 1. Log study duration
    if (payload.loggedStudyMinutes) {
      progress.totalStudyHours = parseFloat(
        (progress.totalStudyHours + payload.loggedStudyMinutes / 60).toFixed(1)
      );
    }

    // 2. Completed task
    if (payload.completedTask) {
      progress.completedTopicsCount = Math.min(
        progress.completedTopicsCount + 1,
        progress.totalTopicsCount
      );
      progress.completionPercentage = Math.round(
        (progress.completedTopicsCount / progress.totalTopicsCount) * 100
      );
    }

    // 3. Quiz telemetry
    if (payload.newQuizResult) {
      progress.quizzesTaken += 1;
      progress.overallAccuracy = Math.round(
        (progress.overallAccuracy * 0.8) + (payload.newQuizResult.accuracy * 0.2)
      );

      // Generate actionable pedagogical insight
      if (payload.newQuizResult.score < 60) {
        progress.insights.unshift(
          `Alert: Accuracy in ${payload.newQuizResult.topicId} requires attention. Adaptive recommendations refreshed.`
        );
      } else {
        progress.insights.unshift(
          `Great progress! High performance achieved on ${payload.newQuizResult.topicId} assessment.`
        );
      }
    }

    progress.lastUpdated = new Date().toISOString();
    this.progressData = progress;

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'progress',
      success: true,
      data: progress,
      message: `Progress monitored: ${progress.completionPercentage}% overall completion, ${progress.studyStreakDays}-day study streak.`,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: ['profiling'],
    };
  }

  public getProgress(): LearningProgress {
    return this.progressData;
  }
}

export const progressAgent = new ProgressAgent();
