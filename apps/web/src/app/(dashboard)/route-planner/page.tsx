'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Fuel,
  Coffee,
  Utensils,
  ParkingCircle,
  Building2,
  Bath,
  Banknote,
  ShieldAlert,
  Zap,
  Plus,
  X,
  Search,
  Route,
  Clock,
  ArrowRight,
  Layers,
  Settings,
  ChevronDown,
  GripVertical,
} from 'lucide-react';

// Dynamically import the Leaflet map to avoid SSR issues
const RouteMapLeaflet = dynamic(
  () => import('@/components/map/RouteMapLeaflet').then((mod) => mod.RouteMapLeaflet),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    )
  }
);

interface Waypoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'origin' | 'destination' | 'waypoint';
}

interface NearbyAmenity {
  id: string;
  name: string;
  type: string;
  distance: number;
  duration: number;
  address: string;
  rating?: number;
  isOpen?: boolean;
  lat: number;
  lng: number;
}

const amenityFilters = [
  { id: 'gas', icon: Fuel, label: 'Gas Stations', color: 'orange' },
  { id: 'ev', icon: Zap, label: 'EV Charging', color: 'emerald' },
  { id: 'parking', icon: ParkingCircle, label: 'Parking', color: 'blue' },
  { id: 'restaurant', icon: Utensils, label: 'Restaurants', color: 'red' },
  { id: 'cafe', icon: Coffee, label: 'Cafes', color: 'amber' },
  { id: 'restroom', icon: Bath, label: 'Restrooms', color: 'cyan' },
  { id: 'hospital', icon: Building2, label: 'Hospitals', color: 'rose' },
  { id: 'atm', icon: Banknote, label: 'ATMs', color: 'green' },
  { id: 'police', icon: ShieldAlert, label: 'Police', color: 'indigo' },
];

// Mock data for demonstration
const mockAmenities: NearbyAmenity[] = [
  { id: '1', name: 'Shell Gas Station', type: 'gas', distance: 2.4, duration: 5, address: '123 Main St', rating: 4.2, isOpen: true, lat: 35.6895, lng: 139.6917 },
  { id: '2', name: 'Starbucks Coffee', type: 'cafe', distance: 1.8, duration: 3, address: '456 Oak Ave', rating: 4.5, isOpen: true, lat: 35.6905, lng: 139.6927 },
  { id: '3', name: 'McDonald\'s', type: 'restaurant', distance: 3.2, duration: 7, address: '789 Pine Rd', rating: 3.8, isOpen: true, lat: 35.6915, lng: 139.6937 },
  { id: '4', name: 'City Parking Lot', type: 'parking', distance: 0.8, duration: 2, address: '321 Park St', rating: 4.0, isOpen: true, lat: 35.6885, lng: 139.6907 },
  { id: '5', name: 'EV SuperCharger', type: 'ev', distance: 4.5, duration: 10, address: '555 Electric Blvd', rating: 4.7, isOpen: true, lat: 35.6925, lng: 139.6947 },
];

