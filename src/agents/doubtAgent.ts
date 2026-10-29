// ==========================================
// 6. Doubt-Solving Agent
// Purpose: AI academic assistant that clarifies doubts, breaks down complex topics, and explains mistakes
// File: src/agents/doubtAgent.ts
// ==========================================

import { AgentInput, AgentOutput, ChatMessage } from '../types';
import { aiService } from '../services/ai/aiService';

export interface DoubtQueryPayload {
  question: string;
  studentId: string;
  studentLevel?: string;
  chatHistory?: ChatMessage[];
}

export class DoubtAgent {
  public readonly agentType = 'doubt';
  private messageHistory: ChatMessage[] = [
    {
      id: 'welcome-msg',
      sender: 'agent',
      agentName: 'Doubt-Solving Agent',
      content: `Hello! I am your **NeuroLearn Academic Assistant**. 

I can help explain computer science concepts, trace code step-by-step, review exam questions, or diagnose mistakes.

Try asking:
- *"Explain OSI model"*
- *"Explain recursion with an example"*
- *"Why does TCP use a three-way handshake?"*
- *"Explain CIDR subnetting for beginner"*`,
      timestamp: '10:00 AM',
      suggestedFollowUps: [
        'Explain OSI model',
        'Explain recursion with an example',
        'Why does TCP use a three-way handshake?',
      ],
    },
  ];

  public async execute(
    input: AgentInput<DoubtQueryPayload>
  ): Promise<AgentOutput<ChatMessage>> {
    const startTime = performance.now();
    const { question, chatHistory = this.messageHistory } = input.payload;

    // Record student message
    const studentMsg: ChatMessage = {
      id: `msg-student-${Date.now()}`,
      sender: 'student',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.messageHistory.push(studentMsg);

    // Call AI Service abstraction
    const aiResponse = await aiService.answerStudentQuestion(question, chatHistory);
    const agentMsg = aiResponse.data;
    this.messageHistory.push(agentMsg);

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      agentType: 'doubt',
      success: true,
      data: agentMsg,
      message: 'Pedagogical explanation synthesized for student inquiry.',
      executionTimeMs,
      timestamp: new Date().toISOString(),
      nextRecommendedAgents: agentMsg.relatedTopic ? ['recommendation'] : undefined,
    };
  }

  public getHistory(): ChatMessage[] {
    return this.messageHistory;
  }

  public clearHistory(): void {
    this.messageHistory = [this.messageHistory[0]];
  }
}

export const doubtAgent = new DoubtAgent();
