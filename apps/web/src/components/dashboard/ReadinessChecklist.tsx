'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  FileText,
  Plane,
  CreditCard,
  Briefcase,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'document' | 'booking' | 'packing' | 'other';
  priority: number;
}

interface ReadinessChecklistProps {
  tripId: string;
}

// Mock data - will be replaced with API call
const mockChecklist: ChecklistItem[] = [
  { id: '1', text: 'Valid passport', completed: true, category: 'document', priority: 1 },
  { id: '2', text: 'Flight tickets', completed: true, category: 'booking', priority: 1 },
  { id: '3', text: 'Hotel reservation', completed: false, category: 'booking', priority: 1 },
  { id: '4', text: 'Travel insurance', completed: true, category: 'document', priority: 2 },
  { id: '5', text: 'Pack essentials', completed: false, category: 'packing', priority: 2 },
];

const categoryIcons = {
  document: FileText,
  booking: Plane,
  packing: Briefcase,
  other: Circle,
};

export function ReadinessChecklist({ tripId }: ReadinessChecklistProps) {
  const [items, setItems] = React.useState(mockChecklist);
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Pre-Trip Checklist
        </h3>
        <Link
          href={`/trips/${tripId}/checklist`}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {completedCount} of {totalCount} completed
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="mt-4 space-y-2">
        {items.slice(0, 5).map((item, index) => {
          const Icon = categoryIcons[item.category];
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                  item.completed
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span
                className={`flex-1 text-sm ${
                  item.completed
                    ? 'text-slate-400 line-through'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.text}
              </span>
              <Icon className="h-4 w-4 text-slate-400" />
            </motion.button>
          );
        })}
      </div>

      {/* Quick Add */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-2 text-sm text-slate-400 transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-slate-700 dark:hover:border-primary-500">
        <span>+ Add item</span>
      </button>
    </div>
  );
}

// Compact version for smaller spaces
export function ReadinessChecklistMini({ items }: { items: ChecklistItem[] }) {
  const pending = items.filter((item) => !item.completed);
  
  if (pending.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          All items completed! 🎉
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pending.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20"
        >
          <Circle className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-amber-700 dark:text-amber-400">
            {item.text}
          </span>
        </div>
      ))}
      {pending.length > 3 && (
        <p className="text-xs text-slate-400">
          +{pending.length - 3} more items
        </p>
      )}
    </div>
  );
}
