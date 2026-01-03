import { NextRequest, NextResponse } from 'next/server';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

interface POIResult {
  id: number;
  name: string;
  type: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  distance?: number;
}

// Category mappings for Overpass queries
const CATEGORY_MAPPINGS: Record<string, string[]> = {
  restaurant: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe'],
  hotel: ['tourism=hotel', 'tourism=hostel', 'tourism=guest_house', 'tourism=motel'],
  attraction: ['tourism=attraction', 'tourism=museum', 'tourism=viewpoint', 'historic=monument'],
  gas_station: ['amenity=fuel'],
  ev_charging: ['amenity=charging_station'],
  parking: ['amenity=parking'],
  atm: ['amenity=atm', 'amenity=bank'],
  pharmacy: ['amenity=pharmacy'],
  hospital: ['amenity=hospital', 'amenity=clinic'],
  supermarket: ['shop=supermarket', 'shop=convenience'],
  airport: ['aeroway=aerodrome'],
  train_station: ['railway=station'],
  bus_station: ['amenity=bus_station'],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const category = searchParams.get('category') || 'restaurant';
  const radius = parseInt(searchParams.get('radius') || '5000'); // meters
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    const categoryFilters = CATEGORY_MAPPINGS[category] || [`amenity=${category}`];
    
    // Build Overpass query
    const filterParts = categoryFilters.map(filter => {
      const [key, value] = filter.split('=');
      return `node["${key}"="${value}"](around:${radius},${lat},${lon});`;
    }).join('\n');

    const query = `
      [out:json][timeout:25];
      (
        ${filterParts}
      );
      out body ${limit};
    `;

    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch POI data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Process results
    const results: POIResult[] = data.elements.map((element: any) => {
      const tags = element.tags || {};
      const distance = calculateDistance(lat, lon, element.lat, element.lon);

      return {
        id: element.id,
        name: tags.name || tags.brand || 'Unknown',
        type: tags.amenity || tags.tourism || tags.shop || tags.aeroway || tags.railway || category,
        category,
        lat: element.lat,
        lon: element.lon,
        address: formatAddress(tags),
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
        openingHours: tags.opening_hours,
        distance: Math.round(distance),
      };
    });

    // Sort by distance
    results.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      center: { lat, lon },
      radius,
      category,
    });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function formatAddress(tags: Record<string, string>): string | undefined {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:postcode'],
    tags['addr:country'],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : undefined;
}
