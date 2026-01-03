import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');
  const units = searchParams.get('units') || 'metric';

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'Weather API not configured' },
      { status: 500 }
    );
  }

  try {
    let coordinates = { lat: parseFloat(lat || '0'), lon: parseFloat(lon || '0') };

    // If city is provided, geocode it first
    if (city && (!lat || !lon)) {
      const geoUrl = `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to geocode city' },
          { status: 400 }
        );
      }

      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }

      coordinates = { lat: geoData[0].lat, lon: geoData[0].lon };
    }

    // Fetch current weather and forecast in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`),
      fetch(`${BASE_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: 500 }
      );
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    // Process current weather
    const current = {
      location: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      windDirection: currentData.wind.deg,
      pressure: currentData.main.pressure,
      visibility: Math.round(currentData.visibility / 1000),
      clouds: currentData.clouds.all,
      condition: {
        id: currentData.weather[0].id,
        main: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      sunrise: new Date(currentData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(currentData.sys.sunset * 1000).toISOString(),
      timezone: currentData.timezone,
      updatedAt: new Date().toISOString(),
    };

    // Process hourly forecast (next 24 hours - 8 items at 3-hour intervals)
    const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toISOString(),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      condition: {
        id: item.weather[0].id,
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      },
      pop: Math.round(item.pop * 100),
    }));

    // Process daily forecast (aggregate by day)
    const dailyMap = new Map<string, any>();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          temps: [item.main.temp],
          humidity: [item.main.humidity],
          windSpeed: [item.wind.speed],
          conditions: [item.weather[0]],
          pop: [item.pop],
        });
      } else {
        const day = dailyMap.get(dateKey);
        day.temps.push(item.main.temp);
        day.humidity.push(item.main.humidity);
        day.windSpeed.push(item.wind.speed);
        day.conditions.push(item.weather[0]);
        day.pop.push(item.pop);
      }
    });

    const daily = Array.from(dailyMap.values()).map((day) => ({
      date: day.date,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length),
      condition: day.conditions[Math.floor(day.conditions.length / 2)], // Use midday condition
      pop: Math.round(Math.max(...day.pop) * 100),
    }));

    // Generate packing suggestions
    const avgTemp = daily.reduce((sum, d) => sum + d.tempMax, 0) / daily.length;
    const hasRain = daily.some(d => d.pop > 30);
    const suggestions = getPackingSuggestions(avgTemp, hasRain, units === 'imperial');

    // Get best activity times
    const activityTimes = getBestActivityTimes(hourly);

    return NextResponse.json({
      current,
      hourly,
      daily,
      suggestions,
      activityTimes,
      coordinates,
      units,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

function getPackingSuggestions(avgTemp: number, hasRain: boolean, isFahrenheit: boolean): string[] {
  const suggestions: string[] = [];
  
  // Convert to Celsius for comparison if needed
  const tempC = isFahrenheit ? (avgTemp - 32) * 5/9 : avgTemp;

  if (tempC < 5) {
    suggestions.push('Heavy winter coat', 'Thermal layers', 'Warm hat and gloves', 'Insulated boots');
  } else if (tempC < 15) {
    suggestions.push('Light jacket or sweater', 'Long pants', 'Closed-toe shoes');
  } else if (tempC < 25) {
    suggestions.push('Light layers', 'Mix of short and long sleeves', 'Comfortable walking shoes');
  } else {
    suggestions.push('Light, breathable clothing', 'Shorts and t-shirts', 'Sandals', 'Sun hat');
  }

  if (hasRain) {
    suggestions.push('Rain jacket or umbrella', 'Waterproof bag');
  }

  suggestions.push('Sunscreen', 'Reusable water bottle');

  return suggestions;
}

function getBestActivityTimes(hourly: any[]): { activity: string; times: string[] }[] {
  const goodWeatherHours = hourly.filter(h => 
    h.condition.main === 'Clear' || h.condition.main === 'Clouds'
  );

  const warmHours = hourly.filter(h => h.temperature > 15 && h.temperature < 30);

  return [
    {
      activity: 'Outdoor Sightseeing',
      times: goodWeatherHours.slice(0, 3).map(h => 
        new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      ),
    },
    {
      activity: 'Photography',
      times: ['Early morning', 'Golden hour (sunset)'],
    },
    {
      activity: 'Walking Tours',
      times: warmHours.slice(0, 2).map(h => 
        new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      ),
    },
  ];
}
