// src/services/ai/geminiService.ts
import { Difficulty, QuizQuestion, ChatMessage } from '../../types';
import { aiService } from './aiService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Direct call to Google Gemini 3.5 Flash for academic tutoring & doubt solving.
 */
export async function askGemini(
  question: string,
  history: ChatMessage[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  // Format recent conversation context
  const formattedHistory = history
    .filter((m) => m.sender === 'student' || m.sender === 'agent')
    .slice(-4)
    .map((m) => ({
      role: m.sender === 'student' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

  const systemPrompt = `You are the NeuroLearn Academic AI Assistant, an expert computer science tutor for undergraduate engineering students.
Your objective is to provide direct, accurate, highly pedagogical, and encouraging explanations.
Guidelines:
- Answer the student's question directly and authoritatively first.
- Break down complex mechanisms with intuitive step-by-step logic.
- Use clear Markdown headings, bullet points, and code/formulas where helpful.
- End with 1 brief thought-provoking follow-up question to test their understanding.`;

  const payload = {
    contents: [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nStudent Question: ${question}` }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1000,
    },
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

/**
 * Wrapper around the centralized AI service for Gemini-specific operations.
 */
export async function generateQuiz(
  subjectKey: string,
  topicName: string,
  difficulty: Difficulty = 'easy',
  count: number = 3
): Promise<QuizQuestion[]> {
  const resp = await aiService.generateQuiz(subjectKey, topicName, difficulty, count);
  return resp.data;
}

/**
 * Suggest additional study topics based on the student's identified weaknesses.
 */
export async function suggestMoreTopics(weaknesses: string[]): Promise<string[]> {
  if (!weaknesses || weaknesses.length === 0) {
    return ['Data Structures', 'Operating Systems', 'Computer Networks'];
  }
  try {
    const prompt = `Based on a student with weaknesses in: ${weaknesses.join(', ')}. Suggest 3 specific remediation topics in Computer Science. Return ONLY a comma-separated list of 3 topic names.`;
    const res = await askGemini(prompt);
    const topics = res
      .split(/,|\n/)
      .map((t) => t.replace(/^\d+[\.\)]\s*/, '').replace(/[\*\-]/g, '').trim())
      .filter((t) => t.length > 2 && !t.toLowerCase().includes('topic'));
    if (topics.length >= 2) return topics.slice(0, 3);
  } catch {
    // Fall back to provided weaknesses
  }
  return weaknesses;
}
