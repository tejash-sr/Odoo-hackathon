'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Target,
  Award,
  Crown,
  Zap,
  Flame,
  Mountain,
  Compass,
  Globe,
  Camera,
  Utensils,
  Plane,
  Map,
  Users,
  Heart,
  Lock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  total: number;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: string;
}

const BADGES: Badge[] = [
  { id: '1', name: 'First Flight', icon: '✈️', description: 'Complete your first trip', rarity: 'common', earned: true, earnedAt: '2024-01-15' },
  { id: '2', name: 'Globe Trotter', icon: '🌍', description: 'Visit 5 different countries', rarity: 'rare', earned: true, earnedAt: '2024-06-20' },
  { id: '3', name: 'Road Warrior', icon: '🚗', description: 'Plan 10 road trips', rarity: 'rare', earned: true, earnedAt: '2024-08-10' },
  { id: '4', name: 'Culture Vulture', icon: '🏛️', description: 'Visit 20 museums', rarity: 'epic', earned: false },
  { id: '5', name: 'Foodie', icon: '🍜', description: 'Try local cuisine in 10 countries', rarity: 'rare', earned: true, earnedAt: '2024-09-05' },
  { id: '6', name: 'Peak Bagger', icon: '⛰️', description: 'Hike 5 mountains', rarity: 'epic', earned: false },
  { id: '7', name: 'Beach Bum', icon: '🏖️', description: 'Visit 10 beaches', rarity: 'common', earned: true, earnedAt: '2024-07-01' },
  { id: '8', name: 'Night Owl', icon: '🦉', description: 'Experience nightlife in 5 cities', rarity: 'common', earned: true, earnedAt: '2024-05-15' },
  { id: '9', name: 'World Explorer', icon: '🗺️', description: 'Visit all 7 continents', rarity: 'legendary', earned: false },
  { id: '10', name: 'Social Butterfly', icon: '🦋', description: 'Share 50 trip experiences', rarity: 'rare', earned: false },
  { id: '11', name: 'Budget Master', icon: '💰', description: 'Complete 5 trips under budget', rarity: 'rare', earned: true, earnedAt: '2024-10-12' },
  { id: '12', name: 'Weather Warrior', icon: '⛈️', description: 'Travel through extreme weather', rarity: 'epic', earned: false },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Trip Planner',
    description: 'Plan 5 complete trips with full itineraries',
    icon: <Map className="w-6 h-6" />,
    rarity: 'common',
    progress: 5,
    total: 5,
    xp: 100,
    unlocked: true,
    unlockedAt: '2024-06-15',
    category: 'Planning',
  },
  {
    id: '2',
    title: 'Document Master',
    description: 'Upload and organize 20 travel documents',
    icon: <CheckCircle2 className="w-6 h-6" />,
    rarity: 'common',
    progress: 15,
    total: 20,
    xp: 150,
    unlocked: false,
    category: 'Organization',
  },
  {
    id: '3',
    title: 'Budget Guru',
    description: 'Track expenses for 10 trips',
    icon: <Target className="w-6 h-6" />,
    rarity: 'rare',
    progress: 7,
    total: 10,
    xp: 250,
    unlocked: false,
    category: 'Finance',
  },
  {
    id: '4',
    title: 'Community Star',
    description: 'Receive 100 likes on your trip posts',
    icon: <Heart className="w-6 h-6" />,
    rarity: 'rare',
    progress: 64,
    total: 100,
    xp: 300,
    unlocked: false,
    category: 'Social',
  },
  {
    id: '5',
    title: 'Photo Journalist',
    description: 'Upload 500 photos across all trips',
    icon: <Camera className="w-6 h-6" />,
    rarity: 'epic',
    progress: 234,
    total: 500,
    xp: 500,
    unlocked: false,
    category: 'Media',
  },
  {
    id: '6',
    title: 'Streak Master',
    description: 'Maintain a 30-day planning streak',
    icon: <Flame className="w-6 h-6" />,
    rarity: 'epic',
    progress: 12,
    total: 30,
    xp: 750,
    unlocked: false,
    category: 'Engagement',
  },
  {
    id: '7',
    title: 'World Domination',
    description: 'Visit 50 different countries',
    icon: <Globe className="w-6 h-6" />,
    rarity: 'legendary',
    progress: 18,
    total: 50,
    xp: 2000,
    unlocked: false,
    category: 'Exploration',
  },
];

