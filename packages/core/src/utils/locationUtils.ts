/**
 * Location and map utility functions
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
    Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(
  km: number,
  unit: 'km' | 'mi' = 'km'
): string {
  const distance = unit === 'mi' ? km * 0.621371 : km;
  
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    return unit === 'mi' 
      ? `${Math.round(meters * 3.28084)} ft`
      : `${meters} m`;
  }
  
  return `${distance.toFixed(1)} ${unit}`;
}

/**
 * Calculate bounding box from array of coordinates
 */
export function getBoundingBox(coordinates: Coordinates[]): BoundingBox {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate bounding box for empty coordinates array');
  }

  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  for (const coord of coordinates) {
    north = Math.max(north, coord.lat);
    south = Math.min(south, coord.lat);
    east = Math.max(east, coord.lng);
    west = Math.min(west, coord.lng);
  }

  return { north, south, east, west };
}

/**
 * Get center point of coordinates
 */
export function getCenter(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center for empty coordinates array');
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  };
}

/**
 * Calculate optimal zoom level for bounding box
 */
export function calculateZoomLevel(
  boundingBox: BoundingBox,
  mapWidth: number,
  mapHeight: number
): number {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  const latRad = (lat: number) => {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  };

  const zoom = (mapPx: number, worldPx: number, fraction: number) => {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  };

  const latFraction =
    (latRad(boundingBox.north) - latRad(boundingBox.south)) / Math.PI;
  const lngDiff = boundingBox.east - boundingBox.west;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

/**
 * Calculate estimated travel time
 */
export function estimateTravelTime(
  distance: number,
  mode: 'driving' | 'walking' | 'cycling' | 'transit'
): number {
  // Average speeds in km/h
  const speeds = {
    driving: 50,
    walking: 5,
    cycling: 15,
    transit: 30,
  };

  const speed = speeds[mode];
  return Math.round((distance / speed) * 60); // Returns minutes
}

/**
 * Format travel time for display
 */
export function formatTravelTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Check if coordinate is within bounding box
 */
export function isWithinBounds(
  coord: Coordinates,
  bounds: BoundingBox
): boolean {
  return (
    coord.lat >= bounds.south &&
    coord.lat <= bounds.north &&
    coord.lng >= bounds.west &&
    coord.lng <= bounds.east
  );
}

/**
 * Generate Google Maps URL for location
 */
export function getGoogleMapsUrl(
  coord: Coordinates,
  label?: string
): string {
  const query = label 
    ? encodeURIComponent(label)
    : `${coord.lat},${coord.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Generate Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): string {
  const originStr = `${origin.lat},${origin.lng}`;
  const destStr = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=${mode}`;
}

/**
 * Parse coordinates from string
 */
export function parseCoordinates(coordString: string): Coordinates | null {
  const match = coordString.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (!match) return null;
  
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  
  return { lat, lng };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  coord: Coordinates,
  precision: number = 6
): string {
  const latDir = coord.lat >= 0 ? 'N' : 'S';
  const lngDir = coord.lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(coord.lat).toFixed(precision)}°${latDir}, ${Math.abs(coord.lng).toFixed(precision)}°${lngDir}`;
}

/**
 * Sort locations by distance from a point
 */
export function sortByDistance<T extends { coordinates: Coordinates }>(
  items: T[],
  from: Coordinates
): T[] {
  return [...items].sort((a, b) => {
    const distA = calculateDistance(from, a.coordinates);
    const distB = calculateDistance(from, b.coordinates);
    return distA - distB;
  });
}
