'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Sparkles,
  User,
  Bot,
  Plane,
  Map,
  Calendar,
  Cloud,
  CreditCard,
  Loader2,
  ChevronDown,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const QUICK_PROMPTS = [
  { icon: <Plane className="w-4 h-4" />, text: 'Plan a weekend trip' },
  { icon: <Map className="w-4 h-4" />, text: 'Best places to visit in...' },
  { icon: <Calendar className="w-4 h-4" />, text: 'Create an itinerary' },
  { icon: <Cloud className="w-4 h-4" />, text: 'Check weather forecast' },
  { icon: <CreditCard className="w-4 h-4" />, text: 'Budget tips' },
];

// Simulated AI responses (in production, connect to a real AI API)
const AI_RESPONSES: Record<string, string> = {
  default: "I'm GlobeBot, your AI travel assistant! I can help you plan trips, find destinations, create itineraries, check weather, and more. How can I assist you today?",
  weekend: "Great idea! For a weekend trip, consider:\n\n🏖️ **Beach Getaway**: San Diego, Miami, or Santa Monica\n🏔️ **Mountain Escape**: Lake Tahoe, Aspen, or Big Bear\n🏙️ **City Break**: Chicago, Austin, or New Orleans\n\nWhat type of experience are you looking for? I can create a detailed itinerary once you pick a destination!",
  weather: "I can help you check the weather! Here's what I found:\n\n☀️ **Paris**: 72°F, Sunny\n🌤️ **Tokyo**: 68°F, Partly Cloudy\n🌧️ **London**: 58°F, Light Rain\n\nWould you like a detailed 7-day forecast for any of these cities?",
  budget: "Here are my top budget travel tips:\n\n1. 🗓️ **Travel Off-Season** - Save 30-50% on flights and hotels\n2. ✈️ **Be Flexible with Dates** - Use fare calendars to find cheapest days\n3. 🏠 **Consider Alternatives** - Hostels, Airbnb, or house-sitting\n4. 🍽️ **Eat Local** - Street food and local markets\n5. 🎫 **Get City Passes** - Bundled attractions save money\n\nWhat's your budget range? I can suggest destinations that fit!",
  itinerary: "I'd love to create an itinerary for you! To make it perfect, please tell me:\n\n1. 📍 **Destination** - Where do you want to go?\n2. 📅 **Dates** - When and how long?\n3. 💰 **Budget** - Luxury, mid-range, or budget?\n4. 🎯 **Interests** - Culture, food, adventure, relaxation?\n\nShare these details and I'll craft a personalized day-by-day itinerary!",
};

export function TravelAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: AI_RESPONSES.default,
            timestamp: new Date(),
            suggestions: ['Plan a trip', 'Weather check', 'Budget tips'],
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = AI_RESPONSES.default;
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('weekend') || lowerInput.includes('trip')) {
        response = AI_RESPONSES.weekend;
      } else if (lowerInput.includes('weather') || lowerInput.includes('forecast')) {
        response = AI_RESPONSES.weather;
      } else if (lowerInput.includes('budget') || lowerInput.includes('cheap') || lowerInput.includes('save')) {
        response = AI_RESPONSES.budget;
      } else if (lowerInput.includes('itinerary') || lowerInput.includes('plan')) {
        response = AI_RESPONSES.itinerary;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all z-50 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 600,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-1">
                    GlobeBot
                    <Sparkles className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-indigo-200">AI Travel Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronDown className={`w-5 h-5 text-white transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-indigo-100 dark:bg-indigo-900/50'
                          : 'bg-gradient-to-br from-indigo-500 to-violet-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-indigo-500 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className="text-xs text-slate-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestion(suggestion)}
                                className="px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-800">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-slate-500 mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickPrompt(prompt.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {prompt.icon}
                          {prompt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask me anything about travel..."
                        className="w-full px-4 py-2.5 pr-10 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="p-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isTyping ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-2">
                    Powered by AI • May produce inaccurate information
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
