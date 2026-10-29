// ==========================================
// 3. Content Recommendation Agent
// Purpose: Recommend targeted learning resources based on weak topics, student learning style, and goals
// File: src/agents/recommendationAgent.ts
// ==========================================

import {
  AgentInput,
  AgentOutput,
  Recommendation,
  StudentProfile,
  PerformanceData,
  ResourceType,
} from '../types';
import { demoRecommendations } from '../data/demoData';

export interface RecommendationInputPayload {
  studentId: string;
  profile: StudentProfile;
  performance: PerformanceData;
  triggerContext?: string;
}

export class RecommendationAgent {
  public readonly agentType = 'recommendation';
  private recommendations: Recommendation[] = [...demoRecommendations];

  public async execute(
    input: AgentInput<RecommendationInputPayload>
  ): Promise<AgentOutput<Recommendation[]>> {
    const startTime = performance.now();
    const { profile, performance: perf } = input.payload;

    const newRecommendations: Recommendation[] = [];

    // Analyze weak topics from performance data
    for (const weakTopic of perf.weaknesses) {
      // Determine best resource type based on student learning preference
      let preferredType: ResourceType = 'ai_explanation';
      if (profile.preferences.visual > 40) {
        preferredType = 'video';
      } else if (profile.preferences.practical > 40) {
        preferredType = 'practice_problem';
      }

      newRecommendations.push({
        id: `rec-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        studentId: profile.id,
        subjectId: 'sub-cn',
        subjectName: 'Computer Networks',
        topicId: weakTopic,
        topicName: weakTopic,
        resourceType: preferredType,
        title: `Targeted Mastery: ${weakTopic}`,
        description: `NeuroLearn detected accuracy below 60% in ${weakTopic}. Customized ${preferredType.replace('_', ' ')} recommended to bridge conceptual gaps.`,
        durationMinutes: preferredType === 'practice_problem' ? 25 : 15,
        priority: 'urgent',
        triggerReason: `Identified weak topic by Performance Agent`,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Merge with existing recommendations, prioritizing urgent ones
    const combined = [...newRecommendations, ...this.recommendations].slice(0, 8);
    this.recommendations = combined;

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'recommendation',
      success: true,
      data: combined,
      message: `Generated ${newRecommendations.length} personalized recommendations tailored to learner preferences.`,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: ['studyPlanner'],
    };
  }

  public getRecommendations(): Recommendation[] {
    return this.recommendations;
  }
}

export const recommendationAgent = new RecommendationAgent();
