'use client';

import * as React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Share2,
  MoreHorizontal,
  Plus,
  Plane,
  Train,
  Bus,
  Car,
  Hotel,
  Utensils,
  Camera,
  ShoppingBag,
  Ticket,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Sparkles,
  Map,
  FileText,
  Wallet,
  Settings,
  Star,
  Sun,
  Cloud,
  CloudRain,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Activity {
  id: string;
  title: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'hotel' | 'restaurant' | 'attraction' | 'shopping' | 'event';
  startTime: string;
  endTime?: string;
  location: string;
  address?: string;
  notes?: string;
  cost?: number;
  booked: boolean;
  confirmationNumber?: string;
}

interface Day {
  id: string;
  date: string;
  location: string;
  weather?: { temp: number; condition: 'sunny' | 'cloudy' | 'rainy' };
  activities: Activity[];
}

const mockDays: Day[] = [
  {
    id: '1',
    date: '2024-03-15',
    location: 'Tokyo',
    weather: { temp: 18, condition: 'sunny' },
    activities: [
      {
        id: 'a1',
        title: 'Flight SQ 12 - Arrival',
        type: 'flight',
        startTime: '09:30',
        endTime: '11:45',
        location: 'Narita International Airport',
        cost: 850,
        booked: true,
        confirmationNumber: 'SQ12ABC',
      },
      {
        id: 'a2',
        title: 'Airport Transfer to Hotel',
        type: 'train',
        startTime: '12:30',
        endTime: '14:00',
        location: 'Narita Express',
        cost: 35,
        booked: true,
      },
      {
        id: 'a3',
        title: 'Hotel Check-in',
        type: 'hotel',
        startTime: '15:00',
        location: 'Park Hyatt Tokyo',
        address: '3-7-1-2 Nishi Shinjuku',
        cost: 450,
        booked: true,
        confirmationNumber: 'HYATT123',
      },
      {
        id: 'a4',
        title: 'Dinner at Gonpachi',
        type: 'restaurant',
        startTime: '19:00',
        endTime: '21:00',
        location: 'Gonpachi Nishi-Azabu',
        cost: 80,
        booked: false,
      },
    ],
  },
  {
    id: '2',
    date: '2024-03-16',
    location: 'Tokyo',
    weather: { temp: 16, condition: 'cloudy' },
    activities: [
      {
        id: 'b1',
        title: 'Tsukiji Outer Market',
        type: 'attraction',
        startTime: '07:00',
        endTime: '10:00',
        location: 'Tsukiji Market',
        cost: 0,
        booked: false,
      },
      {
        id: 'b2',
        title: 'Senso-ji Temple',
        type: 'attraction',
        startTime: '11:00',
        endTime: '13:00',
        location: 'Asakusa',
        cost: 0,
        booked: false,
      },
      {
        id: 'b3',
        title: 'Lunch at Ramen Street',
        type: 'restaurant',
        startTime: '13:30',
        endTime: '14:30',
        location: 'Tokyo Station Ramen Street',
        cost: 15,
        booked: false,
      },
      {
        id: 'b4',
        title: 'Tokyo Skytree',
        type: 'attraction',
        startTime: '15:30',
        endTime: '18:00',
        location: 'Tokyo Skytree',
        cost: 25,
        booked: true,
        confirmationNumber: 'SKYTREE456',
      },
    ],
  },
  {
    id: '3',
    date: '2024-03-17',
    location: 'Kyoto',
    weather: { temp: 14, condition: 'rainy' },
    activities: [
      {
        id: 'c1',
        title: 'Shinkansen to Kyoto',
        type: 'train',
        startTime: '08:00',
        endTime: '10:15',
        location: 'Tokyo Station → Kyoto Station',
        cost: 145,
        booked: true,
        confirmationNumber: 'JR789',
      },
      {
        id: 'c2',
        title: 'Fushimi Inari Shrine',
        type: 'attraction',
        startTime: '11:30',
        endTime: '14:00',
        location: 'Fushimi Inari Taisha',
        cost: 0,
        booked: false,
      },
    ],
  },
];

const activityIcons: Record<Activity['type'], React.ElementType> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car: Car,
  hotel: Hotel,
  restaurant: Utensils,
  attraction: Camera,
  shopping: ShoppingBag,
  event: Ticket,
};

const activityColors: Record<Activity['type'], string> = {
  flight: 'blue',
  train: 'emerald',
  bus: 'amber',
  car: 'slate',
  hotel: 'violet',
  restaurant: 'orange',
  attraction: 'pink',
  shopping: 'cyan',
  event: 'rose',
};

const weatherIcons: Record<string, React.ElementType> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

