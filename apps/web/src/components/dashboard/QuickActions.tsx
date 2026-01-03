'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  MapPin,
  Camera,
  Calendar,
  Wallet,
  FileText,
  Map,
  Plus,
} from 'lucide-react';

const quickActions = [
  {
    icon: Plane,
    label: 'Add Flight',
    href: '/trips/new?type=flight',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Hotel,
    label: 'Add Hotel',
    href: '/trips/new?type=hotel',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: MapPin,
    label: 'Add Activity',
    href: '/trips/new?type=activity',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Map,
    label: 'Plan Route',
    href: '/route-planner',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Wallet,
    label: 'Log Expense',
    href: '/budget/add',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: FileText,
    label: 'Add Document',
    href: '/documents/upload',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <Link
          href="/trips/new"
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="h-4 w-4" />
          New Trip
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bgColor} transition-transform group-hover:scale-110`}
              >
                <action.icon className={`h-6 w-6 ${action.textColor}`} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Alternative Grid Style
export function QuickActionsCompact() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {quickActions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${action.color} px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105`}
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
