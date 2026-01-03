'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, ChevronRight } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  icon: string;
}

// Mock data
const mockBadges: Badge[] = [
  { id: '1', name: 'First Flight', description: 'Complete your first flight booking', icon: '✈️', color: '#60A5FA', isUnlocked: true },
  { id: '2', name: 'Early Bird', description: 'Book 6 months in advance', icon: '🌅', color: '#F97316', isUnlocked: true },
  { id: '3', name: 'Globe Trotter', description: 'Visit 5 countries', icon: '🌍', color: '#10B981', isUnlocked: false, progress: 3, maxProgress: 5 },
  { id: '4', name: 'Budget Guru', description: 'Stay under budget 3 times', icon: '💰', color: '#FBBF24', isUnlocked: false, progress: 1, maxProgress: 3 },
];

const mockAchievements: Achievement[] = [
  { id: '1', name: 'Distance Traveler', description: 'Travel 50,000 km', progress: 32500, target: 50000, xpReward: 1000, icon: '🛫' },
  { id: '2', name: 'Trip Master', description: 'Complete 25 trips', progress: 8, target: 25, xpReward: 800, icon: '🎯' },
];

export function AchievementProgress() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Achievements
          </h3>
        </div>
        <Link
          href="/achievements"
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Recent Badges */}
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Recent Badges
        </p>
        <div className="mt-2 flex gap-2">
          {mockBadges.slice(0, 4).map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="group relative"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110 ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm dark:from-slate-800 dark:to-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
                style={{
                  boxShadow: badge.isUnlocked
                    ? `0 4px 14px ${badge.color}25`
                    : 'none',
                }}
              >
                {badge.isUnlocked ? (
                  <span>{badge.icon}</span>
                ) : (
                  <Lock className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                )}
              </div>

              {/* Progress indicator for locked badges */}
              {!badge.isUnlocked && badge.progress !== undefined && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    {badge.progress}/{badge.maxProgress}
                  </span>
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10">
                <div className="whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white dark:bg-slate-700">
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-slate-400">{badge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="mt-6 space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          In Progress
        </p>
        {mockAchievements.map((achievement) => {
          const progressPercentage = Math.round(
            (achievement.progress / achievement.target) * 100
          );
          return (
            <div key={achievement.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {achievement.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  +{achievement.xpReward} XP
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()} {achievement.description.toLowerCase().includes('km') ? 'km' : ''}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Badge Grid for full achievements page
export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`group relative flex flex-col items-center gap-2 rounded-xl p-3 transition-all ${
            badge.isUnlocked
              ? 'bg-white shadow-sm hover:shadow-md dark:bg-slate-800'
              : 'bg-slate-50 dark:bg-slate-900'
          }`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${
              badge.isUnlocked
                ? ''
                : 'grayscale opacity-50'
            }`}
            style={{
              background: badge.isUnlocked
                ? `linear-gradient(135deg, ${badge.color}15, ${badge.color}05)`
                : undefined,
            }}
          >
            {badge.isUnlocked ? (
              <span>{badge.icon}</span>
            ) : (
              <Lock className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <p className="text-center text-xs font-medium text-slate-700 dark:text-slate-300">
            {badge.name}
          </p>
          {!badge.isUnlocked && badge.progress !== undefined && (
            <div className="w-full">
              <div className="h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-slate-400"
                  style={{
                    width: `${((badge.progress || 0) / (badge.maxProgress || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
