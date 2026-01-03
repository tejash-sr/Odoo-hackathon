import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'Geocoding API not configured' },
      { status: 500 }
    );
  }

  try {
    // Forward geocoding (query to coordinates)
    if (query) {
      const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Geocoding failed' },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      const results = data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
        displayName: [item.name, item.state, item.country].filter(Boolean).join(', '),
      }));

      return NextResponse.json({ results });
    }

    // Reverse geocoding (coordinates to location)
    if (lat && lon) {
      const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Reverse geocoding failed' },
          { status: response.status }
        );
      }

      const data = await response.json();

      if (data.length === 0) {
        return NextResponse.json(
          { error: 'Location not found' },
          { status: 404 }
        );
      }

      const result = {
        name: data[0].name,
        lat: data[0].lat,
        lon: data[0].lon,
        country: data[0].country,
        state: data[0].state,
        displayName: [data[0].name, data[0].state, data[0].country].filter(Boolean).join(', '),
      };

      return NextResponse.json({ result });
    }

    return NextResponse.json(
      { error: 'Either query (q) or coordinates (lat, lon) are required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: 'Geocoding request failed' },
      { status: 500 }
    );
  }
}
