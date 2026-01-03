'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Eye,
  Umbrella,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';

interface WeatherData {
  location: string;
  country: string;
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
    icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm';
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm';
  }[];
  hourly: {
    time: string;
    temp: number;
    icon: 'sun' | 'cloud' | 'rain';
  }[];
  alerts?: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  astro: {
    sunrise: string;
    sunset: string;
    moonPhase: string;
  };
}

const mockWeatherData: WeatherData = {
  location: 'Tokyo',
  country: 'Japan',
  current: {
    temp: 18,
    feelsLike: 16,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 4,
    icon: 'cloud',
  },
  forecast: [
    { date: '2024-03-15', high: 20, low: 12, condition: 'Sunny', precipitation: 0, icon: 'sun' },
    { date: '2024-03-16', high: 18, low: 11, condition: 'Cloudy', precipitation: 20, icon: 'cloud' },
    { date: '2024-03-17', high: 15, low: 9, condition: 'Rain', precipitation: 80, icon: 'rain' },
    { date: '2024-03-18', high: 16, low: 10, condition: 'Cloudy', precipitation: 30, icon: 'cloud' },
    { date: '2024-03-19', high: 19, low: 12, condition: 'Sunny', precipitation: 5, icon: 'sun' },
    { date: '2024-03-20', high: 21, low: 13, condition: 'Sunny', precipitation: 0, icon: 'sun' },
    { date: '2024-03-21', high: 20, low: 12, condition: 'Partly Cloudy', precipitation: 10, icon: 'cloud' },
  ],
  hourly: [
    { time: '12:00', temp: 18, icon: 'cloud' },
    { time: '13:00', temp: 19, icon: 'cloud' },
    { time: '14:00', temp: 20, icon: 'sun' },
    { time: '15:00', temp: 20, icon: 'sun' },
    { time: '16:00', temp: 19, icon: 'sun' },
    { time: '17:00', temp: 18, icon: 'cloud' },
    { time: '18:00', temp: 17, icon: 'cloud' },
    { time: '19:00', temp: 16, icon: 'cloud' },
  ],
  alerts: [
    {
      type: 'Rain Advisory',
      message: 'Heavy rainfall expected on March 17th. Consider indoor activities.',
      severity: 'medium',
    },
  ],
  astro: {
    sunrise: '5:52 AM',
    sunset: '5:48 PM',
    moonPhase: 'Waxing Crescent',
  },
};

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: Cloud,
  storm: CloudRain,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = React.useState('tokyo');
  const [unit, setUnit] = React.useState<'C' | 'F'>('C');

  const convertTemp = (temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  const WeatherIcon = weatherIcons[mockWeatherData.current.icon];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 px-4 pb-32 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Weather Intelligence</h1>
              <p className="mt-1 text-sky-100">Plan activities based on weather forecasts</p>
            </div>
            <div className="flex gap-2">
              {/* Unit Toggle */}
              <div className="flex rounded-xl bg-white/10 p-1">
                <button
                  onClick={() => setUnit('C')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    unit === 'C'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setUnit('F')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    unit === 'F'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  °F
                </button>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Location Selector */}
          <div className="mt-6 flex items-center gap-4">
            <div className="relative">
              <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white backdrop-blur-sm">
                <MapPin className="h-4 w-4" />
                <span>{mockWeatherData.location}, {mockWeatherData.country}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <WeatherIcon className="h-14 w-14 text-white" />
              </div>
              <div>
                <p className="text-6xl font-light text-white">
                  {convertTemp(mockWeatherData.current.temp)}°
                </p>
                <p className="mt-1 text-lg text-sky-100">
                  {mockWeatherData.current.condition}
                </p>
                <p className="text-sm text-sky-200">
                  Feels like {convertTemp(mockWeatherData.current.feelsLike)}°
                </p>
              </div>
            </div>

            {/* Current Stats */}
            <div className="hidden grid-cols-2 gap-4 md:grid">
              {[
                { icon: Droplets, label: 'Humidity', value: `${mockWeatherData.current.humidity}%` },
                { icon: Wind, label: 'Wind', value: `${mockWeatherData.current.windSpeed} km/h` },
                { icon: Eye, label: 'Visibility', value: `${mockWeatherData.current.visibility} km` },
                { icon: ThermometerSun, label: 'UV Index', value: mockWeatherData.current.uvIndex.toString() },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <stat.icon className="h-5 w-5 text-sky-200" />
                  <div>
                    <p className="text-xs text-sky-200">{stat.label}</p>
                    <p className="font-semibold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto -mt-20 max-w-6xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Hourly Forecast */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Today's Forecast
            </h2>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {mockWeatherData.hourly.map((hour) => {
                const Icon = weatherIcons[hour.icon];
                return (
                  <div
                    key={hour.time}
                    className="flex flex-col items-center rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {hour.time}
                    </p>
                    <Icon className="my-2 h-8 w-8 text-sky-500" />
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {convertTemp(hour.temp)}°
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sun & Moon */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sun & Moon
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Sunrise className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sunrise</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {mockWeatherData.astro.sunrise}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                    <Sunset className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sunset</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {mockWeatherData.astro.sunset}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <Moon className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Moon Phase</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {mockWeatherData.astro.moonPhase}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weather Alerts */}
          {mockWeatherData.alerts && mockWeatherData.alerts.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20"
            >
              {mockWeatherData.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      {alert.type}
                    </p>
                    <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 7-Day Forecast */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              7-Day Forecast
            </h2>
            <div className="mt-4 space-y-3">
              {mockWeatherData.forecast.map((day, i) => {
                const Icon = weatherIcons[day.icon];
                const date = new Date(day.date);
                const isToday = i === 0;

                return (
                  <div
                    key={day.date}
                    className={`flex items-center justify-between rounded-xl p-3 ${
                      isToday
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {isToday
                            ? 'Today'
                            : date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center">
                        <Icon className="h-8 w-8 text-sky-500" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {day.condition}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      {day.precipitation > 0 && (
                        <div className="flex items-center gap-1 text-sky-500">
                          <Droplets className="h-4 w-4" />
                          <span className="text-sm">{day.precipitation}%</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {convertTemp(day.high)}°
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {convertTemp(day.low)}°
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Packing Suggestions */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Packing Suggestions
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Based on the weather forecast
            </p>
            <div className="mt-4 space-y-3">
              {[
                { item: 'Light jacket', reason: 'Evening temperatures drop to 12°C' },
                { item: 'Umbrella', reason: 'Rain expected on Day 3' },
                { item: 'Sunglasses', reason: 'Sunny days with UV index 4' },
                { item: 'Comfortable walking shoes', reason: 'Mild weather great for sightseeing' },
                { item: 'Layers', reason: 'Temperature variation 9-21°C' },
              ].map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-lg dark:bg-primary-900/30">
                    {['🧥', '☔', '🕶️', '👟', '👕'][i]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {suggestion.item}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {suggestion.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Best Times to Visit */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 p-6 text-white"
          >
            <h2 className="text-lg font-semibold">Best Times for Activities</h2>
            <p className="mt-1 text-sm text-primary-100">
              Optimized based on weather conditions
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { activity: 'Temple Visits', time: 'Morning 7-10 AM', reason: 'Cooler, less crowded' },
                { activity: 'Street Food', time: 'Evening 5-8 PM', reason: 'Pleasant temperature' },
                { activity: 'Parks & Gardens', time: 'Day 1 & 5', reason: 'Best sunny days' },
                { activity: 'Indoor Museums', time: 'Day 3', reason: 'Rainy weather' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="font-medium">{item.activity}</p>
                  <p className="mt-1 text-lg font-bold">{item.time}</p>
                  <p className="mt-1 text-xs text-primary-100">{item.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
