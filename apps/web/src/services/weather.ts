// Weather service using OpenWeatherMap API (free tier)
// Get your API key at: https://openweathermap.org/api

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  clouds: number;
  condition: WeatherCondition;
  sunrise: Date;
  sunset: Date;
  timezone: number;
  updatedAt: Date;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  tempMorn: number;
  tempDay: number;
  tempEve: number;
  tempNight: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  pop: number;
  sunrise: Date;
  sunset: Date;
}

export interface WeatherAlert {
  event: string;
  sender: string;
  start: Date;
  end: Date;
  description: string;
  tags: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
}

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

class WeatherService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || OPENWEATHER_API_KEY;
  }

  // Get coordinates from city name
  async geocode(city: string): Promise<GeoLocation[]> {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }));
  }

  // Get city name from coordinates
  async reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
    const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) return null;

    return {
      name: data[0].name,
      lat: data[0].lat,
      lon: data[0].lon,
      country: data[0].country,
      state: data[0].state,
    };
  }

  // Get current weather
  async getCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<CurrentWeather> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      clouds: data.clouds.all,
      condition: data.weather[0],
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timezone: data.timezone,
      updatedAt: new Date(),
    };
  }

  // Get 5-day forecast (3-hour intervals) - available in free tier
  async getForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<HourlyForecast[]> {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.list.map((item: any) => ({
      time: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      condition: item.weather[0],
      pop: item.pop * 100, // Convert to percentage
    }));
  }

  // Get One Call API data (requires One Call API subscription for v3.0)
  // This method is for reference - use getForecast for free tier
  async getOneCallWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData | null> {
    // One Call API 3.0 requires a subscription
    // For free tier, we combine current weather + forecast
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon, units),
        this.getForecast(lat, lon, units),
      ]);

      // Process forecast into daily data
      const dailyMap = new Map<string, DailyForecast>();
      
      forecast.forEach((item) => {
        const dateKey = item.time.toISOString().split('T')[0];
        
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            date: new Date(dateKey),
            tempMin: item.temperature,
            tempMax: item.temperature,
            tempMorn: 0,
            tempDay: 0,
            tempEve: 0,
            tempNight: 0,
            humidity: item.humidity,
            windSpeed: item.windSpeed,
            condition: item.condition,
            pop: item.pop,
            sunrise: current.sunrise,
            sunset: current.sunset,
          });
        } else {
          const day = dailyMap.get(dateKey)!;
          day.tempMin = Math.min(day.tempMin, item.temperature);
          day.tempMax = Math.max(day.tempMax, item.temperature);
          day.pop = Math.max(day.pop, item.pop);
          
          // Assign temps based on time of day
          const hour = item.time.getHours();
          if (hour >= 6 && hour < 12) day.tempMorn = item.temperature;
          else if (hour >= 12 && hour < 18) day.tempDay = item.temperature;
          else if (hour >= 18 && hour < 21) day.tempEve = item.temperature;
          else day.tempNight = item.temperature;
        }
      });

      return {
        current,
        hourly: forecast.slice(0, 24), // Next 24 hours (8 items at 3-hour intervals)
        daily: Array.from(dailyMap.values()),
        alerts: [], // Alerts not available in free tier
      };
    } catch (error) {
      console.error('Failed to get weather data:', error);
      return null;
    }
  }

  // Get weather icon URL
  getIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
  }

  // Convert wind direction degrees to cardinal direction
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  // Get weather condition category for styling
  getConditionCategory(conditionId: number): 'clear' | 'clouds' | 'rain' | 'snow' | 'storm' | 'atmosphere' {
    if (conditionId >= 200 && conditionId < 300) return 'storm';
    if (conditionId >= 300 && conditionId < 600) return 'rain';
    if (conditionId >= 600 && conditionId < 700) return 'snow';
    if (conditionId >= 700 && conditionId < 800) return 'atmosphere';
    if (conditionId === 800) return 'clear';
    return 'clouds';
  }

  // Get packing suggestions based on weather
  getPackingSuggestions(weather: WeatherData): string[] {
    const suggestions: string[] = [];
    const avgTemp = weather.daily.reduce((sum, d) => sum + d.tempDay, 0) / weather.daily.length;
    const hasRain = weather.daily.some(d => d.pop > 30);
    const hasSnow = weather.daily.some(d => d.condition.main === 'Snow');
    const isWindy = weather.daily.some(d => d.windSpeed > 10);

    // Temperature-based suggestions
    if (avgTemp < 5) {
      suggestions.push('Heavy winter coat', 'Thermal layers', 'Warm hat and gloves', 'Insulated boots');
    } else if (avgTemp < 15) {
      suggestions.push('Light jacket or sweater', 'Long pants', 'Closed-toe shoes');
    } else if (avgTemp < 25) {
      suggestions.push('Light layers', 'Mix of short and long sleeves', 'Comfortable walking shoes');
    } else {
      suggestions.push('Light, breathable clothing', 'Shorts and t-shirts', 'Sandals', 'Sun hat');
    }

    // Weather condition suggestions
    if (hasRain) {
      suggestions.push('Rain jacket or umbrella', 'Waterproof bag');
    }
    if (hasSnow) {
      suggestions.push('Snow boots', 'Waterproof gloves');
    }
    if (isWindy) {
      suggestions.push('Windbreaker');
    }

    // Always recommend
    suggestions.push('Sunscreen', 'Reusable water bottle');

    return suggestions;
  }

  // Get best times for outdoor activities
  getBestActivityTimes(weather: WeatherData): { activity: string; bestTimes: string[] }[] {
    const activities = [
      {
        activity: 'Outdoor Sightseeing',
        bestTimes: weather.hourly
          .filter(h => h.condition.main === 'Clear' || h.condition.main === 'Clouds')
          .filter(h => h.temperature > 10 && h.temperature < 30)
          .slice(0, 3)
          .map(h => h.time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })),
      },
      {
        activity: 'Photography',
        bestTimes: ['Golden hour (sunrise)', 'Golden hour (sunset)'],
      },
      {
        activity: 'Beach Activities',
        bestTimes: weather.hourly
          .filter(h => h.temperature > 22 && h.condition.main === 'Clear')
          .slice(0, 3)
          .map(h => h.time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })),
      },
    ];

    return activities.filter(a => a.bestTimes.length > 0);
  }
}

// Export singleton instance
export const weatherService = new WeatherService();

// Export class for custom instances
export { WeatherService };
