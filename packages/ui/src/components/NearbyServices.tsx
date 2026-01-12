import * as React from 'react';
import { cn, formatDistance } from '../lib/utils';
import { Card } from './Card';
import { Badge } from './Badge';
import {
  Fuel,
  Zap,
  ParkingCircle,
  Utensils,
  Coffee,
  Hotel,
  Building2,
  Building,
  Banknote,
  Shield,
  Bath,
  MapPin,
  Clock,
  Navigation,
  Star,
  ChevronRight,
  Phone,
} from 'lucide-react';

// Service Types
export type ServiceType =
  | 'gas-station'
  | 'ev-charging'
  | 'rest-area'
  | 'parking'
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'hospital'
  | 'pharmacy'
  | 'atm'
  | 'bank'
  | 'police'
  | 'restroom';

interface ServiceConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}

const serviceConfigs: Record<ServiceType, ServiceConfig> = {
  'gas-station': {
    icon: Fuel,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'Gas Station',
  },
  'ev-charging': {
    icon: Zap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'EV Charging',
  },
  'rest-area': {
    icon: ParkingCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Rest Area',
  },
  parking: {
    icon: ParkingCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Parking',
  },
  restaurant: {
    icon: Utensils,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Restaurant',
  },
  cafe: {
    icon: Coffee,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Cafe',
  },
  hotel: {
    icon: Hotel,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    label: 'Hotel',
  },
  hospital: {
    icon: Building2,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Hospital',
  },
  pharmacy: {
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Pharmacy',
  },
  atm: {
    icon: Banknote,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'ATM',
  },
  bank: {
    icon: Building,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    label: 'Bank',
  },
  police: {
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Police',
  },
  restroom: {
    icon: Bath,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    label: 'Restroom',
  },
};

// Nearby Service Card
export interface NearbyServiceCardProps {
  type: ServiceType;
  name: string;
  address: string;
  distance: number; // in meters
  duration?: number; // in minutes
  isOpen?: boolean;
  rating?: number;
  phone?: string;
  // Gas station specific
  fuelPrices?: Array<{
    type: string;
    price: number;
    currency: string;
  }>;
  // EV charging specific
  chargerInfo?: {
    available: number;
    total: number;
    types: string[];
  };
  // Restaurant/Cafe specific
  cuisine?: string[];
  priceLevel?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  onNavigate?: () => void;
  onCall?: () => void;
  className?: string;
}

export function NearbyServiceCard({
  type,
  name,
  address,
  distance,
  duration,
  isOpen,
  rating,
  phone,
  fuelPrices,
  chargerInfo,
  cuisine,
  priceLevel,
  onClick,
  onNavigate,
  onCall,
  className,
}: NearbyServiceCardProps) {
  const config = serviceConfigs[type];
  const Icon = config.icon;

  return (
    <Card
      variant="outline"
      padding="default"
      className={cn('cursor-pointer hover:shadow-md', className)}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
            config.bgColor
          )}
        >
          <Icon className={cn('h-6 w-6', config.color)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="truncate font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </h4>
            {isOpen !== undefined && (
              <Badge
                variant={isOpen ? 'success' : 'error'}
                size="sm"
              >
                {isOpen ? 'Open' : 'Closed'}
              </Badge>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="flex items-center">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {formatDistance(distance)}
            </span>
            {duration && (
              <span className="flex items-center">
                <Clock className="mr-1 h-3.5 w-3.5" />
                {duration} min
              </span>
            )}
            {rating && (
              <span className="flex items-center text-amber-500">
                <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-slate-400">{address}</p>

          {/* Gas station prices */}
          {fuelPrices && fuelPrices.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {fuelPrices.map((fuel, i) => (
                <Badge key={i} variant="secondary" size="sm">
                  {fuel.type}: ${fuel.price.toFixed(2)}
                </Badge>
              ))}
            </div>
          )}

          {/* EV charger info */}
          {chargerInfo && (
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant={chargerInfo.available > 0 ? 'success' : 'error'}
                size="sm"
              >
                {chargerInfo.available}/{chargerInfo.total} Available
              </Badge>
              {chargerInfo.types.map((type, i) => (
                <Badge key={i} variant="secondary" size="sm">
                  {type}
                </Badge>
              ))}
            </div>
          )}

          {/* Restaurant/Cafe info */}
          {cuisine && cuisine.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {cuisine.slice(0, 2).map((c, i) => (
                <Badge key={i} variant="secondary" size="sm">
                  {c}
                </Badge>
              ))}
              {priceLevel && (
                <span className="text-sm text-slate-400">
                  {'$'.repeat(priceLevel)}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {onNavigate && (
              <button
                className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
              >
                <Navigation className="h-3.5 w-3.5" />
                Navigate
              </button>
            )}
            {onCall && phone && (
              <button
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall();
                }}
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Compact Service List Item
export interface NearbyServiceItemProps {
  type: ServiceType;
  name: string;
  distance: number;
  isOpen?: boolean;
  rating?: number;
  onClick?: () => void;
  className?: string;
}

export function NearbyServiceItem({
  type,
  name,
  distance,
  isOpen,
  rating,
  onClick,
  className,
}: NearbyServiceItemProps) {
  const config = serviceConfigs[type];
  const Icon = config.icon;

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
          config.bgColor
        )}
      >
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium text-slate-900 dark:text-slate-100">
            {name}
          </span>
          {rating && (
            <span className="flex items-center text-xs text-amber-500">
              ★ {rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{formatDistance(distance)}</span>
          {isOpen !== undefined && (
            <span className={isOpen ? 'text-emerald-500' : 'text-red-500'}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-slate-400" />
    </button>
  );
}

// Quick Service Filter Buttons
export interface ServiceFilterProps {
  services: ServiceType[];
  selected?: ServiceType[];
  onChange?: (selected: ServiceType[]) => void;
  className?: string;
}

export function ServiceFilter({
  services,
  selected = [],
  onChange,
  className,
}: ServiceFilterProps) {
  const toggleService = (service: ServiceType) => {
    if (selected.includes(service)) {
      onChange?.(selected.filter((s) => s !== service));
    } else {
      onChange?.([...selected, service]);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {services.map((service) => {
        const config = serviceConfigs[service];
        const Icon = config.icon;
        const isSelected = selected.includes(service);

        return (
          <button
            key={service}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isSelected
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            )}
            onClick={() => toggleService(service)}
          >
            <Icon className="h-4 w-4" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