const RARITY_STYLES = {
  common: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    text: 'text-slate-600 dark:text-slate-400',
    glow: '',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-600',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-600',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-500/30',
  },
  legendary: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-300 dark:border-amber-600',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/40 shadow-lg',
  },
};

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const earnedBadges = BADGES.filter(b => b.earned);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked);
  const totalXP = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  const filteredBadges = selectedRarity 
    ? BADGES.filter(b => b.rarity === selectedRarity)
    : BADGES;

  const filteredAchievements = selectedRarity
    ? ACHIEVEMENTS.filter(a => a.rarity === selectedRarity)
    : ACHIEVEMENTS;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Achievements & Badges</h1>
              <p className="text-amber-100 mt-1">Track your travel milestones</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{earnedBadges.length}/{BADGES.length}</p>
              <p className="text-sm text-amber-100">Badges Earned</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
              <p className="text-sm text-amber-100">Achievements</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{totalXP.toLocaleString()}</p>
              <p className="text-sm text-amber-100">Total XP</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">Level 12</p>
              <p className="text-sm text-amber-100">Explorer Rank</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'badges'
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Badges
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Achievements
            </button>
          </div>

          {/* Rarity Filter */}
          <div className="flex gap-2">
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(selectedRarity === rarity ? null : rarity)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                  selectedRarity === rarity
                    ? `${RARITY_STYLES[rarity as keyof typeof RARITY_STYLES].bg} ${RARITY_STYLES[rarity as keyof typeof RARITY_STYLES].text}`
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBadges.map((badge, index) => {
              const styles = RARITY_STYLES[badge.rarity];
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 rounded-xl border-2 ${styles.border} ${styles.bg} ${styles.glow} ${
                    !badge.earned ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  {!badge.earned && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-4xl">{badge.icon}</span>
                    <h3 className="mt-2 font-semibold text-slate-900 dark:text-white text-sm">
                      {badge.name}
                    </h3>
                    <p className={`mt-1 text-xs capitalize ${styles.text}`}>
                      {badge.rarity}
                    </p>
                  </div>
                  {badge.earned && badge.earnedAt && (
                    <p className="mt-2 text-xs text-slate-500 text-center">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Achievements List */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {filteredAchievements.map((achievement, index) => {
              const styles = RARITY_STYLES[achievement.rarity];
              const progressPercent = (achievement.progress / achievement.total) * 100;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden ${
                    achievement.unlocked ? styles.glow : ''
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${styles.bg} ${styles.text}`}>
                        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">{achievement.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${styles.bg} ${styles.text}`}>
                              {achievement.rarity}
                            </span>
                            <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                              +{achievement.xp} XP
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {achievement.progress}/{achievement.total}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className={`h-full rounded-full ${
                                achievement.unlocked
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                          </div>
                        </div>

                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed on {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Preview */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top Travelers</h2>
              </div>
              <button className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                View Full Leaderboard
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { rank: 1, name: 'Alex Rivera', xp: 45230, badges: 42, avatar: '🥇' },
              { rank: 2, name: 'Sarah Chen', xp: 42100, badges: 38, avatar: '🥈' },
              { rank: 3, name: 'Marco Rodriguez', xp: 38500, badges: 35, avatar: '🥉' },
              { rank: 15, name: 'You', xp: 12450, badges: 12, avatar: '👤', isCurrentUser: true },
            ].map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-4 p-4 ${
                  user.isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <span className={`text-2xl w-10 text-center ${user.rank <= 3 ? '' : 'text-slate-400'}`}>
                  {user.rank <= 3 ? user.avatar : `#${user.rank}`}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.badges} badges</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">{user.xp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
