'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Plane,
  Calendar,
  DollarSign,
  Users,
  Clock,
  ChevronDown,
  Download,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Trips',
    value: '24',
    change: 12.5,
    changeLabel: 'vs last year',
    icon: <Plane className="w-6 h-6" />,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    title: 'Countries Visited',
    value: '18',
    change: 28.6,
    changeLabel: 'vs last year',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Total Spent',
    value: '$12,450',
    change: -8.3,
    changeLabel: 'vs last year',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Days Traveled',
    value: '87',
    change: 15.2,
    changeLabel: 'vs last year',
    icon: <Calendar className="w-6 h-6" />,
    color: 'from-rose-500 to-pink-500',
  },
];

const monthlyData = [
  { month: 'Jan', trips: 2, spending: 1200 },
  { month: 'Feb', trips: 1, spending: 800 },
  { month: 'Mar', trips: 3, spending: 2100 },
  { month: 'Apr', trips: 2, spending: 1500 },
  { month: 'May', trips: 1, spending: 900 },
  { month: 'Jun', trips: 4, spending: 3200 },
  { month: 'Jul', trips: 3, spending: 2800 },
  { month: 'Aug', trips: 2, spending: 1800 },
  { month: 'Sep', trips: 2, spending: 1400 },
  { month: 'Oct', trips: 1, spending: 600 },
  { month: 'Nov', trips: 2, spending: 1500 },
  { month: 'Dec', trips: 1, spending: 950 },
];

const topDestinations = [
  { name: 'Paris, France', visits: 5, spending: 3200, flag: '🇫🇷' },
  { name: 'Tokyo, Japan', visits: 3, spending: 2800, flag: '🇯🇵' },
  { name: 'New York, USA', visits: 4, spending: 2400, flag: '🇺🇸' },
  { name: 'London, UK', visits: 3, spending: 2100, flag: '🇬🇧' },
  { name: 'Barcelona, Spain', visits: 2, spending: 1600, flag: '🇪🇸' },
];

const spendingCategories = [
  { category: 'Accommodation', amount: 4500, percentage: 36, color: 'bg-indigo-500' },
  { category: 'Transportation', amount: 3200, percentage: 26, color: 'bg-emerald-500' },
  { category: 'Food & Dining', amount: 2400, percentage: 19, color: 'bg-amber-500' },
  { category: 'Activities', amount: 1500, percentage: 12, color: 'bg-rose-500' },
  { category: 'Other', amount: 850, percentage: 7, color: 'bg-slate-500' },
];

const recentTrips = [
  { destination: 'Bali, Indonesia', date: 'Dec 15-22', status: 'completed', rating: 4.8 },
  { destination: 'Swiss Alps', date: 'Nov 5-12', status: 'completed', rating: 5.0 },
  { destination: 'Morocco', date: 'Oct 1-8', status: 'completed', rating: 4.5 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('year');
  const maxSpending = Math.max(...monthlyData.map(d => d.spending));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Travel Analytics</h1>
                <p className="text-indigo-200 mt-1">Insights into your travel patterns</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="month" className="text-slate-900">This Month</option>
                <option value="quarter" className="text-slate-900">This Quarter</option>
                <option value="year" className="text-slate-900">This Year</option>
                <option value="all" className="text-slate-900">All Time</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {stat.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${stat.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
                <span className="text-sm text-slate-400 ml-1">{stat.changeLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Overview Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Overview</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-sm text-slate-500">Trips</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-500">Spending</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end gap-2">
              {monthlyData.map((data, i) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    {/* Spending Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.spending / maxSpending) * 160}px` }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full bg-emerald-500/20 rounded-t relative group cursor-pointer"
                    >
                      <div 
                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t transition-all group-hover:opacity-80"
                        style={{ height: `${(data.spending / maxSpending) * 100}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${data.spending}
                      </div>
                    </motion.div>
                    {/* Trips indicator */}
                    <div className="flex justify-center gap-0.5">
                      {Array.from({ length: data.trips }).map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Destinations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Destinations</h2>
            <div className="space-y-4">
              {topDestinations.map((dest, i) => (
                <div key={dest.name} className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center text-xl bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {dest.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{dest.name}</p>
                    <p className="text-xs text-slate-500">{dest.visits} visits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">${dest.spending}</p>
                    <p className="text-xs text-slate-500">spent</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
              View All Destinations
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Spending Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Spending Breakdown</h2>
            <div className="flex items-center gap-8">
              {/* Donut Chart Placeholder */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {spendingCategories.reduce((acc, cat, i) => {
                    const prevOffset = acc.offset;
                    const circumference = 2 * Math.PI * 35;
                    const dashLength = (cat.percentage / 100) * circumference;
                    const dashOffset = circumference - dashLength;
                    
                    acc.elements.push(
                      <circle
                        key={cat.category}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        strokeWidth="20"
                        className={cat.color.replace('bg-', 'stroke-')}
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={-prevOffset}
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                      />
                    );
                    
                    acc.offset += dashLength;
                    return acc;
                  }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$12.4K</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex-1 space-y-3">
                {spendingCategories.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{cat.category}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{cat.percentage}%</span>
                      </div>
                      <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Trips</h2>
              <a href="/trips" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-4">
              {recentTrips.map((trip, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{trip.destination}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {trip.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">★ {trip.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Map */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Travel Map</h2>
          <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Interactive map coming soon!</p>
              <p className="text-sm text-slate-400 mt-1">Track all your visited destinations visually</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">18</p>
              <p className="text-sm text-slate-500">Countries</p>
            </div>
            <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">42</p>
              <p className="text-sm text-slate-500">Cities</p>
            </div>
            <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">6</p>
              <p className="text-sm text-slate-500">Continents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
