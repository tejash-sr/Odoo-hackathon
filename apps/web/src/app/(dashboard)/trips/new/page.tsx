'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Plane,
  Check,
  ChevronDown,
  Search,
  X,
  Plus,
  Sparkles,
  Globe,
  Clock,
  Wallet,
  Camera,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  popular?: boolean;
}

const popularDestinations: Destination[] = [
  { id: '1', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', popular: true },
  { id: '2', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', popular: true },
  { id: '3', name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', popular: true },
  { id: '4', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', popular: true },
  { id: '5', name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', popular: true },
  { id: '6', name: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', popular: true },
];

const tripTypes = [
  { id: 'solo', label: 'Solo Adventure', icon: '🎒', description: 'Just me exploring' },
  { id: 'couple', label: 'Romantic Getaway', icon: '💑', description: 'Travel with partner' },
  { id: 'family', label: 'Family Vacation', icon: '👨‍👩‍👧‍👦', description: 'Fun for everyone' },
  { id: 'friends', label: 'Friends Trip', icon: '🎉', description: 'Adventure with friends' },
  { id: 'business', label: 'Business Travel', icon: '💼', description: 'Work & meetings' },
];

const budgetRanges = [
  { id: 'budget', label: 'Budget', range: '$0 - $1,000', icon: '💰' },
  { id: 'moderate', label: 'Moderate', range: '$1,000 - $3,000', icon: '💵' },
  { id: 'comfort', label: 'Comfortable', range: '$3,000 - $5,000', icon: '💎' },
  { id: 'luxury', label: 'Luxury', range: '$5,000+', icon: '👑' },
];

export default function NewTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [tripName, setTripName] = React.useState('');
  const [selectedDestinations, setSelectedDestinations] = React.useState<Destination[]>([]);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [tripType, setTripType] = React.useState('');
  const [travelers, setTravelers] = React.useState(1);
  const [budget, setBudget] = React.useState('');
  const [destinationSearch, setDestinationSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const totalSteps = 4;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return tripName.length > 0 && selectedDestinations.length > 0;
      case 2:
        return startDate && endDate;
      case 3:
        return tripType;
      case 4:
        return budget;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateTrip = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push('/trips');
  };

  const toggleDestination = (dest: Destination) => {
    setSelectedDestinations((prev) =>
      prev.find((d) => d.id === dest.id)
        ? prev.filter((d) => d.id !== dest.id)
        : [...prev, dest]
    );
  };

  const filteredDestinations = popularDestinations.filter(
    (d) =>
      d.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/trips"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i + 1 <= currentStep
                    ? 'bg-primary-600'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Trip Name & Destinations */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
                  <Globe className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Where are you going?
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Give your trip a name and select your destinations
                </p>
              </div>

              {/* Trip Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Japan Adventure 2024"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Selected Destinations */}
              {selectedDestinations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Destinations ({selectedDestinations.length})
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDestinations.map((dest) => (
                      <motion.span
                        key={dest.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 rounded-full bg-primary-100 py-1.5 pl-3 pr-2 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                      >
                        {dest.name}, {dest.country}
                        <button
                          onClick={() => toggleDestination(dest)}
                          className="rounded-full p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search Destinations
                </label>
                <div className="relative mt-2">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    placeholder="Search cities or countries..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Popular Destinations Grid */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Popular Destinations
                </label>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {filteredDestinations.map((dest) => {
                    const isSelected = selectedDestinations.find(
                      (d) => d.id === dest.id
                    );
                    return (
                      <motion.button
                        key={dest.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDestination(dest)}
                        className={`relative overflow-hidden rounded-xl transition-all ${
                          isSelected
                            ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900'
                            : ''
                        }`}
                      >
                        <div className="aspect-[4/3] w-full">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                            <p className="font-semibold text-white">
                              {dest.name}
                            </p>
                            <p className="text-sm text-white/70">
                              {dest.country}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute right-2 top-2 rounded-full bg-primary-600 p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30">
                  <Calendar className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  When are you traveling?
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Select your travel dates
                </p>
              </div>

              <div className="mx-auto max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {startDate && endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="font-medium text-primary-900 dark:text-primary-100">
                          Trip Duration
                        </p>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          {Math.ceil(
                            (new Date(endDate).getTime() -
                              new Date(startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}{' '}
                          days
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Trip Type & Travelers */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Who's traveling?
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Select your trip type and number of travelers
                </p>
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Trip Type
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tripTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTripType(type.id)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                        tripType === type.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {type.label}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {type.description}
                        </p>
                      </div>
                      {tripType === type.id && (
                        <Check className="ml-auto h-5 w-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="mx-auto max-w-md">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Number of Travelers
                </label>
                <div className="mt-3 flex items-center justify-center gap-6 rounded-xl bg-white p-6 dark:bg-slate-800">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {travelers}
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {travelers === 1 ? 'Traveler' : 'Travelers'}
                    </p>
                  </div>
                  <button
                    onClick={() => setTravelers(Math.min(20, travelers + 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                  <Wallet className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  What's your budget?
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  This helps us suggest the best options for you
                </p>
              </div>

              {/* Budget Range */}
              <div className="grid gap-4 sm:grid-cols-2">
                {budgetRanges.map((range) => (
                  <motion.button
                    key={range.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setBudget(range.id)}
                    className={`flex items-center gap-4 rounded-xl border-2 p-6 text-left transition-all ${
                      budget === range.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-4xl">{range.icon}</span>
                    <div>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        {range.label}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {range.range}
                      </p>
                    </div>
                    {budget === range.id && (
                      <Check className="ml-auto h-6 w-6 text-primary-600 dark:text-primary-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 dark:from-violet-900/20 dark:to-purple-900/20"
              >
                <Sparkles className="h-5 w-5 flex-shrink-0 text-violet-600 dark:text-violet-400" />
                <div>
                  <p className="font-medium text-violet-900 dark:text-violet-200">
                    AI will optimize your trip
                  </p>
                  <p className="mt-1 text-sm text-violet-700 dark:text-violet-300">
                    Based on your budget, we'll suggest the best accommodations, 
                    activities, and dining options to maximize your experience.
                  </p>
                </div>
              </motion.div>

              {/* Trip Summary */}
              <div className="rounded-xl bg-white p-6 dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Trip Summary
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Trip Name</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {tripName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Destinations</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedDestinations.map((d) => d.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Dates</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(startDate).toLocaleDateString()} -{' '}
                      {new Date(endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Trip Type</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {tripTypes.find((t) => t.id === tripType)?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Travelers</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {travelers}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-colors ${
              currentStep === 1
                ? 'text-slate-300 dark:text-slate-600'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg hover:scale-105'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCreateTrip}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Trip
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
