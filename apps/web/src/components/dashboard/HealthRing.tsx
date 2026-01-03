'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@globetrotter/ui';

interface HealthRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  breakdown?: {
    documents: { score: number };
    bookings: { score: number };
    checklist: { score: number };
    budget: { score: number };
  };
  className?: string;
}

export function HealthRing({
  score,
  size = 180,
  strokeWidth = 12,
  breakdown,
  className,
}: HealthRingProps) {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#10B981', bg: 'from-emerald-500/20 to-emerald-500/5' };
    if (score >= 60) return { stroke: '#F59E0B', bg: 'from-amber-500/20 to-amber-500/5' };
    if (score >= 40) return { stroke: '#F97316', bg: 'from-orange-500/20 to-orange-500/5' };
    return { stroke: '#EF4444', bg: 'from-red-500/20 to-red-500/5' };
  };

  const { stroke: mainColor, bg: bgGradient } = getScoreColor(score);

  // Inner rings data
  const innerRings = breakdown ? [
    { score: breakdown.documents.score, color: '#10B981', label: 'Docs' },
    { score: breakdown.bookings.score, color: '#3B82F6', label: 'Book' },
    { score: breakdown.checklist.score, color: '#8B5CF6', label: 'Check' },
    { score: breakdown.budget.score, color: '#F59E0B', label: 'Budget' },
  ] : [];

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      {/* Background Gradient */}
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-radial',
          bgGradient
        )}
      />

      {/* SVG Rings */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
        />

        {/* Progress Ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={mainColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="filter drop-shadow-lg"
        />

        {/* Inner Mini Rings */}
        {innerRings.map((ring, index) => {
          const innerRadius = radius - strokeWidth - 8 - index * 14;
          const innerCircumference = 2 * Math.PI * innerRadius;
          const innerProgress = (ring.score / 100) * innerCircumference;

          if (innerRadius < 20) return null;

          return (
            <React.Fragment key={ring.label}>
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                className="text-slate-100 dark:text-slate-800"
              />
              <motion.circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke={ring.color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={innerCircumference}
                initial={{ strokeDashoffset: innerCircumference }}
                animate={{ strokeDashoffset: innerCircumference - innerProgress }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 * (index + 1) }}
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {score}
          </span>
          <span className="text-xl text-slate-400">%</span>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Ready
          </p>
        </motion.div>
      </div>

      {/* Score Indicator */}
      <ScoreIndicator score={score} size={size} />
    </div>
  );
}

// Score Indicator - Visual feedback
function ScoreIndicator({ score, size }: { score: number; size: number }) {
  const getMessage = (score: number) => {
    if (score >= 90) return { text: 'Excellent!', emoji: '🎉' };
    if (score >= 75) return { text: 'Almost there!', emoji: '💪' };
    if (score >= 50) return { text: 'Good progress', emoji: '👍' };
    if (score >= 25) return { text: 'Getting started', emoji: '🚀' };
    return { text: 'Let\'s plan!', emoji: '📝' };
  };

  const { text, emoji } = getMessage(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {emoji} {text}
      </span>
    </motion.div>
  );
}

// Mini Health Ring for compact displays
interface MiniHealthRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function MiniHealthRing({ score, size = 40, className }: MiniHealthRingProps) {
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {score}
        </span>
      </div>
    </div>
  );
}
