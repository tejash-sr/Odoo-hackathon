'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  origin: string;
  destination: string;
  onRouteCalculated?: (data: { distance: number; duration: number; pois: POI[] }) => void;
}

interface Coordinates {
  lat: number;
  lon: number;
}

interface POI {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  emoji: string;
  color: string;
}

const CATEGORY_STYLES = {
  'Fuel Stations': { query: 'node[amenity=fuel]', color: '#f59e0b', emoji: '⛽' },
  'EV Stations': { query: 'node[amenity=charging_station]', color: '#22c55e', emoji: '⚡' },
  Restaurants: { query: 'node[amenity=restaurant]', color: '#fb923c', emoji: '🍽️' },
  Hotels: { query: 'node[amenity=hotel]', color: '#3b82f6', emoji: '🏨' },
  Restrooms: { query: 'node[amenity=toilets]', color: '#8b5cf6', emoji: '🚻' },
  Hospitals: { query: 'node[amenity=hospital]', color: '#ef4444', emoji: '🏥' },
};

// Haversine distance calculation
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Calculate distance from point to route polyline
function distanceToRoute(point: Coordinates, route: Coordinates[]): number {
  let minDist = Infinity;
  for (let i = 0; i < route.length - 1; i++) {
    const dist = distanceToSegment(point, route[i], route[i + 1]);
    minDist = Math.min(minDist, dist);
  }
  return minDist;
}

function distanceToSegment(p: Coordinates, a: Coordinates, b: Coordinates): number {
  const { lat, lon } = p;
  const { lat: lat1, lon: lon1 } = a;
  const { lat: lat2, lon: lon2 } = b;

  const A = lat - lat1;
  const B = lon - lon1;
  const C = lat2 - lat1;
  const D = lon2 - lon1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = lat1;
    yy = lon1;
  } else if (param > 1) {
    xx = lat2;
    yy = lon2;
  } else {
    xx = lat1 + param * C;
    yy = lon1 + param * D;
  }

  return getDistance(lat, lon, xx, yy);
}

