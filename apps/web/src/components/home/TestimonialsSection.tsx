'use client';

import * as React from 'react';
import { cn } from '@globetrotter/ui';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    content:
      'GlobeTrotter completely transformed how I plan trips. The AI understood exactly what I wanted and created an itinerary that was better than anything I could have planned myself!',
    author: 'Sarah Chen',
    role: 'Adventure Traveler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    trip: 'Japan, 14 days',
  },
  {
    id: '2',
    content:
      'Planning a group trip for 8 people used to be a nightmare. With GlobeTrotter, everyone could vote on activities, and the expense splitting was automatic. Game changer!',
    author: 'Marcus Johnson',
    role: 'Group Trip Organizer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    trip: 'Italy, 10 days',
  },
  {
    id: '3',
    content:
      "The real-time features saved our trip multiple times. Flight delayed? It automatically adjusted our entire schedule. Restaurant closed? Instant alternatives. It's like having a travel concierge.",
    author: 'Emma Rodriguez',
    role: 'Frequent Flyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    trip: 'Southeast Asia, 3 weeks',
  },
  {
    id: '4',
    content:
      "As someone who's visited 50+ countries, I thought I didn't need a travel app. GlobeTrotter proved me wrong - it found hidden gems I never would have discovered on my own.",
    author: 'David Park',
    role: 'Travel Blogger',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    trip: 'Portugal, 8 days',
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-900 lg:py-32">
      {/* Background Decoration */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/50 blur-3xl dark:bg-primary-900/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            <Star className="h-4 w-4 fill-current" />
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Loved by travelers worldwide
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join millions of happy travelers who've discovered a better way to explore
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mt-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="mx-auto max-w-3xl">
                    <div className="relative rounded-3xl bg-slate-50 p-8 dark:bg-slate-800 lg:p-12">
                      {/* Quote Icon */}
                      <Quote className="absolute right-8 top-8 h-12 w-12 text-slate-200 dark:text-slate-700" />

                      {/* Stars */}
                      <div className="mb-6 flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="relative text-xl text-slate-700 dark:text-slate-300 lg:text-2xl">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author */}
                      <div className="mt-8 flex items-center gap-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-slate-500">
                            {testimonial.role} • {testimonial.trip}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'h-2.5 rounded-full transition-all',
                    index === activeIndex
                      ? 'w-8 bg-primary-500'
                      : 'w-2.5 bg-slate-300 dark:bg-slate-600'
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-700">
          <p className="mb-8 text-center text-sm text-slate-500">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
            {['Google', 'Apple', 'Meta', 'Amazon', 'Microsoft', 'Netflix'].map(
              (company) => (
                <div
                  key={company}
                  className="text-2xl font-bold text-slate-400"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
