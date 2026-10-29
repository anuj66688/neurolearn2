// ==========================================
// 2. Performance Analysis Agent
// Purpose: Analyze academic performance, diagnostic trends, strengths & weak topics
// File: src/agents/performanceAgent.ts
// ==========================================

import {
  AgentInput,
  AgentOutput,
  PerformanceData,
  QuizResult,
  TopicPerformance,
} from '../types';
import { demoPerformanceData } from '../data/demoData';

export interface PerformanceInputPayload {
  studentId: string;
  newQuizResult?: QuizResult;
}

export class PerformanceAgent {
  public readonly agentType = 'performance';
  private performanceData: PerformanceData = { ...demoPerformanceData };

  public async execute(
    input: AgentInput<PerformanceInputPayload>
  ): Promise<AgentOutput<PerformanceData>> {
    const startTime = performance.now();
    const { newQuizResult } = input.payload;

    const data = { ...this.performanceData };

    if (newQuizResult) {
      data.quizzesCompleted += 1;

      // Update topic breakdown
      const topicKey = newQuizResult.topicId;
      const currentTopic = data.topicBreakdown[topicKey] || {
        topicId: newQuizResult.topicId,
        topicName: newQuizResult.topicId,
        subjectId: newQuizResult.subjectId,
        subjectName: newQuizResult.subjectId,
        quizzesTaken: 0,
        averageScore: 0,
        masteryLevel: 0,
        status: 'developing' as const,
        lastAssessedAt: new Date().toISOString(),
        trend: 'stable' as const,
      };

      const prevTotal = currentTopic.averageScore * currentTopic.quizzesTaken;
      const newQuizzesTaken = currentTopic.quizzesTaken + 1;
      const newAvg = Math.round((prevTotal + newQuizResult.score) / newQuizzesTaken);

      const status: TopicPerformance['status'] =
        newAvg >= 85
          ? 'mastered'
          : newAvg >= 70
          ? 'proficient'
          : newAvg >= 50
          ? 'developing'
          : 'struggling';

      const updatedTopic: TopicPerformance = {
        ...currentTopic,
        quizzesTaken: newQuizzesTaken,
        averageScore: newAvg,
        masteryLevel: newAvg,
        status,
        lastAssessedAt: new Date().toISOString(),
        trend: newQuizResult.score >= currentTopic.averageScore ? 'improving' : 'declining',
      };

      data.topicBreakdown[topicKey] = updatedTopic;

      // Update overall accuracy & score
      data.overallScore = Math.round((data.overallScore * 0.7) + (newQuizResult.score * 0.3));
      data.accuracy = Math.round((data.accuracy * 0.7) + (newQuizResult.accuracy * 0.3));

      // Append recent scores
      data.recentScores.push({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: newQuizResult.score,
        topic: newQuizResult.topicId,
      });

      // Update strengths/weaknesses dynamically
      if (newQuizResult.score < 60) {
        if (!data.weaknesses.includes(newQuizResult.topicId)) {
          data.weaknesses.push(newQuizResult.topicId);
        }
        data.strengths = data.strengths.filter((s) => s !== newQuizResult.topicId);
      } else if (newQuizResult.score >= 80) {
        if (!data.strengths.includes(newQuizResult.topicId)) {
          data.strengths.push(newQuizResult.topicId);
        }
        data.weaknesses = data.weaknesses.filter((w) => w !== newQuizResult.topicId);
      }
    }

    data.lastAnalyzedAt = new Date().toISOString();
    this.performanceData = data;

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'performance',
      success: true,
      data,
      message: `Performance diagnostics completed. ${data.weaknesses.length} weak topics identified for adaptive intervention.`,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: ['recommendation', 'studyPlanner'],
    };
  }

  public getData(): PerformanceData {
    return this.performanceData;
  }
}

export const performanceAgent = new PerformanceAgent();
