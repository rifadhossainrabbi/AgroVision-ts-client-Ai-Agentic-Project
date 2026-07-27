'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import axios from 'axios';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm AgroBot 🌾 — ask me about crops, machinery, prices, or how to use AgroVision AI.",
};

const DEFAULT_SUGGESTIONS = [
  'How do I list a product?',
  'Show me available tractors',
  'What crops are trending?',
];

const AiChatAssistant = () => {
  const pathname = usePathname();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextHistory: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/chat', {
        message: trimmed,
        history: nextHistory.map(m => ({ role: m.role, content: m.content })),
        context: {
          page: pathname,
          productTitle: params?.id ? `product ${params.id}` : undefined,
        },
      });

      if (data?.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setSuggestions(data.suggestions || DEFAULT_SUGGESTIONS);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "Sorry, I couldn't process that right now." },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'The assistant is temporarily unavailable. Please try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI Chat Assistant"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-[#16503b] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#16503b] text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">AgroBot Assistant</p>
              <p className="text-[10px] text-white/70 leading-tight">
                Context-aware · Always here to help
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#16503b] text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested follow-ups */}
          {suggestions.length > 0 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#16503b]/30 text-[#16503b] dark:text-green-400 dark:border-green-400/30 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                >
                  <Sparkles size={11} /> {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask AgroBot anything..."
              className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#16503b]/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-[#16503b] text-white flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiChatAssistant;
