import * as React from 'react';
import { cn, formatDate, formatCurrency } from '../lib/utils';
import { Card, CardContent, CardImage } from './Card';
import { Badge, StatusBadge } from './Badge';
import { Avatar, AvatarGroup } from './Avatar';
import {
  Calendar,
  MapPin,
  Users,
  Plane,
  Building,
  Camera,
  MoreHorizontal,
} from 'lucide-react';

export interface TripCardProps {
  id: string;
  name: string;
  coverImage?: string;
  destinations: Array<{
    name: string;
    country: string;
  }>;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
  travelers?: Array<{
    name: string;
    avatar?: string;
  }>;
  stats?: {
    activities?: number;
    photos?: number;
  };
  budget?: {
    spent: number;
    total: number;
    currency: string;
  };
  onClick?: () => void;
  onOptionsClick?: () => void;
  className?: string;
}

export function TripCard({
  name,
  coverImage,
  destinations,
  startDate,
  endDate,
  status,
  travelers = [],
  stats,
  budget,
  onClick,
  onOptionsClick,
  className,
}: TripCardProps) {
  const duration = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const destinationText =
    destinations.length === 1
      ? `${destinations[0].name}, ${destinations[0].country}`
      : `${destinations[0].name} + ${destinations.length - 1} more`;

  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('group overflow-hidden', className)}
      onClick={onClick}
    >
      <div className="relative">
        {coverImage ? (
          <CardImage src={coverImage} alt={name} overlay>
            <div className="z-10 flex w-full items-end justify-between">
              <StatusBadge status={status} size="sm" />
              <button
                className="rounded-full bg-white/20 p-1.5 opacity-0 backdrop-blur-sm transition-opacity hover:bg-white/30 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onOptionsClick?.();
                }}
              >
                <MoreHorizontal className="h-4 w-4 text-white" />
              </button>
            </div>
          </CardImage>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-sky-400 to-violet-500">
            <Plane className="h-12 w-12 text-white/50" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </h3>

        <div className="mb-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="mr-1 h-4 w-4" />
          {destinationText}
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            <span>
              {formatDate(startDate, { month: 'short', day: 'numeric' })} -{' '}
              {formatDate(endDate, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <Badge variant="secondary" size="sm">
            {duration} days
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {travelers.length > 0 && (
              <div className="flex items-center">
                <AvatarGroup size="xs" max={3}>
                  {travelers.map((traveler, i) => (
                    <Avatar
                      key={i}
                      src={traveler.avatar}
                      name={traveler.name}
                    />
                  ))}
                </AvatarGroup>
                <span className="ml-2 text-xs text-slate-500">
                  {travelers.length} traveler{travelers.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {stats && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {stats.activities && (
                  <span className="flex items-center">
                    <Building className="mr-1 h-3 w-3" />
                    {stats.activities}
                  </span>
                )}
                {stats.photos && (
                  <span className="flex items-center">
                    <Camera className="mr-1 h-3 w-3" />
                    {stats.photos}
                  </span>
                )}
              </div>
            )}
          </div>

          {budget && (
            <div className="text-right">
              <div className="text-xs text-slate-500">Budget</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(budget.spent, budget.currency)} /{' '}
                <span className="font-normal text-slate-500">
                  {formatCurrency(budget.total, budget.currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Trip Card for lists
export interface TripCardCompactProps {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
  coverImage?: string;
  onClick?: () => void;
  className?: string;
}

export function TripCardCompact({
  name,
  destination,
  startDate,
  endDate,
  status,
  coverImage,
  onClick,
  className,
}: TripCardCompactProps) {
  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('flex overflow-hidden', className)}
      onClick={onClick}
    >
      <div className="relative h-24 w-24 flex-shrink-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-violet-500">
            <Plane className="h-8 w-8 text-white/50" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center p-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            {name}
          </h4>
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="mt-1 flex items-center text-sm text-slate-500">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          {destination}
        </div>
        <div className="mt-1 flex items-center text-xs text-slate-400">
          <Calendar className="mr-1 h-3 w-3" />
          {formatDate(startDate, { month: 'short', day: 'numeric' })} -{' '}
          {formatDate(endDate, { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </Card>
  );
}
