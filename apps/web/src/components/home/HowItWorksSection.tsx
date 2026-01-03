'use client';

import * as React from 'react';
import { cn } from '@globetrotter/ui';
import {
  Lightbulb,
  Sparkles,
  Map,
  Plane,
  Check,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Share Your Dream',
    description:
      'Tell us where you want to go, what you love, and how you like to travel. Our AI understands your unique preferences.',
    color: 'from-amber-500 to-orange-500',
    features: ['Natural language input', 'Preference learning', 'Budget analysis'],
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Magic Happens',
    description:
      'Our intelligent AI crafts a personalized itinerary, finding the best routes, hidden gems, and perfect timing for everything.',
    color: 'from-primary-500 to-blue-500',
    features: ['Smart recommendations', 'Route optimization', 'Weather adaptation'],
  },
  {
    number: '03',
    icon: Map,
    title: 'Customize & Refine',
    description:
      'Review and tweak your itinerary. Drag, drop, and adjust. Add activities, change timings, or let AI suggest alternatives.',
    color: 'from-emerald-500 to-teal-500',
    features: ['Drag & drop editor', 'Real-time updates', 'Collaborative editing'],
  },
  {
    number: '04',
    icon: Plane,
    title: 'Travel & Enjoy',
    description:
      'Hit the road with confidence. Get real-time guidance, nearby suggestions, and instant help throughout your journey.',
    color: 'from-violet-500 to-purple-500',
    features: ['Offline access', 'Live navigation', 'Travel assistance'],
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-900 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Check className="h-4 w-4" />
            Simple Process
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Planning your perfect trip takes just four simple steps. Let us handle
            the complexity while you focus on the excitement.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 space-y-12 lg:space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={step.number}
                className={cn(
                  'relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16',
                  isEven && 'lg:flex-row-reverse'
                )}
              >
                {/* Image/Illustration Side */}
                <div className="relative flex-1">
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-3xl bg-gradient-to-br p-1',
                      step.color
                    )}
                  >
                    <div className="rounded-[calc(1.5rem-4px)] bg-slate-50 p-8 dark:bg-slate-800">
                      <div
                        className={cn(
                          'mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br text-white',
                          step.color
                        )}
                      >
                        <Icon className="h-12 w-12" />
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        {step.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm dark:bg-slate-700"
                          >
                            <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step Number */}
                  <div
                    className={cn(
                      'absolute -top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-lg',
                      step.color,
                      isEven ? 'right-4' : 'left-4'
                    )}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 hidden h-12 w-0.5 -translate-x-1/2 translate-y-full bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
