'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-xl shadow-primary-500/25"
        >
          <Compass className="h-12 w-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mt-8 text-6xl font-bold text-slate-900 dark:text-white">
            404
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-slate-700 dark:text-slate-300">
            Page Not Found
          </h2>
          <p className="mt-4 max-w-md text-slate-500 dark:text-slate-400">
            Looks like you've wandered off the beaten path. Don't worry, even the best
            explorers get lost sometimes!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </motion.div>

        {/* Fun travel quotes */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm italic text-slate-400 dark:text-slate-500"
        >
          "Not all those who wander are lost... but you definitely are right now."
        </motion.p>
      </div>
    </div>
  );
}
