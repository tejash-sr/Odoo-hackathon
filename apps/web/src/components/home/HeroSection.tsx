'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Input } from '@globetrotter/ui';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-white">
              AI-Powered Trip Planning
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Your Journey Starts{' '}
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              Here
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-slide-up mt-6 max-w-2xl text-lg text-white/80 sm:text-xl md:text-2xl">
            Plan unforgettable trips with AI-powered recommendations, smart
            itineraries, and real-time travel assistance.
          </p>

          {/* Search Box */}
          <div className="animate-slide-up mt-10 w-full max-w-3xl">
            <div className="flex flex-col gap-4 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-lg dark:bg-slate-900/95 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative flex-1 sm:max-w-[200px]">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="When?"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <Button variant="primary" size="lg" className="h-12 px-8">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="animate-fade-in mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-white/60">Popular:</span>
            {['Paris', 'Tokyo', 'New York', 'Bali', 'Rome'].map((city) => (
              <button
                key={city}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="animate-slide-up mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: '10M+', label: 'Happy Travelers' },
              { value: '195', label: 'Countries Covered' },
              { value: '50K+', label: 'Destinations' },
              { value: '4.9', label: 'App Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-white/60">Scroll to explore</span>
          <div className="h-8 w-5 rounded-full border-2 border-white/30 p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
