// ==========================================
// 1. Student Profiling Agent
// Purpose: Create and maintain learner profile, preferences, strengths, weaknesses & goals
// File: src/agents/profilingAgent.ts
// ==========================================

import {
  AgentInput,
  AgentOutput,
  StudentProfile,
  QuizResult,
} from '../types';
import { demoStudentProfile } from '../data/demoData';

export interface ProfilingInputPayload {
  studentId: string;
  updatedPreferences?: Partial<StudentProfile['preferences']>;
  newQuizResult?: QuizResult;
  addedGoal?: string;
  activityDeltaMinutes?: number;
}

export class ProfilingAgent {
  public readonly agentType = 'profiling';
  private currentProfile: StudentProfile = { ...demoStudentProfile };

  /**
   * Run the Profiling Agent on student input or after an assessment
   */
  public async execute(
    input: AgentInput<ProfilingInputPayload>
  ): Promise<AgentOutput<StudentProfile>> {
    const startTime = performance.now();
    const payload = input.payload;

    // Clone current profile
    const profile = { ...this.currentProfile };

    // 1. Update preferences if supplied
    if (payload.updatedPreferences) {
      profile.preferences = {
        ...profile.preferences,
        ...payload.updatedPreferences,
      };
    }

    // 2. Incorporate new learning goals
    if (payload.addedGoal && !profile.learningGoals.includes(payload.addedGoal)) {
      profile.learningGoals.push(payload.addedGoal);
    }

    // 3. Update hours if activity logged
    if (payload.activityDeltaMinutes) {
      profile.totalStudyHours = parseFloat(
        (profile.totalStudyHours + payload.activityDeltaMinutes / 60).toFixed(1)
      );
    }

    // 4. Adapt strengths and weaknesses from latest quiz result
    if (payload.newQuizResult) {
      const result = payload.newQuizResult;
      if (result.score >= 80) {
        if (!profile.strengths.includes(result.topicId)) {
          profile.strengths.push(result.topicId);
        }
        profile.weaknesses = profile.weaknesses.filter((w) => w !== result.topicId);
      } else if (result.score < 60) {
        if (!profile.weaknesses.includes(result.topicId)) {
          profile.weaknesses.push(result.topicId);
        }
        profile.strengths = profile.strengths.filter((s) => s !== result.topicId);
      }
    }

    profile.updatedAt = new Date().toISOString();
    this.currentProfile = profile;

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'profiling',
      success: true,
      data: profile,
      message: 'Student profile updated successfully with latest activity & preferences.',
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: ['performance', 'recommendation'],
    };
  }

  public getProfile(): StudentProfile {
    return this.currentProfile;
  }
}

export const profilingAgent = new ProfilingAgent();
