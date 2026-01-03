'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Plane,
  Share2,
  Edit,
  Trash2,
  Copy,
  Grid,
  List,
  ArrowRight,
  Star,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  readinessScore: number;
  collaborators: { id: string; name: string; avatar: string }[];
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  legs: number;
  activities: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Japan Adventure',
    destination: 'Tokyo, Kyoto, Osaka',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format',
    startDate: '2024-03-15',
    endDate: '2024-03-30',
    status: 'upcoming',
    readinessScore: 87,
    collaborators: [
      { id: '1', name: 'John', avatar: 'JD' },
      { id: '2', name: 'Sarah', avatar: 'SM' },
    ],
    budget: { total: 5800, spent: 3995, currency: 'USD' },
    legs: 4,
    activities: 12,
  },
  {
    id: '2',
    name: 'European Summer',
    destination: 'Paris, Rome, Barcelona',
    country: 'Multiple',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format',
    startDate: '2024-06-10',
    endDate: '2024-06-28',
    status: 'planning',
    readinessScore: 45,
    collaborators: [
      { id: '1', name: 'John', avatar: 'JD' },
    ],
    budget: { total: 8500, spent: 2100, currency: 'USD' },
    legs: 6,
    activities: 18,
  },
  {
    id: '3',
    name: 'Bali Retreat',
    destination: 'Ubud, Seminyak',
    country: 'Indonesia',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format',
    startDate: '2024-08-05',
    endDate: '2024-08-15',
    status: 'planning',
    readinessScore: 23,
    collaborators: [],
    budget: { total: 3200, spent: 450, currency: 'USD' },
    legs: 2,
    activities: 8,
  },
  {
    id: '4',
    name: 'New York City Weekend',
    destination: 'Manhattan',
    country: 'USA',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format',
    startDate: '2023-12-20',
    endDate: '2023-12-23',
    status: 'completed',
    readinessScore: 100,
    collaborators: [
      { id: '1', name: 'John', avatar: 'JD' },
      { id: '2', name: 'Sarah', avatar: 'SM' },
      { id: '3', name: 'Mike', avatar: 'MK' },
    ],
    budget: { total: 2500, spent: 2380, currency: 'USD' },
    legs: 1,
    activities: 6,
  },
];

const statusConfig = {
  planning: { label: 'Planning', color: 'amber', icon: Edit },
  upcoming: { label: 'Upcoming', color: 'blue', icon: Calendar },
  ongoing: { label: 'Ongoing', color: 'emerald', icon: Plane },
  completed: { label: 'Completed', color: 'slate', icon: CheckCircle2 },
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

export default function TripsPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Trip['status']) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-${config.color}-100 px-2.5 py-1 text-xs font-medium text-${config.color}-700 dark:bg-${config.color}-900/30 dark:text-${config.color}-400`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day';
    return `${diff} days`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Trips
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mockTrips.length} trips • {mockTrips.filter(t => t.status === 'upcoming').length} upcoming
              </p>
            </div>
            <Link
              href="/trips/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              New Trip
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'planning', 'upcoming', 'ongoing', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Grid/List */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {filteredTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 dark:border-slate-700"
          >
            <Globe className="h-16 w-16 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              No trips found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Start planning your first adventure!'}
            </p>
            <Link
              href="/trips/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Create Trip
            </Link>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl dark:bg-slate-900"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute left-4 top-4">
                    {getStatusBadge(trip.status)}
                  </div>

                  {/* Menu */}
                  <div className="absolute right-4 top-4">
                    <button
                      onClick={() => setActiveMenu(activeMenu === trip.id ? null : trip.id)}
                      className="rounded-lg bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === trip.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-10 z-10 w-48 rounded-xl bg-white p-2 shadow-xl dark:bg-slate-800"
                        >
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                            <Edit className="h-4 w-4" />
                            Edit Trip
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </button>
                          <hr className="my-2 border-slate-200 dark:border-slate-700" />
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Trip Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{trip.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="h-3.5 w-3.5" />
                      {trip.destination}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Dates */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(trip.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' - '}
                      {new Date(trip.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <span className="text-primary-600 font-medium dark:text-primary-400">
                      {trip.status !== 'completed' ? getDaysUntil(trip.startDate) : 'Completed'}
                    </span>
                  </div>

                  {/* Readiness Score */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Readiness</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {trip.readinessScore}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trip.readinessScore}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          trip.readinessScore >= 80
                            ? 'bg-emerald-500'
                            : trip.readinessScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Plane className="h-4 w-4" />
                        {trip.legs} legs
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {trip.activities} activities
                      </span>
                    </div>
                    
                    {/* Collaborators */}
                    {trip.collaborators.length > 0 && (
                      <div className="flex -space-x-2">
                        {trip.collaborators.slice(0, 3).map((collab) => (
                          <div
                            key={collab.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-medium text-primary-600 dark:border-slate-900 dark:bg-primary-900/30 dark:text-primary-400"
                            title={collab.name}
                          >
                            {collab.avatar}
                          </div>
                        ))}
                        {trip.collaborators.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-400">
                            +{trip.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/trips/${trip.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    View Trip
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
                className="group flex gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900"
              >
                {/* Cover Image */}
                <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {trip.name}
                        </h3>
                        {getStatusBadge(trip.status)}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {trip.destination}
                      </p>
                    </div>
                    <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(trip.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {' - '}
                        {new Date(trip.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Plane className="h-4 w-4" />
                        {trip.legs} legs
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Star className="h-4 w-4" />
                        {trip.activities} activities
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Readiness */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              trip.readinessScore >= 80
                                ? 'bg-emerald-500'
                                : trip.readinessScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${trip.readinessScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {trip.readinessScore}%
                        </span>
                      </div>

                      <Link
                        href={`/trips/${trip.id}`}
                        className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
