// ==========================================
// 5. Quiz / Assessment Agent
// Purpose: Assessment generation, automated evaluation, detailed explanations, and performance derivation
// File: src/agents/quizAgent.ts
// ==========================================

import {
  AgentInput,
  AgentOutput,
  Quiz,
  QuizResult,
  Difficulty,
  QuestionAnswerRecord,
} from '../types';
import { demoQuizzes } from '../data/demoData';
import { fallbackQuizBank } from '../services/ai/aiFallback';

export interface QuizGeneratePayload {
  subjectId: string;
  topicId: string;
  difficulty: Difficulty;
  questionCount: number;
}

export interface QuizEvaluatePayload {
  quizId: string;
  studentId: string;
  subjectId: string;
  topicId: string;
  answers: QuestionAnswerRecord[];
}

export class QuizAgent {
  public readonly agentType = 'quiz';
  private currentQuizzes: Quiz[] = [...demoQuizzes];

  /**
   * Generates a new customized assessment
   */
  public async generateQuiz(
    input: AgentInput<QuizGeneratePayload>
  ): Promise<AgentOutput<Quiz>> {
    const startTime = performance.now();
    const { subjectId, topicId, difficulty, questionCount } = input.payload;

    const sourceBank =
      subjectId === 'sub-ds'
        ? fallbackQuizBank['data-structures']
        : fallbackQuizBank['computer-networks'];

    const questions = sourceBank.slice(0, questionCount || 3).map((q, idx) => ({
      ...q,
      id: `q-gen-${Date.now()}-${idx}`,
      difficulty,
    }));

    const newQuiz: Quiz = {
      id: `quiz-gen-${Date.now()}`,
      title: `${topicId.toUpperCase()} Adaptive Assessment`,
      subjectId,
      subjectName: subjectId === 'sub-ds' ? 'Data Structures' : 'Computer Networks',
      topicId,
      topicName: topicId,
      difficulty,
      timeLimitMinutes: Math.max(5, questions.length * 3),
      questions,
      generatedByAgent: true,
      createdAt: new Date().toISOString(),
    };

    this.currentQuizzes.push(newQuiz);

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'quiz',
      success: true,
      data: newQuiz,
      message: `Generated adaptive quiz with ${questions.length} questions at ${difficulty} level.`,
      executionTimeMs,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Evaluates student quiz submission, computes score, accuracy, and identifies strong/weak topics
   */
  public async evaluateQuiz(
    input: AgentInput<QuizEvaluatePayload>
  ): Promise<AgentOutput<QuizResult>> {
    const startTime = performance.now();
    const { quizId, studentId, subjectId, topicId, answers } = input.payload;

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = accuracy;

    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    if (score < 60) {
      weakTopics.push(topicId);
    } else {
      strongTopics.push(topicId);
    }

    const evaluation: QuizResult = {
      id: `result-${Date.now()}`,
      quizId,
      studentId,
      subjectId,
      topicId,
      score,
      correctCount,
      totalQuestions,
      accuracy,
      answers,
      strongTopicsIdentified: strongTopics,
      weakTopicsIdentified: weakTopics,
      aiAnalysisSummary:
        score >= 80
          ? `Outstanding comprehension demonstrated on ${topicId}. Ready to proceed to next progressive topic.`
          : `Conceptual gap detected in ${topicId}. Recommend reviewing core foundations and targeted problem-solving.`,
      recommendedAction:
        score >= 80
          ? 'Advance to Next Subtopic in Learning Path'
          : 'Trigger Adaptive Study Plan & Review Content Recommendations',
      completedAt: new Date().toISOString(),
    };

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'quiz',
      success: true,
      data: evaluation,
      message: `Evaluation completed: Score ${score}% (${correctCount}/${totalQuestions} correct).`,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: ['performance', 'recommendation', 'studyPlanner'],
    };
  }

  public getQuizzes(): Quiz[] {
    return this.currentQuizzes;
  }
}

export const quizAgent = new QuizAgent();
