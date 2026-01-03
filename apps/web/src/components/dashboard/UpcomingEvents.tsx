'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface Event {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'reminder';
  title: string;
  subtitle: string;
  time: string;
  date: string;
  isUrgent?: boolean;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Check-in opens',
    subtitle: 'Japan Adventure - AA123',
    time: '10:00 AM',
    date: 'Tomorrow',
    isUrgent: true,
  },
  {
    id: '2',
    type: 'flight',
    title: 'Flight Departure',
    subtitle: 'LAX → NRT • AA123',
    time: '6:30 PM',
    date: 'Apr 15',
  },
  {
    id: '3',
    type: 'hotel',
    title: 'Hotel Check-in',
    subtitle: 'Park Hyatt Tokyo',
    time: '3:00 PM',
    date: 'Apr 16',
  },
  {
    id: '4',
    type: 'activity',
    title: 'Tsukiji Market Tour',
    subtitle: 'Guided tour - 3 hours',
    time: '6:00 AM',
    date: 'Apr 17',
  },
];

const eventIcons = {
  flight: Plane,
  hotel: Hotel,
  activity: MapPin,
  reminder: AlertCircle,
};

const eventColors = {
  flight: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  hotel: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  activity: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  reminder: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export function UpcomingEvents() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Upcoming Events
        </h3>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Calendar
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {mockEvents.map((event, index) => {
          const Icon = eventIcons[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                event.isUrgent ? 'ring-2 ring-amber-200 dark:ring-amber-900/50' : ''
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${eventColors[event.type]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {event.title}
                  </p>
                  {event.isUrgent && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {event.subtitle}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{event.date}</span>
                  <Clock className="h-3 w-3" />
                  <span>{event.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {mockEvents.length === 0 && (
        <div className="py-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            No upcoming events
          </p>
          <Link
            href="/trips/new"
            className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Plan your first trip →
          </Link>
        </div>
      )}
    </div>
  );
}

// Timeline variant
export function EventsTimeline() {
  return (
    <div className="relative space-y-4 pl-6">
      {/* Timeline line */}
      <div className="absolute left-2 top-2 h-full w-0.5 bg-slate-200 dark:bg-slate-700" />

      {mockEvents.map((event, index) => {
        const Icon = eventIcons[event.type];
        return (
          <div key={event.id} className="relative">
            {/* Timeline dot */}
            <div
              className={`absolute -left-4 top-1 h-4 w-4 rounded-full border-2 border-white shadow ${
                event.type === 'reminder'
                  ? 'bg-amber-500'
                  : event.type === 'flight'
                  ? 'bg-blue-500'
                  : event.type === 'hotel'
                  ? 'bg-violet-500'
                  : 'bg-emerald-500'
              } dark:border-slate-900`}
            />

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{event.date}</span>
                <span>•</span>
                <span>{event.time}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                {event.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {event.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