export function RouteMapLeaflet({ origin, destination, onRouteCalculated }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Initialize map
      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      setMapReady(true);
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  useEffect(() => {
    const fetchRouteAndPOIs = async () => {
      if (!mapInstanceRef.current || !origin || !destination || !mapReady) return;

      try {
        setError(null);
        const map = mapInstanceRef.current;

        // Clear existing layers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        // Geocode origin and destination in parallel (MUCH FASTER)
        const [originData, destData] = await Promise.all([
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}&limit=1`,
            { headers: { 'Accept': 'application/json' } }
          ).then(res => res.json()),
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`,
            { headers: { 'Accept': 'application/json' } }
          ).then(res => res.json())
        ]);

        if (!originData[0]) throw new Error('Origin not found');
        if (!destData[0]) throw new Error('Destination not found');

        const originCoords: Coordinates = {
          lat: parseFloat(originData[0].lat),
          lon: parseFloat(originData[0].lon),
        };

        const destCoords: Coordinates = {
          lat: parseFloat(destData[0].lat),
          lon: parseFloat(destData[0].lon),
        };

        // Add origin marker (green)
        const originIcon = L.divIcon({
          html: '<div style="background-color: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([originCoords.lat, originCoords.lon], { icon: originIcon }).addTo(map);

        // Add destination marker (red)
        const destIcon = L.divIcon({
          html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([destCoords.lat, destCoords.lon], { icon: destIcon }).addTo(map);

        // Fetch route from OSRM
        const routeRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=geojson&alternatives=1&steps=false`,
          { cache: 'no-store' }
        );
        const routeData = await routeRes.json();

        if (routeData.code !== 'Ok' || !routeData.routes[0]) {
          throw new Error('Route not found');
        }

        const route = routeData.routes[0];
        const distance = route.distance; // meters
        const duration = route.duration; // seconds

        // Convert coordinates from [lon, lat] to [lat, lon] for Leaflet
        const routeCoords: Coordinates[] = route.geometry.coordinates.map(
          ([lon, lat]: number[]) => ({ lat, lon })
        );
        const leafletCoords: [number, number][] = routeCoords.map((c) => [c.lat, c.lon]);

        // Draw route polyline (blue)
        L.polyline(leafletCoords, {
          color: '#4F46E5',
          weight: 5,
          opacity: 0.7,
        }).addTo(map);

        // Fit map to route bounds
        const bounds = L.latLngBounds(leafletCoords);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Notify parent component with route info (POIs will be added later)
        if (onRouteCalculated) {
          onRouteCalculated({ distance, duration, pois: [] });
        }

        // Fetch POIs in the background (non-blocking)
        fetchPOIsAlongRoute(routeCoords, bounds.toBBoxString()).then((pois) => {
          // Add POI markers
          pois.forEach((poi) => {
            const poiIcon = L.divIcon({
              html: `<div style="background-color: ${poi.color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${poi.emoji}</div>`,
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            L.marker([poi.lat, poi.lon], { icon: poiIcon })
              .bindPopup(`<strong>${poi.category}</strong><br>${poi.name || 'Unnamed'}`)
              .addTo(map);
          });

          // Update parent component with POIs
          if (onRouteCalculated) {
            onRouteCalculated({ distance, duration, pois });
          }
        }).catch((err) => {
          console.error('Failed to load POIs:', err);
          // Route still works even if POIs fail
        });
      } catch (err) {
        console.error('Error fetching route:', err);
        setError(err instanceof Error ? err.message : 'Failed to load route');
      }
    };

    fetchRouteAndPOIs();
  }, [origin, destination, onRouteCalculated, mapReady]);

  async function fetchPOIsAlongRoute(
    route: Coordinates[],
    bbox: string
  ): Promise<POI[]> {
    const allPOIs: POI[] = [];

    // Build Overpass query for all categories with reduced timeout and fewer results
    const queries = Object.entries(CATEGORY_STYLES).map(
      ([_, style]) => style.query + `(${bbox})`
    );
    const overpassQuery = `[out:json][timeout:8];(${queries.join(';')};);out center 50;`;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error('Overpass API request failed');
      }
      
      const data = await response.json();

      // Process POIs
      data.elements?.forEach((element: any) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        if (!lat || !lon) return;

        // Determine category
        let category = '';
        let style = CATEGORY_STYLES['Fuel Stations'];

        if (element.tags?.amenity === 'fuel') {
          category = 'Fuel Stations';
          style = CATEGORY_STYLES['Fuel Stations'];
        } else if (element.tags?.amenity === 'charging_station') {
          category = 'EV Stations';
          style = CATEGORY_STYLES['EV Stations'];
        } else if (element.tags?.amenity === 'restaurant') {
          category = 'Restaurants';
          style = CATEGORY_STYLES['Restaurants'];
        } else if (element.tags?.amenity === 'hotel') {
          category = 'Hotels';
          style = CATEGORY_STYLES['Hotels'];
        } else if (element.tags?.amenity === 'toilets') {
          category = 'Restrooms';
          style = CATEGORY_STYLES['Restrooms'];
        } else if (element.tags?.amenity === 'hospital') {
          category = 'Hospitals';
          style = CATEGORY_STYLES['Hospitals'];
        }

        if (!category) return;

        // Filter by distance to route (within 1200m)
        const distToRoute = distanceToRoute({ lat, lon }, route);
        if (distToRoute <= 1200) {
          allPOIs.push({
            id: element.id?.toString() || '',
            name: element.tags?.name || '',
            category,
            lat,
            lon,
            emoji: style.emoji,
            color: style.color,
          });
        }
      });

      // Limit to 10 POIs per category for faster rendering
      const groupedPOIs: { [key: string]: POI[] } = {};
      allPOIs.forEach((poi) => {
        if (!groupedPOIs[poi.category]) groupedPOIs[poi.category] = [];
        if (groupedPOIs[poi.category].length < 10) {
          groupedPOIs[poi.category].push(poi);
        }
      });

      return Object.values(groupedPOIs).flat();
    } catch (err) {
      console.error('Error fetching POIs:', err);
      return [];
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
