'use client';

import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteMapProps {
  origin?: string;
  destination?: string;
  height?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function RouteMap({ origin, destination, height = '400px' }: RouteMapProps) {
  const [originCoords, setOriginCoords] = useState<Coordinates | null>(null);
  const [destCoords, setDestCoords] = useState<Coordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geocode a place name to coordinates using Nominatim
  const geocodePlace = async (placeName: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  // Get route between two coordinates using OSRM
  const getRoute = async (start: Coordinates, end: Coordinates) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry;
      }
      return null;
    } catch (err) {
      console.error('Routing error:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (!origin || !destination) {
        setError('Please provide both origin and destination');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Geocode both places
        const [originResult, destResult] = await Promise.all([
          geocodePlace(origin),
          geocodePlace(destination),
        ]);

        if (!originResult || !destResult) {
          setError('Could not find one or both locations');
          setLoading(false);
          return;
        }

        setOriginCoords(originResult);
        setDestCoords(destResult);

        // Get route between them
        const route = await getRoute(originResult, destResult);
        if (route) {
          setRouteGeometry(route);
        } else {
          setError('Could not calculate route');
        }
      } catch (err) {
        setError('Error loading route');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  // Calculate center and zoom based on origin and destination
  const getViewState = () => {
    if (originCoords && destCoords) {
      const centerLat = (originCoords.latitude + destCoords.latitude) / 2;
      const centerLng = (originCoords.longitude + destCoords.longitude) / 2;
      
      // Calculate approximate zoom based on distance
      const latDiff = Math.abs(originCoords.latitude - destCoords.latitude);
      const lngDiff = Math.abs(originCoords.longitude - destCoords.longitude);
      const maxDiff = Math.max(latDiff, lngDiff);
      
      let zoom = 10;
      if (maxDiff > 10) zoom = 4;
      else if (maxDiff > 5) zoom = 5;
      else if (maxDiff > 2) zoom = 6;
      else if (maxDiff > 1) zoom = 7;
      else if (maxDiff > 0.5) zoom = 8;
      else if (maxDiff > 0.2) zoom = 9;

      return {
        longitude: centerLng,
        latitude: centerLat,
        zoom,
      };
    }

    // Default to India
    return {
      longitude: 78.9629,
      latitude: 20.5937,
      zoom: 4,
    };
  };

  const routeLayer = {
    id: 'route',
    type: 'line' as const,
    paint: {
      'line-color': '#4F46E5',
      'line-width': 4,
      'line-opacity': 0.8,
    },
  };

  return (
    <div style={{ width: '100%', height }} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {error ? (
        <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800">
          <div className="text-center p-6">
            <MapPin className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading route...</p>
          </div>
        </div>
      ) : (
        <Map
          {...getViewState()}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          
          {/* Origin Marker */}
          {originCoords && (
            <Marker
              longitude={originCoords.longitude}
              latitude={originCoords.latitude}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded shadow text-xs font-medium mt-1">
                  {origin}
                </div>
              </div>
            </Marker>
          )}

          {/* Destination Marker */}
          {destCoords && (
            <Marker
              longitude={destCoords.longitude}
              latitude={destCoords.latitude}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="bg-red-500 text-white rounded-full p-2 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded shadow text-xs font-medium mt-1">
                  {destination}
                </div>
              </div>
            </Marker>
          )}

          {/* Route Line */}
          {routeGeometry && (
            <Source id="route" type="geojson" data={{ type: 'Feature', geometry: routeGeometry, properties: {} }}>
              <Layer {...routeLayer} />
            </Source>
          )}
        </Map>
      )}
    </div>
  );
}