export default function TripDetailPage() {
  const params = useParams();
  const [days, setDays] = React.useState(mockDays);
  const [expandedDays, setExpandedDays] = React.useState<string[]>(mockDays.map((d) => d.id));
  const [activeTab, setActiveTab] = React.useState<'itinerary' | 'map' | 'documents' | 'budget'>('itinerary');
  const [showAddActivity, setShowAddActivity] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const getFormattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const calculateDayTotal = (activities: Activity[]) => {
    return activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&auto=format')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Button */}
        <Link
          href="/trips"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Actions */}
        <div className="absolute right-4 top-4 flex gap-2">
          <button className="rounded-xl bg-black/30 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="rounded-xl bg-black/30 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Japan Adventure</h1>
              <div className="mt-2 flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Tokyo, Kyoto, Osaka
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Mar 15 - 30, 2024
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  2 travelers
                </span>
              </div>
            </div>

            {/* Readiness Badge */}
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90 transform">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="4"
                      strokeDasharray={`${87 * 1.26} 999`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                    87%
                  </span>
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">Trip Readiness</p>
                  <p className="text-xs text-white/70">Almost ready!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-1">
            {[
              { id: 'itinerary', label: 'Itinerary', icon: Calendar },
              { id: 'map', label: 'Map', icon: Map },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'budget', label: 'Budget', icon: Wallet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === 'itinerary' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Itinerary Timeline */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 dark:from-violet-900/20 dark:to-purple-900/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-violet-900 dark:text-violet-200">
                    AI Suggestion
                  </p>
                  <p className="mt-1 text-sm text-violet-700 dark:text-violet-300">
                    Based on your arrival time, consider adding a rest period before dinner. 
                    The Shinjuku Gyoen National Garden is nearby and perfect for a relaxing walk.
                  </p>
                </div>
                <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700">
                  Add to Day 1
                </button>
              </motion.div>

              {/* Days */}
              {days.map((day, dayIndex) => {
                const { day: dayName, date } = getFormattedDate(day.date);
                const isExpanded = expandedDays.includes(day.id);
                const WeatherIcon = weatherIcons[day.weather?.condition || 'sunny'];
                const dayTotal = calculateDayTotal(day.activities);

                return (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900"
                  >
                    {/* Day Header */}
                    <button
                      onClick={() => toggleDay(day.id)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                            Day
                          </span>
                          <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                            {dayIndex + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {dayName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {date} • {day.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {day.weather && (
                          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                            <WeatherIcon className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {day.weather.temp}°C
                            </span>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            ${dayTotal}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {day.activities.length} activities
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Activities */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <div className="p-4">
                            <Reorder.Group
                              axis="y"
                              values={day.activities}
                              onReorder={(newActivities) => {
                                setDays((prev) =>
                                  prev.map((d) =>
                                    d.id === day.id
                                      ? { ...d, activities: newActivities }
                                      : d
                                  )
                                );
                              }}
                              className="space-y-3"
                            >
                              {day.activities.map((activity, actIndex) => {
                                const Icon = activityIcons[activity.type];
                                const color = activityColors[activity.type];

                                return (
                                  <Reorder.Item
                                    key={activity.id}
                                    value={activity}
                                    className="group cursor-grab active:cursor-grabbing"
                                  >
                                    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                                      <GripVertical className="mt-1 h-4 w-4 flex-shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600" />

                                      {/* Time */}
                                      <div className="w-16 flex-shrink-0 text-center">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                          {activity.startTime}
                                        </p>
                                        {activity.endTime && (
                                          <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {activity.endTime}
                                          </p>
                                        )}
                                      </div>

                                      {/* Timeline Dot */}
                                      <div className="flex flex-col items-center">
                                        <div
                                          className={`flex h-8 w-8 items-center justify-center rounded-full bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`}
                                        >
                                          <Icon className="h-4 w-4" />
                                        </div>
                                        {actIndex < day.activities.length - 1 && (
                                          <div className="mt-2 h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
                                        )}
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">
                                              {activity.title}
                                            </h4>
                                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                              {activity.location}
                                            </p>
                                            {activity.address && (
                                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                                {activity.address}
                                              </p>
                                            )}
                                          </div>

                                          {/* Status & Cost */}
                                          <div className="flex items-center gap-2">
                                            {activity.booked ? (
                                              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Booked
                                              </span>
                                            ) : (
                                              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                <Circle className="h-3 w-3" />
                                                To Book
                                              </span>
                                            )}
                                            {activity.cost !== undefined && activity.cost > 0 && (
                                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                ${activity.cost}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        {activity.confirmationNumber && (
                                          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                            Conf: {activity.confirmationNumber}
                                          </p>
                                        )}
                                      </div>

                                      {/* Actions */}
                                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700">
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20">
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </Reorder.Item>
                                );
                              })}
                            </Reorder.Group>

                            {/* Add Activity Button */}
                            <button
                              onClick={() => {
                                setSelectedDay(day.id);
                                setShowAddActivity(true);
                              }}
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:hover:border-primary-500"
                            >
                              <Plus className="h-4 w-4" />
                              Add Activity
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Add Day Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-6 text-sm font-medium text-slate-500 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500 dark:hover:bg-primary-900/20">
                <Plus className="h-5 w-5" />
                Add Another Day
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Trip Overview
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      16
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Days
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      4
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cities
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      28
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Activities
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      $3,995
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Cost
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Pre-Trip Checklist
                </h3>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Book flights', done: true },
                    { label: 'Reserve hotels', done: true },
                    { label: 'Get travel insurance', done: false },
                    { label: 'Apply for visa', done: true },
                    { label: 'Exchange currency', done: false },
                    { label: 'Pack bags', done: false },
                  ].map((item, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={item.done}
                        className="h-5 w-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span
                        className={`text-sm ${
                          item.done
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Collaborators */}
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Travelers
                  </h3>
                  <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'John Doe', role: 'Organizer', avatar: 'JD' },
                    { name: 'Sarah Miller', role: 'Traveler', avatar: 'SM' },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        {person.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {person.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {person.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="text-center">
              <Map className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
                Interactive Trip Map
              </p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                View all your destinations and routes
              </p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Flight Confirmation.pdf', type: 'PDF', size: '245 KB' },
              { name: 'Hotel Booking - Tokyo.pdf', type: 'PDF', size: '180 KB' },
              { name: 'JR Pass Voucher.pdf', type: 'PDF', size: '120 KB' },
              { name: 'Travel Insurance.pdf', type: 'PDF', size: '340 KB' },
              { name: 'Passport Copy.jpg', type: 'Image', size: '1.2 MB' },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
            ))}
            <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-8 text-slate-500 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-slate-700">
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Upload Document</span>
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="text-center py-12">
            <Wallet className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
              Budget details for this trip
            </p>
            <Link
              href="/budget"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              View Full Budget
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
