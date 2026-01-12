'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Check,
  ChevronRight,
  Sparkles,
  Plane,
  Hotel,
  Utensils,
  Camera,
} from 'lucide-react';

const destinations = [
  {
    id: '1',
    name: 'Tokyo, Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    rating: 4.9,
    reviews: 2847,
    price: '$1,200',
    description: 'Experience the perfect blend of ancient tradition and cutting-edge technology in Japan\'s vibrant capital.',
    highlights: [
      'Visit the historic Senso-ji Temple',
      'Explore the bustling Shibuya Crossing',
      'Experience traditional tea ceremony',
      'Shop in trendy Harajuku district',
    ],
    bestTime: 'March-May, September-November',
    duration: '7-10 days',
  },
  {
    id: '2',
    name: 'Santorini, Greece',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
    rating: 4.8,
    reviews: 1923,
    price: '$1,800',
    description: 'Discover stunning sunsets, white-washed buildings, and azure waters in this iconic Greek island paradise.',
    highlights: [
      'Watch sunset in Oia village',
      'Explore ancient ruins of Akrotiri',
      'Wine tasting at local vineyards',
      'Relax on unique volcanic beaches',
    ],
    bestTime: 'April-November',
    duration: '4-6 days',
  },
  {
    id: '3',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80',
    rating: 4.9,
    reviews: 3421,
    price: '$2,100',
    description: 'Immerse yourself in majestic peaks, pristine alpine scenery, and charming mountain villages.',
    highlights: [
      'Ride the Jungfrau Railway',
      'Hike in stunning mountain trails',
      'Visit picturesque Zermatt',
      'Experience Swiss chocolate tours',
    ],
    bestTime: 'June-September, December-March',
    duration: '5-7 days',
  },
];

const tripTypes = [
  { id: 'solo', label: 'Solo Adventure', icon: Users, description: 'Travel at your own pace' },
  { id: 'couple', label: 'Romantic Getaway', icon: Users, description: 'Perfect for two' },
  { id: 'family', label: 'Family Trip', icon: Users, description: 'Fun for all ages' },
  { id: 'group', label: 'Group Travel', icon: Users, description: '3+ travelers' },
];

const durations = [
  { id: '3-5', label: '3-5 days', description: 'Quick escape' },
  { id: '6-9', label: '6-9 days', description: 'Week-long' },
  { id: '10-14', label: '10-14 days', description: 'Extended stay' },
  { id: '15+', label: '15+ days', description: 'Long adventure' },
];

const budgetRanges = [
  { id: 'budget', label: 'Budget', amount: '<$1,000', icon: DollarSign },
  { id: 'moderate', label: 'Moderate', amount: '$1,000-$2,500', icon: DollarSign },
  { id: 'luxury', label: 'Luxury', amount: '$2,500-$5,000', icon: DollarSign },
  { id: 'premium', label: 'Premium', amount: '$5,000+', icon: DollarSign },
];

export default function DestinationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const destination = destinations.find(d => d.id === params.id);
  
  const [selectedTripType, setSelectedTripType] = React.useState<string>('');
  const [selectedDuration, setSelectedDuration] = React.useState<string>('');
  const [selectedBudget, setSelectedBudget] = React.useState<string>('');
  const [travelers, setTravelers] = React.useState(1);

  if (!destination) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Destination not found</h1>
          <Link href="/explore" className="text-blue-600 hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const canContinue = selectedTripType && selectedDuration && selectedBudget;

  const handleContinue = () => {
    if (canContinue) {
      router.push('/trips/new?step=2');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/explore"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-slate-900 backdrop-blur-sm transition-all hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Destination Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">{destination.name}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{destination.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{destination.rating}</span>
                <span className="text-white/80">({destination.reviews} reviews)</span>
              </div>
              <div className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
                <span className="font-semibold">From {destination.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                About {destination.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                Top Highlights
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Best Time to Visit</span>
                </div>
                <p className="text-slate-900 dark:text-white">{destination.bestTime}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Recommended Duration</span>
                </div>
                <p className="text-slate-900 dark:text-white">{destination.duration}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Trip Planning */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Plan Your Trip
                </h3>
              </div>

              <div className="space-y-6">
                {/* Trip Type */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {tripTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedTripType(type.id)}
                        className={`rounded-lg border-2 p-3 text-left transition-all ${
                          selectedTripType === type.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <div className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {type.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {type.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.id}
                        onClick={() => setSelectedDuration(duration.id)}
                        className={`rounded-lg border-2 p-3 text-left transition-all ${
                          selectedDuration === duration.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <div className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {duration.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {duration.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Budget Range
                  </label>
                  <div className="space-y-2">
                    {budgetRanges.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => setSelectedBudget(budget.id)}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                          selectedBudget === budget.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {budget.label}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {budget.amount}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center text-lg font-semibold text-slate-900 dark:text-white">
                      {travelers}
                    </div>
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold transition-all ${
                    canContinue
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                  }`}
                >
                  {canContinue ? 'Continue Planning' : 'Select Options to Continue'}
                  <ChevronRight className="h-5 w-5" />
                </button>

                {!canContinue && (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    Please select trip type, duration, and budget
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
