import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';
import { doubtAgent } from '../../agents/doubtAgent';
import { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AssistantPage: React.FC = () => {
  const { user } = useAuth();
  const currentUid = user?.id || 'usr-student-01';

  const [messages, setMessages] = useState<ChatMessage[]>(doubtAgent.getHistory());
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isTyping) return;

    setInputValue('');
    setIsTyping(true);

    try {
      await doubtAgent.execute({
        agentType: 'doubt',
        action: 'answerQuery',
        studentId: currentUid,
        payload: {
          question: query,
          studentId: currentUid,
        },
      });

      setMessages([...doubtAgent.getHistory()]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    doubtAgent.clearHistory();
    setMessages([...doubtAgent.getHistory()]);
  };

  const SUGGESTED_PROMPTS = [
    'Explain this like a beginner.',
    'Give me an example.',
    'Quiz me on this topic.',
    'Explain my mistake.',
    'Summarize this topic.',
    'Explain OSI model layers',
    'Why does TCP use a 3-way handshake?',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-brand-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              Doubt-Solving Agent
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Academic Assistant & Step-by-Step Concept Tutor
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" /> New Chat
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${isAgent ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                  isAgent ? 'bg-cyan-600' : 'bg-brand-600'
                }`}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAgent
                      ? 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                      : 'bg-brand-600 text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.content}</div>
                </div>

                {/* Follow up quick suggestions */}
                {isAgent && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowUps.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                      >
                        {prompt} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-brand-500" />
            <span>AI Doubt Agent is synthesizing pedagogical explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-500" /> Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything (e.g. 'Explain OSI model with real-world examples')..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