export default function RoutePlannerPage() {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [waypoints, setWaypoints] = React.useState<Waypoint[]>([
    { id: '1', name: 'Current Location', address: '', lat: 35.6762, lng: 139.6503, type: 'origin' },
    { id: '2', name: '', address: '', lat: 0, lng: 0, type: 'destination' },
  ]);
  const [activeFilters, setActiveFilters] = React.useState<string[]>(['gas', 'restaurant', 'parking']);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAmenity, setSelectedAmenity] = React.useState<NearbyAmenity | null>(null);
  const [routeInfo, setRouteInfo] = React.useState({
    distance: 0,
    duration: 0,
    stops: 0,
  });
  const [nearbyAmenities, setNearbyAmenities] = React.useState<NearbyAmenity[]>([]);

  const handleRouteCalculated = React.useCallback((data: { distance: number; duration: number; pois: any[] }) => {
    setRouteInfo({
      distance: data.distance / 1000, // convert to km
      duration: Math.round(data.duration / 60), // convert to minutes
      stops: data.pois.length,
    });

    // Convert POIs to amenities
    const amenities: NearbyAmenity[] = data.pois.map((poi, index) => ({
      id: poi.id || index.toString(),
      name: poi.name || 'Unnamed',
      type: poi.category.toLowerCase().replace(' ', '-'),
      distance: 0,
      duration: 0,
      address: poi.name || 'Unknown address',
      lat: poi.lat,
      lng: poi.lon,
    }));
    setNearbyAmenities(amenities);
  }, []);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const addWaypoint = () => {
    const newId = Date.now().toString();
    setWaypoints((prev) => [
      ...prev.slice(0, -1),
      { id: newId, name: '', address: '', lat: 0, lng: 0, type: 'waypoint' },
      prev[prev.length - 1],
    ]);
  };

  const removeWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
  };

  const filteredAmenities = nearbyAmenities.filter(
    (amenity) => {
      const typeMatch = activeFilters.some(filter => 
        amenity.type.includes(filter) || 
        amenity.name.toLowerCase().includes(filter)
      );
      return typeMatch;
    }
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full overflow-y-auto border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:w-96 lg:border-b-0 lg:border-r">
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Route Planner
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Plan your route and discover amenities along the way
            </p>
          </div>

          {/* Waypoints */}
          <div className="space-y-3 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Origin
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Navigation className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Enter origin (e.g., New York)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Destination
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination (e.g., Boston)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="rounded-xl bg-gradient-to-r from-primary-500 to-violet-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              <span className="font-semibold">Route Overview</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{routeInfo.distance.toFixed(1)}</p>
                <p className="text-xs text-white/70">km</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.floor(routeInfo.duration / 60)}h {routeInfo.duration % 60}m</p>
                <p className="text-xs text-white/70">duration</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{routeInfo.stops}</p>
                <p className="text-xs text-white/70">stops</p>
              </div>
            </div>
          </div>

          {/* Amenity Filters */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Layers className="h-4 w-4" />
              Along the Route
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {amenityFilters.map((filter) => {
                const isActive = activeFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? `bg-${filter.color}-100 text-${filter.color}-700 dark:bg-${filter.color}-900/30 dark:text-${filter.color}-400`
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    <filter.icon className="h-3.5 w-3.5" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nearby Amenities List */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Nearby ({filteredAmenities.length})
              </h3>
              <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Sort by distance
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {filteredAmenities.map((amenity) => {
                const filter = amenityFilters.find((f) => f.id === amenity.type);
                const Icon = filter?.icon || MapPin;
                return (
                  <motion.button
                    key={amenity.id}
                    onClick={() => setSelectedAmenity(amenity)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                      selectedAmenity?.id === amenity.id
                        ? 'bg-primary-50 ring-2 ring-primary-500 dark:bg-primary-900/20'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-${filter?.color}-100 text-${filter?.color}-600 dark:bg-${filter?.color}-900/30 dark:text-${filter?.color}-400`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                          {amenity.name}
                        </p>
                        {amenity.isOpen && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            Open
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                        {amenity.address}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {amenity.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {amenity.duration} min
                        </span>
                        {amenity.rating && (
                          <span className="flex items-center gap-1">
                            ⭐ {amenity.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-300 dark:text-slate-600" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-800">
        <div className="relative h-full">
          {/* Route Map */}
          {origin && destination ? (
            <RouteMapLeaflet 
              origin={origin}
              destination={destination}
              onRouteCalculated={handleRouteCalculated}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <div className="text-center">
                <MapPin className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
                  Interactive Map
                </p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Add origin and destination to see the route
                </p>
              </div>
            </div>
          )}

          {/* Selected Amenity Panel */}
          {selectedAmenity && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900 lg:left-auto lg:right-4 lg:w-80"
            >
              <button
                onClick={() => setSelectedAmenity(null)}
                className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {amenityFilters.find((f) => f.id === selectedAmenity.type)?.icon && (
                    <Fuel className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {selectedAmenity.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedAmenity.address}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02]">
                  <Navigation className="h-4 w-4" />
                  Navigate
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  <Plus className="h-4 w-4" />
                  Add Stop
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
