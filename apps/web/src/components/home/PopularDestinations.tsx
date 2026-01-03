'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@globetrotter/ui';
import { Badge, Button } from '@globetrotter/ui';
import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Plane,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const destinations = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    rating: 4.9,
    reviews: 12500,
    price: '$1,200',
    duration: '5 days',
    tags: ['Romantic', 'Culture', 'Food'],
    trending: true,
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    rating: 4.8,
    reviews: 9800,
    price: '$1,800',
    duration: '7 days',
    tags: ['Adventure', 'Culture', 'Tech'],
    trending: true,
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    rating: 4.9,
    reviews: 7200,
    price: '$950',
    duration: '4 days',
    tags: ['Romantic', 'Beach', 'Photography'],
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.7,
    reviews: 15300,
    price: '$800',
    duration: '6 days',
    tags: ['Nature', 'Wellness', 'Adventure'],
  },
  {
    id: '5',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    rating: 4.8,
    reviews: 22100,
    price: '$1,500',
    duration: '5 days',
    tags: ['Urban', 'Culture', 'Shopping'],
  },
  {
    id: '6',
    name: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    rating: 4.9,
    reviews: 6800,
    price: '$2,500',
    duration: '5 days',
    tags: ['Luxury', 'Beach', 'Romantic'],
  },
];

export function PopularDestinations() {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-900/50 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              <Heart className="h-4 w-4" />
              Trending Now
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Popular Destinations
            </h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              Discover the world's most loved travel destinations
            </p>
          </div>
          <Link href="/explore">
            <Button variant="secondary">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/destinations/${destination.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Trending Badge */}
                {destination.trending && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="primary">🔥 Trending</Badge>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  className={cn(
                    'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full transition-all',
                    favorites.has(destination.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-slate-600 hover:bg-white'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(destination.id);
                  }}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      favorites.has(destination.id) && 'fill-current'
                    )}
                  />
                </button>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">
                    {destination.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.country}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {destination.rating}
                    </span>
                    <span className="text-sm text-slate-500">
                      ({destination.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Plane className="h-4 w-4" />
                    {destination.duration}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {destination.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div>
                    <span className="text-sm text-slate-500">From</span>
                    <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
                      {destination.price}
                    </span>
                    <span className="text-sm text-slate-500">/person</span>
                  </div>
                  <Button variant="primary" size="sm">
                    Explore
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
