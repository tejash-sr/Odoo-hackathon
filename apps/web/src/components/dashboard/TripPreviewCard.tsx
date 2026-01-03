'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import { MiniHealthRing } from './HealthRing';

interface TripPreviewCardProps {
  trip: {
    id: string;
    name: string;
    destination: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    daysUntil: number;
    readinessScore: number;
    weather?: {
      temp: number;
      condition: string;
    };
  };
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-5 w-5 text-amber-500" />;
    case 'cloudy':
      return <Cloud className="h-5 w-5 text-slate-400" />;
    case 'rainy':
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    default:
      return <Cloud className="h-5 w-5 text-slate-400" />;
  }
};

export function TripPreviewCard({ trip }: TripPreviewCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/trips/${trip.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800"
      >
        {/* Cover Image */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={trip.coverImage}
            alt={trip.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Readiness Score Badge */}
          <div className="absolute bottom-1 right-1">
            <MiniHealthRing score={trip.readinessScore} size={32} />
          </div>
        </div>

        {/* Trip Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate dark:text-white">
            {trip.name}
          </h4>
          
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{trip.destination}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>
            
            {trip.weather && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <WeatherIcon condition={trip.weather.condition} />
                <span>{trip.weather.temp}°C</span>
              </div>
            )}
          </div>
        </div>

        {/* Days Until */}
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {trip.daysUntil}
          </span>
          <span className="text-xs text-slate-400">days</span>
        </div>

        {/* Arrow */}
        <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500 dark:text-slate-600" />
      </motion.div>
    </Link>
  );
}

// Compact Trip Card for lists
export function TripMiniCard({ trip }: TripPreviewCardProps) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
          {trip.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          in {trip.daysUntil} days
        </p>
      </div>
      <MiniHealthRing score={trip.readinessScore} size={28} />
    </Link>
  );
}
