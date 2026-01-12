import * as React from 'react';
import { cn, formatDate, formatCurrency, formatDuration } from '../lib/utils';
import { Card } from './Card';
import { Badge } from './Badge';
import {
  Plane,
  Hotel,
  Car,
  Train,
  Bus,
  Ship,
  Footprints,
  MapPin,
  Clock,
  Calendar,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// Activity Card Component
export interface ActivityCardProps {
  name: string;
  type: string;
  location: string;
  time?: string;
  duration?: number;
  price?: { amount: number; currency: string };
  image?: string;
  rating?: number;
  status?: 'planned' | 'booked' | 'completed';
  onClick?: () => void;
  onBook?: () => void;
  className?: string;
}

const activityIcons: Record<string, React.ElementType> = {
  sightseeing: MapPin,
  tour: Footprints,
  museum: Info,
  restaurant: MapPin,
  hotel: Hotel,
  flight: Plane,
  train: Train,
  bus: Bus,
  ferry: Ship,
  car: Car,
};

export function ActivityCard({
  name,
  type,
  location,
  time,
  duration,
  price,
  image,
  rating,
  status = 'planned',
  onClick,
  onBook,
  className,
}: ActivityCardProps) {
  const Icon = activityIcons[type] || MapPin;

  const statusColors = {
    planned: 'border-l-slate-300',
    booked: 'border-l-emerald-500',
    completed: 'border-l-sky-500',
  };

  return (
    <Card
      variant="outline"
      padding="none"
      className={cn(
        'group flex cursor-pointer overflow-hidden border-l-4 transition-all hover:shadow-md',
        statusColors[status],
        className
      )}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-24 w-24 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center p-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Icon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
          </div>
          <h4 className="flex-1 font-medium text-slate-900 dark:text-slate-100">
            {name}
          </h4>
          {rating && (
            <div className="flex items-center text-xs font-medium text-amber-500">
              ★ {rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {location}
          </span>
          {time && (
            <span className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {time}
            </span>
          )}
          {duration && (
            <span className="text-slate-400">
              ({formatDuration(duration)})
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          {price ? (
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(price.amount, price.currency)}
            </span>
          ) : (
            <span className="text-sm text-slate-400">Free</span>
          )}

          {status === 'planned' && onBook && (
            <button
              className="rounded-md bg-sky-500 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity hover:bg-sky-600 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onBook();
              }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

// Flight Card Component
export interface FlightCardProps {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  departure: {
    airport: string;
    code: string;
    time: Date;
    terminal?: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: Date;
    terminal?: string;
  };
  duration: number;
  stops?: number;
  class?: string;
  status?: 'scheduled' | 'delayed' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  price?: { amount: number; currency: string };
  onClick?: () => void;
  className?: string;
}

export function FlightCard({
  airline,
  airlineLogo,
  flightNumber,
  departure,
  arrival,
  duration,
  stops = 0,
  class: flightClass,
  status = 'scheduled',
  price,
  onClick,
  className,
}: FlightCardProps) {
  const statusConfig = {
    scheduled: { color: 'bg-slate-100 text-slate-700', label: 'Scheduled' },
    delayed: { color: 'bg-amber-100 text-amber-700', label: 'Delayed' },
    boarding: { color: 'bg-sky-100 text-sky-700', label: 'Boarding' },
    departed: { color: 'bg-emerald-100 text-emerald-700', label: 'Departed' },
    arrived: { color: 'bg-emerald-100 text-emerald-700', label: 'Arrived' },
    cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
  };

  return (
    <Card
      variant="interactive"
      padding="default"
      className={cn('cursor-pointer', className)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {airlineLogo ? (
            <img
              src={airlineLogo}
              alt={airline}
              className="h-10 w-10 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
              <Plane className="h-5 w-5 text-sky-600" />
            </div>
          )}
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              {airline}
            </div>
            <div className="text-sm text-slate-500">{flightNumber}</div>
          </div>
        </div>

        <Badge
          className={statusConfig[status].color}
          size="sm"
        >
          {statusConfig[status].label}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {departure.code}
          </div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatDate(departure.time, { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-500">
            {departure.terminal && `Terminal ${departure.terminal}`}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center px-4">
          <div className="text-xs text-slate-500">
            {formatDuration(duration)}
          </div>
          <div className="relative my-2 w-full">
            <div className="h-px bg-slate-300 dark:bg-slate-600" />
            <Plane className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-sky-500" />
          </div>
          <div className="text-xs text-slate-500">
            {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {arrival.code}
          </div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatDate(arrival.time, { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-500">
            {arrival.terminal && `Terminal ${arrival.terminal}`}
          </div>
        </div>
      </div>

      {(flightClass || price) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          {flightClass && (
            <Badge variant="secondary" size="sm">
              {flightClass}
            </Badge>
          )}
          {price && (
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(price.amount, price.currency)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// Hotel Card Component
export interface HotelCardProps {
  name: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  location: string;
  checkIn: Date;
  checkOut: Date;
  roomType?: string;
  amenities?: string[];
  price?: { amount: number; currency: string };
  pricePerNight?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HotelCard({
  name,
  image,
  rating,
  reviewCount,
  location,
  checkIn,
  checkOut,
  roomType,
  amenities = [],
  price,
  pricePerNight = true,
  onClick,
  className,
}: HotelCardProps) {
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('overflow-hidden', className)}
      onClick={onClick}
    >
      <div className="relative aspect-video">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500">
            <Hotel className="h-12 w-12 text-white/50" />
          </div>
        )}
        {rating && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-sm font-medium backdrop-blur-sm">
            <span className="text-amber-500">★</span>
            <span>{rating.toFixed(1)}</span>
            {reviewCount && (
              <span className="text-slate-500">({reviewCount})</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </h3>
        <div className="mb-3 flex items-center text-sm text-slate-500">
          <MapPin className="mr-1 h-4 w-4" />
          {location}
        </div>

        <div className="mb-3 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            <span>
              {formatDate(checkIn, { month: 'short', day: 'numeric' })} -{' '}
              {formatDate(checkOut, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <Badge variant="secondary" size="sm">
            {nights} night{nights > 1 ? 's' : ''}
          </Badge>
        </div>

        {roomType && (
          <Badge variant="hotel" size="sm" className="mb-3">
            {roomType}
          </Badge>
        )}

        {amenities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, i) => (
              <Badge key={i} variant="secondary" size="sm">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {price && (
          <div className="flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(price.amount, price.currency)}
              </div>
              <div className="text-xs text-slate-500">
                {pricePerNight ? 'per night' : 'total'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
