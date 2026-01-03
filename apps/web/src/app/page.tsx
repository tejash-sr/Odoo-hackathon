'use client';

import Link from 'next/link';
import { 
  Globe, 
  MapPin, 
  Plane, 
  Calendar,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-20 text-white lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80')] bg-cover bg-center opacity-30" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium">AI-Powered Trip Planning</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Journey Starts{' '}
              <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                Here
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-white/90 md:text-2xl">
              Plan unforgettable trips with AI-powered recommendations
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Everything You Need for Perfect Trips
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful features to make travel planning effortless
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                AI Trip Planner
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Let AI create personalized itineraries based on your preferences and budget
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Smart Route Planning
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Optimize your travel routes and discover hidden gems along the way
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Trip Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Organize all your trips, bookings, and documents in one place
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Budget Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Keep track of expenses and stay within your budget effortlessly
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900">
                <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Travel Community
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect with travelers, share experiences, and get recommendations
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                <Star className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Rewards & Badges
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Earn achievements and unlock rewards as you explore the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Your Adventure?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Join thousands of travelers planning their perfect trips
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition-transform hover:scale-105"
          >
            Start Planning Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
