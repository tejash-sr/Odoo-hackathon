'use client';

import * as React from 'react';
import { cn } from '@globetrotter/ui';
import {
  Sparkles,
  Map,
  Calendar,
  Users,
  DollarSign,
  Bell,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Heart,
  Camera,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Trip Planning',
    description:
      'Let our AI create personalized itineraries based on your preferences, interests, and travel style.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description:
      'Explore destinations with detailed maps, offline navigation, and real-time location sharing.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Calendar,
    title: 'Smart Itineraries',
    description:
      'Dynamic itineraries that adapt to weather, crowds, and your real-time preferences.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Group Travel',
    description:
      'Coordinate trips with friends and family. Share expenses, vote on activities, and stay synced.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracking',
    description:
      'Track expenses in real-time, split bills automatically, and stay within your travel budget.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Bell,
    title: 'Travel Alerts',
    description:
      'Get notified about flight changes, weather updates, and local events that affect your trip.',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'Emergency contacts, local safety info, and travel advisories at your fingertips.',
    gradient: 'from-slate-500 to-slate-700',
  },
  {
    icon: Globe,
    title: 'Discover Local',
    description:
      'Find hidden gems, local favorites, and authentic experiences recommended by travelers.',
    gradient: 'from-primary-500 to-blue-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-900/50 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <Zap className="h-4 w-4" />
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Everything you need for the{' '}
            <span className="text-gradient">perfect trip</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From planning to exploring, GlobeTrotter has all the tools to make
            your journey unforgettable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5',
                    feature.gradient
                  )}
                />

                <div
                  className={cn(
                    'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                    feature.gradient
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Features Banner */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-violet-600 p-8 lg:p-12">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white lg:text-3xl">
                Ready to plan your dream trip?
              </h3>
              <p className="mt-2 text-lg text-white/80">
                Join millions of travelers using GlobeTrotter
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="text-white">10M+ Happy Travelers</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Camera className="h-5 w-5 text-amber-300" />
                <span className="text-white">50K+ Destinations</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Smartphone className="h-5 w-5 text-emerald-300" />
                <span className="text-white">Works Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
