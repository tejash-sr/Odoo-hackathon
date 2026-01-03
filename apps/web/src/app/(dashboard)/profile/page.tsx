'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Shield,
  Bell,
  Globe,
  Palette,
  Moon,
  Sun,
  Lock,
  LogOut,
  ChevronRight,
  Award,
  Trophy,
  Flame,
  Star,
  Plane,
  Map,
  Target,
  Zap,
  Settings,
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  xp: number;
}

const badges: Badge[] = [
  { id: '1', name: 'First Trip', description: 'Complete your first trip', icon: '🎒', earned: true, earnedDate: '2023-12-25', rarity: 'common' },
  { id: '2', name: 'Globe Trotter', description: 'Visit 5 different countries', icon: '🌍', earned: true, earnedDate: '2024-01-15', rarity: 'rare' },
  { id: '3', name: 'Budget Master', description: 'Stay under budget on 3 trips', icon: '💰', earned: true, earnedDate: '2024-02-01', rarity: 'rare' },
  { id: '4', name: 'Early Bird', description: 'Book a trip 6 months in advance', icon: '🐦', earned: false, rarity: 'common' },
  { id: '5', name: 'Adventurer', description: 'Complete 10 activities in one trip', icon: '⚡', earned: true, earnedDate: '2024-02-20', rarity: 'epic' },
  { id: '6', name: 'Collector', description: 'Earn 10 badges', icon: '🏆', earned: false, rarity: 'legendary' },
];

const achievements: Achievement[] = [
  { id: '1', name: 'Miles Traveled', description: 'Total distance traveled', progress: 24500, target: 50000, xp: 500 },
  { id: '2', name: 'Countries Visited', description: 'Unique countries explored', progress: 8, target: 20, xp: 250 },
  { id: '3', name: 'Trip Streak', description: 'Consecutive months with trips', progress: 4, target: 12, xp: 300 },
  { id: '4', name: 'Perfect Planning', description: 'Trips with 100% readiness', progress: 2, target: 5, xp: 400 },
];

const rarityColors = {
  common: 'from-slate-400 to-slate-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'achievements' | 'settings'>('profile');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const totalXP = 2450;
  const level = Math.floor(totalXP / 500) + 1;
  const currentLevelXP = totalXP % 500;
  const xpToNextLevel = 500;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary-600 via-violet-600 to-purple-600 px-4 pb-24 pt-8">
        <div className="mx-auto max-w-4xl">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center sm:flex-row sm:items-start sm:gap-6"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary-400 to-violet-500 text-4xl font-bold text-white shadow-xl">
                T
              </div>
              <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition-colors hover:bg-slate-50">
                <Camera className="h-5 w-5" />
              </button>
              {/* Level Badge */}
              <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-sm font-bold text-white shadow-lg">
                {level}
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 text-center sm:mt-0 sm:text-left">
              <h1 className="text-2xl font-bold text-white">Tejash</h1>
              <p className="mt-1 text-primary-100">@tejash</p>
              <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-primary-100 sm:justify-start">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  India
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined January 2026
                </span>
              </div>

              {/* XP Progress */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span className="text-sm text-white">
                    {currentLevelXP} / {xpToNextLevel} XP to Level {level + 1}
                  </span>
                </div>
                <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentLevelXP / xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-6 sm:ml-auto sm:mt-0">
              {[
                { label: 'Trips', value: 12 },
                { label: 'Countries', value: 8 },
                { label: 'Badges', value: 4 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-primary-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 -mt-12 mx-auto max-w-4xl px-4">
        <div className="flex gap-2 rounded-xl bg-white p-2 shadow-lg dark:bg-slate-900">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {activeTab === 'profile' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Personal Information */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">Tejash</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Email
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">
                    demo@globetrotter.app
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Phone
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">
                    123
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Location
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">
                    India
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Travel Preferences */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Travel Preferences
                </h2>
                <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Adventure', 'Culture', 'Food & Dining', 'Nature', 'Photography'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Preferred Currency
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">USD ($)</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Home Airport
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-white">DEL - Delhi</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Trips Map */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Places Visited
              </h2>
              <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                  <Map className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    World map with visited countries
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Level Progress */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-100">Current Level</p>
                  <p className="text-4xl font-bold">Level {level}</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Award className="h-10 w-10" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>{totalXP} XP Total</span>
                  <span>{500 - currentLevelXP} XP to next level</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${(currentLevelXP / 500) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Badges ({badges.filter((b) => b.earned).length}/{badges.length})
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className={`relative flex flex-col items-center rounded-xl p-4 ${
                      badge.earned
                        ? 'bg-slate-50 dark:bg-slate-800'
                        : 'bg-slate-50/50 opacity-50 grayscale dark:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${
                        rarityColors[badge.rarity]
                      } text-2xl shadow-lg`}
                    >
                      {badge.icon}
                    </div>
                    <p className="mt-2 text-center text-xs font-medium text-slate-900 dark:text-white">
                      {badge.name}
                    </p>
                    {badge.earned && badge.earnedDate && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                    {!badge.earned && (
                      <Lock className="absolute right-2 top-2 h-3 w-3 text-slate-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievement Progress */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Achievement Progress
              </h2>
              <div className="mt-4 space-y-4">
                {achievements.map((achievement) => {
                  const percentage = Math.min(
                    (achievement.progress / achievement.target) * 100,
                    100
                  );
                  return (
                    <div
                      key={achievement.id}
                      className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {achievement.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {achievement.progress.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            / {achievement.target.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            percentage >= 100
                              ? 'bg-emerald-500'
                              : 'bg-primary-500'
                          }`}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {Math.round(percentage)}% complete
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <Zap className="h-3 w-3" />
                          +{achievement.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Appearance */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Appearance
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      {isDarkMode ? (
                        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Toggle dark theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      isDarkMode ? 'bg-primary-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Notifications
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  { label: 'Trip Reminders', description: 'Get notified before trips' },
                  { label: 'Price Alerts', description: 'Flight and hotel deals' },
                  { label: 'Achievement Updates', description: 'Badge and XP notifications' },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {setting.label}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {setting.description}
                      </p>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-primary-600">
                      <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Security
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  { icon: Lock, label: 'Change Password' },
                  { icon: Shield, label: 'Two-Factor Authentication' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div variants={itemVariants}>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 py-3 text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
