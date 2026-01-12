import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import {
  Navigation,
  MapPin,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Locate,
  Route,
  Clock,
  Car,
  Footprints,
  Bike,
  Bus,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Construction,
  CloudRain,
} from 'lucide-react';

// Map Container Component
export interface MapContainerProps {
  children?: React.ReactNode;
  className?: string;
  height?: string;
  loading?: boolean;
  error?: string;
}

export function MapContainer({
  children,
  className,
  height = '400px',
  loading = false,
  error,
}: MapContainerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800',
        className
      )}
      style={{ height }}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm dark:bg-slate-800/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            <span className="text-sm text-slate-500">Loading map...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// Map Controls
export interface MapControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  onFullscreen?: () => void;
  onLayerToggle?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

const positionStyles = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export function MapControls({
  position = 'top-right',
  onZoomIn,
  onZoomOut,
  onLocate,
  onFullscreen,
  onLayerToggle,
  isFullscreen = false,
  className,
}: MapControlsProps) {
  return (
    <div
      className={cn(
        'absolute z-20 flex flex-col gap-2',
        positionStyles[position],
        className
      )}
    >
      <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-900">
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onZoomIn}
        >
          <Plus className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="h-px bg-slate-200 dark:bg-slate-700" />
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onZoomOut}
        >
          <Minus className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      <button
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
        onClick={onLocate}
      >
        <Locate className="h-5 w-5 text-primary-500" />
      </button>

      <button
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
        onClick={onLayerToggle}
      >
        <Layers className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      </button>

      <button
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
        onClick={onFullscreen}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        ) : (
          <Maximize2 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        )}
      </button>
    </div>
  );
}

// Map Marker
export interface MapMarkerProps {
  type: 'destination' | 'hotel' | 'restaurant' | 'attraction' | 'current' | 'waypoint';
  label?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const markerStyles = {
  destination: 'bg-primary-500',
  hotel: 'bg-violet-500',
  restaurant: 'bg-orange-500',
  attraction: 'bg-amber-500',
  current: 'bg-blue-500',
  waypoint: 'bg-slate-500',
};

export function MapMarker({
  type,
  label,
  selected = false,
  onClick,
  className,
}: MapMarkerProps) {
  return (
    <div
      className={cn(
        'group relative cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform',
          markerStyles[type],
          selected && 'scale-125 ring-4 ring-white'
        )}
      >
        <MapPin className="h-5 w-5 text-white" />
      </div>
      {label && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </div>
      )}
      {type === 'current' && (
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/50" />
      )}
    </div>
  );
}

// Route Summary Card
export interface RouteSummaryProps {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  mode: 'driving' | 'walking' | 'cycling' | 'transit';
  traffic?: 'light' | 'moderate' | 'heavy';
  steps?: number;
  onStartNavigation?: () => void;
  onClose?: () => void;
  className?: string;
}

const modeIcons = {
  driving: Car,
  walking: Footprints,
  cycling: Bike,
  transit: Bus,
};

const trafficColors = {
  light: 'text-emerald-500',
  moderate: 'text-amber-500',
  heavy: 'text-red-500',
};

export function RouteSummary({
  origin,
  destination,
  distance,
  duration,
  mode,
  traffic,
  steps,
  onStartNavigation,
  onClose,
  className,
}: RouteSummaryProps) {
  const ModeIcon = modeIcons[mode];

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <ModeIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Route Overview
            </h3>
            <p className="text-sm text-slate-500">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} directions
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {origin}
          </span>
        </div>
        <div className="ml-1.5 h-6 border-l-2 border-dashed border-slate-300 dark:border-slate-600" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {destination}
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
          <div className="text-xs text-slate-500">Distance</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {distance}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
          <div className="text-xs text-slate-500">Duration</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {duration}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
          <div className="text-xs text-slate-500">Steps</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {steps || '-'}
          </div>
        </div>
      </div>

      {traffic && mode === 'driving' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <Car className={cn('h-5 w-5', trafficColors[traffic])} />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Traffic:{' '}
            <span className={cn('font-medium', trafficColors[traffic])}>
              {traffic.charAt(0).toUpperCase() + traffic.slice(1)}
            </span>
          </span>
        </div>
      )}

      {onStartNavigation && (
        <Button
          variant="primary"
          className="w-full"
          onClick={onStartNavigation}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Start Navigation
        </Button>
      )}
    </Card>
  );
}

// Turn-by-Turn Directions
export interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
}

export interface TurnByTurnProps {
  steps: DirectionStep[];
  currentStep?: number;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function TurnByTurn({
  steps,
  currentStep = 0,
  expanded = false,
  onToggle,
  className,
}: TurnByTurnProps) {
  const displaySteps = expanded ? steps : steps.slice(0, 3);

  return (
    <Card className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Directions
        </h3>
        <Badge variant="secondary">
          {steps.length} steps
        </Badge>
      </div>

      <div className="space-y-3">
        {displaySteps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3 rounded-lg p-3 transition-colors',
              index === currentStep
                ? 'bg-primary-50 dark:bg-primary-900/20'
                : 'bg-slate-50 dark:bg-slate-800'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                index === currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              )}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {step.instruction}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span>{step.distance}</span>
                <span>•</span>
                <span>{step.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {steps.length > 3 && (
        <button
          className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          onClick={onToggle}
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show {steps.length - 3} more steps <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </Card>
  );
}

// Traffic Alert Component
export interface TrafficAlertProps {
  type: 'traffic' | 'construction' | 'weather' | 'accident';
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high';
  eta_impact?: string;
  onDismiss?: () => void;
  className?: string;
}

const alertIcons = {
  traffic: Car,
  construction: Construction,
  weather: CloudRain,
  accident: AlertCircle,
};

const severityStyles = {
  low: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
  medium: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20',
  high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
};

const severityIconColors = {
  low: 'text-amber-500',
  medium: 'text-orange-500',
  high: 'text-red-500',
};

export function TrafficAlert({
  type,
  title,
  description,
  severity,
  eta_impact,
  onDismiss,
  className,
}: TrafficAlertProps) {
  const Icon = alertIcons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        severityStyles[severity],
        className
      )}
    >
      <Icon
        className={cn('h-5 w-5 flex-shrink-0', severityIconColors[severity])}
      />
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
        {eta_impact && (
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            +{eta_impact} to your trip
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          className="text-slate-400 hover:text-slate-600"
          onClick={onDismiss}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// Layer Selector
export interface MapLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface LayerSelectorProps {
  layers: MapLayer[];
  onToggle: (layerId: string) => void;
  className?: string;
}

export function LayerSelector({
  layers,
  onToggle,
  className,
}: LayerSelectorProps) {
  return (
    <Card className={cn('', className)}>
      <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
        Map Layers
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {layers.map((layer) => (
          <button
            key={layer.id}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 transition-colors',
              layer.active
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
            )}
            onClick={() => onToggle(layer.id)}
          >
            {layer.icon}
            <span
              className={cn(
                'text-sm font-medium',
                layer.active
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {layer.name}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
