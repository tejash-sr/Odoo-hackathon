'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  Globe,
  Mountain,
  Palmtree,
  Building2,
  Waves,
  ArrowRight,
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'beach', name: 'Beach', icon: Palmtree },
  { id: 'city', name: 'City', icon: Building2 },
  { id: 'mountain', name: 'Mountain', icon: Mountain },
  { id: 'island', name: 'Island', icon: Waves },
];

const destinations = [
  {
    id: 1,
    name: 'Tokyo, Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    rating: 4.9,
    reviews: 2847,
    category: 'city',
    price: '$1,200',
    trending: true,
    description: 'Blend of ancient tradition and cutting-edge technology',
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    rating: 4.8,
    reviews: 1923,
    category: 'beach',
    price: '$1,800',
    trending: true,
    description: 'Stunning sunsets and white-washed buildings',
  },
  {
    id: 3,
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    rating: 4.9,
    reviews: 3421,
    category: 'mountain',
    price: '$2,100',
    trending: true,
    description: 'Majestic peaks and pristine alpine scenery',
  },
  {
    id: 4,
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.7,
    reviews: 2156,
    category: 'beach',
    price: '$800',
    trending: false,
    description: 'Tropical paradise with rich culture',
  },
  {
    id: 5,
    name: 'Paris, France',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    rating: 4.8,
    reviews: 4532,
    category: 'city',
    price: '$1,500',
    trending: true,
    description: 'The City of Light and romance',
  },
  {
    id: 6,
    name: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    rating: 4.9,
    reviews: 1687,
    category: 'island',
    price: '$3,500',
    trending: false,
    description: 'Overwater villas and crystal clear waters',
  },
  {
    id: 7,
    name: 'New York City',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    rating: 4.7,
    reviews: 5234,
    category: 'city',
    price: '$1,400',
    trending: false,
    description: 'The city that never sleeps',
  },
  {
    id: 8,
    name: 'Iceland',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    rating: 4.9,
    reviews: 2943,
    category: 'mountain',
    price: '$1,900',
    trending: true,
    description: 'Land of fire and ice with stunning landscapes',
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedCategory === 'all' || 
      dest.category === selectedCategory ||
      (selectedCategory === 'trending' && dest.trending);
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium">Discover Your Next Adventure</span>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Explore Amazing Destinations
            </h1>
            
            <p className="mb-8 text-lg text-white/90">
              Find inspiration for your next trip from our curated collection
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search destinations, cities, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
          </p>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Destinations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDestinations.map((destination) => (
            <Link
              key={destination.id}
              href="/trips/new"
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {destination.trending && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-1 backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3 text-white" />
                    <span className="text-xs font-semibold text-white">Trending</span>
                  </div>
                )}
                <div className="absolute right-3 top-3 rounded-lg bg-white/95 px-2 py-1 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-slate-700">{destination.price}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {destination.country}
                    </p>
                  </div>
                </div>
                
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {destination.rating}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      ({destination.reviews})
                    </span>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredDestinations.length === 0 && (
          <div className="py-20 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No destinations found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
