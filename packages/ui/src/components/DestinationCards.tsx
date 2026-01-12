import * as React from 'react';
import { cn, formatCurrency } from '../lib/utils';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import {
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  DollarSign,
  Globe,
  Shield,
  Plane,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

// Destination Card
export interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  tags?: string[];
  weather?: {
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  };
  flightTime?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  'partly-cloudy': Cloud,
};

export function DestinationCard({
  name,
  country,
  image,
  rating,
  reviewCount,
  description,
  tags = [],
  weather,
  flightTime,
  priceLevel,
  isFavorite = false,
  onFavorite,
  onClick,
  className,
}: DestinationCardProps) {
  const WeatherIcon = weather ? weatherIcons[weather.condition] : null;

  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('group overflow-hidden', className)}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={image}
          alt={`${name}, ${country}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {weather && WeatherIcon && (
            <div className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-sm backdrop-blur-sm">
              <WeatherIcon className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{weather.temperature}°</span>
            </div>
          )}
          <button
            className={cn(
              'rounded-full p-2 backdrop-blur-sm transition-colors',
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-slate-600 hover:bg-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}
          >
            <Heart
              className={cn('h-4 w-4', isFavorite && 'fill-current')}
            />
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            <span>{country}</span>
            {rating && (
              <>
                <span className="text-white/50">•</span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating.toFixed(1)}
                  {reviewCount && (
                    <span className="ml-1 text-white/60">
                      ({reviewCount.toLocaleString()})
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {description && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500">
          {flightTime && (
            <div className="flex items-center">
              <Plane className="mr-1 h-4 w-4" />
              {flightTime} flight
            </div>
          )}
          {priceLevel && (
            <div className="flex items-center">
              <DollarSign className="mr-0.5 h-4 w-4" />
              {'$'.repeat(priceLevel)}
              <span className="ml-1 text-slate-400">
                {'$'.repeat(4 - priceLevel)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Destination Info Sections
export interface DestinationSafetyProps {
  level: 'safe' | 'moderate' | 'caution' | 'avoid';
  advisories: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  className?: string;
}

const safetyConfig = {
  safe: {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: CheckCircle,
    label: 'Safe to Travel',
  },
  moderate: {
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: Info,
    label: 'Exercise Normal Precautions',
  },
  caution: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: AlertTriangle,
    label: 'Exercise Increased Caution',
  },
  avoid: {
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: AlertTriangle,
    label: 'Do Not Travel',
  },
};

export function DestinationSafety({
  level,
  advisories,
  emergencyNumbers,
  className,
}: DestinationSafetyProps) {
  const config = safetyConfig[level];
  const Icon = config.icon;

  return (
    <Card className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            config.bgColor
          )}
        >
          <Icon className={cn('h-6 w-6', config.color)} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Safety Information
          </h3>
          <p className={cn('text-sm font-medium', config.color)}>
            {config.label}
          </p>
        </div>
      </div>

      {advisories.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Travel Advisories
          </h4>
          <ul className="space-y-1">
            {advisories.map((advisory, i) => (
              <li
                key={i}
                className="flex items-start text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="mr-2 text-slate-400">•</span>
                {advisory}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Emergency Numbers
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
            <div className="text-xs text-slate-500">Police</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {emergencyNumbers.police}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
            <div className="text-xs text-slate-500">Ambulance</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {emergencyNumbers.ambulance}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
            <div className="text-xs text-slate-500">Fire</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {emergencyNumbers.fire}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Visa Information Card
export interface VisaInfoCardProps {
  required: boolean;
  type?: string;
  duration?: string;
  cost?: { amount: number; currency: string };
  processingTime?: string;
  requirements?: string[];
  onArrival?: boolean;
  eVisa?: boolean;
  className?: string;
}

export function VisaInfoCard({
  required,
  type,
  duration,
  cost,
  processingTime,
  requirements = [],
  onArrival,
  eVisa,
  className,
}: VisaInfoCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
          <Globe className="h-6 w-6 text-violet-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Visa Information
          </h3>
          <p
            className={cn(
              'text-sm font-medium',
              required ? 'text-amber-600' : 'text-emerald-600'
            )}
          >
            {required ? 'Visa Required' : 'Visa Free Entry'}
          </p>
        </div>
      </div>

      {required && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {type && (
              <div>
                <div className="text-xs text-slate-500">Visa Type</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {type}
                </div>
              </div>
            )}
            {duration && (
              <div>
                <div className="text-xs text-slate-500">Stay Duration</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {duration}
                </div>
              </div>
            )}
            {cost && (
              <div>
                <div className="text-xs text-slate-500">Cost</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(cost.amount, cost.currency)}
                </div>
              </div>
            )}
            {processingTime && (
              <div>
                <div className="text-xs text-slate-500">Processing Time</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {processingTime}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {onArrival && (
              <Badge variant="success" size="sm">
                Visa on Arrival Available
              </Badge>
            )}
            {eVisa && (
              <Badge variant="info" size="sm">
                e-Visa Available
              </Badge>
            )}
          </div>

          {requirements.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Requirements
              </h4>
              <ul className="space-y-1">
                {requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// Weather Overview Card
export interface WeatherOverviewProps {
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
  className?: string;
}

export function WeatherOverview({
  current,
  forecast,
  className,
}: WeatherOverviewProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-500">Current Weather</h3>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">
              {current.temperature}°
            </span>
            <span className="mb-2 text-slate-500">
              Feels like {current.feelsLike}°
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {current.condition}
          </p>
        </div>
        <div className="text-6xl">{current.icon}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex items-center text-sm text-slate-500">
            <Thermometer className="mr-1 h-4 w-4" />
            Humidity
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {current.humidity}%
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex items-center text-sm text-slate-500">
            <Cloud className="mr-1 h-4 w-4" />
            Wind
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {current.windSpeed} km/h
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          7-Day Forecast
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast.map((day, i) => (
            <div
              key={i}
              className="flex flex-shrink-0 flex-col items-center rounded-lg bg-slate-50 p-2 dark:bg-slate-800"
            >
              <span className="text-xs text-slate-500">{day.day}</span>
              <span className="my-1 text-xl">{day.icon}</span>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {day.high}°
                </span>
                <span className="text-slate-400">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
