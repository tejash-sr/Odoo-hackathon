'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plane,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Trophy,
  Target,
  CheckCircle2,
  Clock,
  Globe,
  Wallet,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Sun,
  Cloud,
  Droplets,
  Wind,
} from 'lucide-react';
import { HealthRing } from '@/components/dashboard/HealthRing';
import { TripPreviewCard } from '@/components/dashboard/TripPreviewCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ReadinessChecklist } from '@/components/dashboard/ReadinessChecklist';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { AchievementProgress } from '@/components/dashboard/AchievementProgress';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Mock data for demonstration
  const upcomingTrip = {
    id: '1',
    name: 'Japan Adventure',
    destination: 'Tokyo, Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    startDate: new Date('2026-04-15'),
    endDate: new Date('2026-04-28'),
    daysUntil: 102,
    readinessScore: 75,
    weather: { temp: 18, condition: 'partly-cloudy' },
  };

  const readinessBreakdown = {
    documents: { score: 90, items: 4, completed: 3 },
    bookings: { score: 65, items: 6, completed: 4 },
    checklist: { score: 70, items: 15, completed: 10 },
    budget: { score: 80, percentage: 24 },
  };

  const recentActivity = [
    { id: 1, action: 'Booked flight', trip: 'Japan Adventure', time: '2 hours ago' },
    { id: 2, action: 'Added activity', trip: 'Japan Adventure', time: '5 hours ago' },
    { id: 3, action: 'Updated budget', trip: 'European Summer', time: '1 day ago' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 pb-20 lg:pb-0"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Welcome back, {user?.firstName || 'Explorer'}! 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {upcomingTrip.daysUntil > 0
              ? `${upcomingTrip.daysUntil} days until your ${upcomingTrip.name}!`
              : "Let's plan your next adventure"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl"
          >
            <Plane className="h-4 w-4" />
            Plan New Trip
          </Link>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Readiness Score & Trip Preview */}
        <motion.div variants={fadeInUp} className="space-y-6 lg:col-span-2">
          {/* Readiness Score Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Trip Readiness Score
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {upcomingTrip.name}
                  </p>
                </div>
                <Link
                  href={`/trips/${upcomingTrip.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 flex flex-col items-center gap-8 md:flex-row">
                {/* Health Ring */}
                <div className="flex-shrink-0">
                  <HealthRing
                    score={upcomingTrip.readinessScore}
                    size={180}
                    breakdown={readinessBreakdown}
                  />
                </div>

                {/* Breakdown Stats */}
                <div className="flex-1 space-y-4">
                  <ReadinessItem
                    icon={FileCheck}
                    label="Documents"
                    score={readinessBreakdown.documents.score}
                    detail={`${readinessBreakdown.documents.completed}/${readinessBreakdown.documents.items} ready`}
                    color="emerald"
                  />
                  <ReadinessItem
                    icon={Plane}
                    label="Bookings"
                    score={readinessBreakdown.bookings.score}
                    detail={`${readinessBreakdown.bookings.completed}/${readinessBreakdown.bookings.items} confirmed`}
                    color="blue"
                  />
                  <ReadinessItem
                    icon={CheckCircle2}
                    label="Checklist"
                    score={readinessBreakdown.checklist.score}
                    detail={`${readinessBreakdown.checklist.completed}/${readinessBreakdown.checklist.items} done`}
                    color="violet"
                  />
                  <ReadinessItem
                    icon={Wallet}
                    label="Budget"
                    score={readinessBreakdown.budget.score}
                    detail={`${readinessBreakdown.budget.percentage}% spent`}
                    color="amber"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Trip Preview */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <TripPreviewCard trip={upcomingTrip} />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                href="/activity"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                    <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.trip}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Sidebar Content */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* User Stats */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary-500 to-violet-600 p-6 text-white shadow-lg dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {user?.profile?.currentTitle || 'Explorer'}
                </p>
                <p className="text-sm text-white/80">Level {user?.profile?.level || 1}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{user?.profile?.totalTrips || 0}</p>
                <p className="text-xs text-white/70">Trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.profile?.totalCountries || 0}</p>
                <p className="text-xs text-white/70">Countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.profile?.xp || 0}</p>
                <p className="text-xs text-white/70">XP</p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Level Progress</span>
                <span>{((user?.profile?.xp || 0) % 1000) / 10}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${((user?.profile?.xp || 0) % 1000) / 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <UpcomingEvents />

          {/* Checklist Preview */}
          <ReadinessChecklist tripId={upcomingTrip.id} />

          {/* Achievement Progress */}
          <AchievementProgress />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Readiness Item Component
function ReadinessItem({
  icon: Icon,
  label,
  score,
  detail,
  color,
}: {
  icon: any;
  label: string;
  score: number;
  detail: string;
  color: 'emerald' | 'blue' | 'violet' | 'amber';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const progressColors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {label}
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {score}%
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${progressColors[color]}`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-6">
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
