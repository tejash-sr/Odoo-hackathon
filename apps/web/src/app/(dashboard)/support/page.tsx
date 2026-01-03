'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Video,
  Zap,
  Shield,
  CreditCard,
  Map,
  Plane,
  Star,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I create a new trip?',
    answer: 'To create a new trip, click the "New Trip" button on your dashboard or trips page. Follow the step-by-step wizard to enter your destination, dates, budget, and preferences. Our AI will help suggest activities and create an itinerary for you.',
    category: 'Getting Started',
  },
  {
    question: 'Can I share my trip with friends and family?',
    answer: 'Yes! Each trip has collaboration features. Go to your trip settings and click "Share Trip". You can invite others via email or share a link. Collaborators can view the itinerary, add suggestions, and leave comments.',
    category: 'Collaboration',
  },
  {
    question: 'How does the budget tracking work?',
    answer: 'Our budget tracker lets you set a total trip budget and track expenses by category (accommodation, food, transport, etc.). You can add expenses manually or scan receipts. The system will show you spending vs budget in real-time.',
    category: 'Budget',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption for all data transmission and storage. Your personal information and travel documents are encrypted at rest. We never sell your data to third parties.',
    category: 'Security',
  },
  {
    question: 'How accurate is the weather forecast?',
    answer: 'We integrate with leading weather providers to give you 7-day forecasts with high accuracy. For trips further in advance, we show historical weather patterns for that destination and time of year.',
    category: 'Features',
  },
  {
    question: 'Can I use the app offline?',
    answer: 'Yes! GlobeTrotter is a Progressive Web App (PWA). Once installed, you can access your trip itineraries, saved documents, and cached data offline. Changes will sync when you\'re back online.',
    category: 'Features',
  },
  {
    question: 'How do I earn badges and XP?',
    answer: 'You earn XP and badges by completing trips, achieving milestones, sharing experiences, and engaging with the community. Check the Achievements page to see all available badges and your progress.',
    category: 'Gamification',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'For premium features, we accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All payments are processed securely through Stripe.',
    category: 'Billing',
  },
];

const HELP_CATEGORIES = [
  { name: 'Getting Started', icon: <Zap className="w-5 h-5" />, count: 8 },
  { name: 'Trip Planning', icon: <Map className="w-5 h-5" />, count: 12 },
  { name: 'Budget & Expenses', icon: <CreditCard className="w-5 h-5" />, count: 6 },
  { name: 'Documents', icon: <FileText className="w-5 h-5" />, count: 5 },
  { name: 'Collaboration', icon: <MessageCircle className="w-5 h-5" />, count: 4 },
  { name: 'Security & Privacy', icon: <Shield className="w-5 h-5" />, count: 7 },
];

const VIDEO_TUTORIALS = [
  { title: 'Getting Started with GlobeTrotter', duration: '3:45', views: '12K' },
  { title: 'Planning Your First Trip', duration: '5:20', views: '8.5K' },
  { title: 'Using the Budget Tracker', duration: '4:15', views: '6.2K' },
  { title: 'Collaborating with Friends', duration: '3:30', views: '4.8K' },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = FAQ_ITEMS.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">How can we help you?</h1>
            <p className="text-indigo-200 mt-2 max-w-2xl mx-auto">
              Search our knowledge base or browse categories below
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-8 mb-12">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Live Chat</h3>
            <p className="text-sm text-slate-500 mt-1">Chat with our support team</p>
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400">Online now</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Email Support</h3>
            <p className="text-sm text-slate-500 mt-1">Get help via email</p>
            <p className="text-sm text-slate-400 mt-4">Usually responds in 24 hours</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
              <Book className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Documentation</h3>
            <p className="text-sm text-slate-500 mt-1">Read our guides</p>
            <a href="#" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 mt-4 hover:text-indigo-700">
              View docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Browse by Category</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    !selectedCategory
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="flex-1">All Topics</span>
                  <span className="text-sm text-slate-400">{FAQ_ITEMS.length}</span>
                </button>
                {HELP_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.icon}
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-sm text-slate-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            {/* FAQs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredFAQs.map((faq, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                          expandedFAQ === faq.question ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === faq.question && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                            <div className="mt-4 flex items-center gap-4">
                              <span className="text-sm text-slate-500">Was this helpful?</span>
                              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                                Yes
                              </button>
                              <button className="text-sm text-slate-500 hover:text-slate-700">
                                No
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-500" />
                  Video Tutorials
                </h2>
                <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {VIDEO_TUTORIALS.map((video, i) => (
                  <div
                    key={i}
                    className="group relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70">
                      <p className="text-white font-medium text-sm">{video.title}</p>
                      <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Still need help? Contact us
                </h2>
              </div>
              <form className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>General Question</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Billing Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-violet-600 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
