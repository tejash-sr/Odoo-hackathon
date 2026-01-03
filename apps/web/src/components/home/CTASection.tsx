'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plane,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

const destinations = [
  { name: 'Paris', country: 'France', flag: '🇫🇷' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { name: 'New York', country: 'USA', flag: '🇺🇸' },
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 py-24 lg:py-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Planes */}
        <div className="absolute left-[10%] top-[20%] animate-float text-white/10">
          <Plane className="h-16 w-16 rotate-45" />
        </div>
        <div
          className="absolute right-[15%] top-[60%] animate-float text-white/10"
          style={{ animationDelay: '1s' }}
        >
          <Plane className="h-12 w-12 -rotate-12" />
        </div>
        <div
          className="absolute bottom-[20%] left-[25%] animate-float text-white/10"
          style={{ animationDelay: '2s' }}
        >
          <Plane className="h-8 w-8 rotate-90" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-48 -left-48 h-[600px] w-[600px] rounded-full bg-white/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Start your journey today
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your dream trip is just a click away
            </h2>

            <p className="mt-6 text-lg text-primary-100">
              Join over 2 million travelers who've discovered smarter travel
              planning. Create your free account and let AI craft your perfect
              itinerary.
            </p>

            {/* Features */}
            <div className="mt-8 flex flex-col gap-4 text-white/90">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Access to 50,000+ destinations worldwide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>AI-powered itinerary planning in seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <span>Collaborate with friends and family</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary-700 shadow-lg transition-all hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Watch Demo
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="h-10 w-10 rounded-full border-2 border-primary-600 object-cover"
                  />
                ))}
              </div>
              <div className="text-sm text-white/80">
                <span className="font-semibold text-white">2.4M+</span> happy
                travelers
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card */}
          <div className="relative">
            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-xl lg:p-10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">
                  Quick Trip Planner
                </h3>
                <p className="mt-2 text-primary-200">
                  Tell us where you want to go
                </p>
              </div>

              {/* Destination Tags */}
              <div className="mt-8">
                <p className="mb-4 text-sm font-medium text-white/60">
                  Popular destinations
                </p>
                <div className="flex flex-wrap gap-3">
                  {destinations.map((dest) => (
                    <button
                      key={dest.name}
                      className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-all hover:bg-white/20"
                    >
                      <span>{dest.flag}</span>
                      <span>{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="mt-8">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to explore?"
                    className="w-full rounded-xl bg-white py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                  Start Planning
                </button>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-xs text-white/60">Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9★</div>
                  <div className="text-xs text-white/60">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-white/60">Support</div>
                </div>
              </div>
            </div>

            {/* Decorative Badge */}
            <div className="absolute -right-4 -top-4 rounded-2xl bg-amber-400 p-4 shadow-lg">
              <div className="text-center">
                <div className="text-sm font-bold text-amber-900">FREE</div>
                <div className="text-xs text-amber-800">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
