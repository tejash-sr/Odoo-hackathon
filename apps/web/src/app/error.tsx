'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 shadow-xl shadow-red-500/25"
        >
          <AlertTriangle className="h-12 w-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mt-8 text-3xl font-bold text-slate-900 dark:text-white">
            Oops! Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-slate-500 dark:text-slate-400">
            We encountered an unexpected error. Our team has been notified and is working
            on fixing it.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
