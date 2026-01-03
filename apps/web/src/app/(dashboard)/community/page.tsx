'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Filter,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  MoreHorizontal,
  UserPlus,
  Image as ImageIcon,
  Plane,
  ChevronDown,
} from 'lucide-react';

interface TripPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
  };
  trip: {
    title: string;
    destinations: string[];
    duration: string;
    coverImage: string;
    rating: number;
    budget: string;
  };
  content: string;
  images: string[];
  likes: number;
  comments: number;
  saves: number;
  tags: string[];
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

const MOCK_POSTS: TripPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: '',
      level: 42,
      verified: true,
    },
    trip: {
      title: 'Magical Japan in Cherry Blossom Season',
      destinations: ['Tokyo', 'Kyoto', 'Osaka'],
      duration: '14 days',
      coverImage: '/api/placeholder/800/400',
      rating: 4.9,
      budget: '$3,500',
    },
    content: 'Just got back from the most incredible trip to Japan! The cherry blossoms were absolutely stunning. Here are my top tips for anyone planning a similar trip...',
    images: ['https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80', 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&q=80', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80'],
    likes: 1247,
    comments: 89,
    saves: 342,
    tags: ['Japan', 'Cherry Blossom', 'Spring', 'Culture'],
    createdAt: '2 hours ago',
    isLiked: false,
    isSaved: true,
  },
  {
    id: '2',
    author: {
      name: 'Marco Rodriguez',
      avatar: '',
      level: 28,
      verified: false,
    },
    trip: {
      title: 'Budget Backpacking Through Southeast Asia',
      destinations: ['Thailand', 'Vietnam', 'Cambodia'],
      duration: '30 days',
      coverImage: '/api/placeholder/800/400',
      rating: 4.7,
      budget: '$1,200',
    },
    content: 'Proof that you can travel Southeast Asia on a shoestring budget! I spent 30 days across 3 countries for just $1,200 including flights. Here\'s exactly how I did it...',
    images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80', 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&q=80'],
    likes: 892,
    comments: 156,
    saves: 567,
    tags: ['Budget', 'Backpacking', 'Southeast Asia', 'Adventure'],
    createdAt: '5 hours ago',
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    author: {
      name: 'Emma Thompson',
      avatar: '',
      level: 35,
      verified: true,
    },
    trip: {
      title: 'A Week in the Swiss Alps',
      destinations: ['Zermatt', 'Interlaken', 'Lucerne'],
      duration: '7 days',
      coverImage: '/api/placeholder/800/400',
      rating: 5.0,
      budget: '$4,200',
    },
    content: 'Switzerland in winter is pure magic! From skiing in Zermatt with views of the Matterhorn to the charming streets of Lucerne. Every moment was picture-perfect.',
    images: ['https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80', 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&q=80', 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=400&q=80'],
    likes: 2103,
    comments: 234,
    saves: 891,
    tags: ['Switzerland', 'Alps', 'Winter', 'Skiing', 'Luxury'],
    createdAt: '1 day ago',
    isLiked: true,
    isSaved: true,
  },
];

const TRENDING_DESTINATIONS = [
  { name: 'Paris, France', posts: 12453, emoji: '🗼' },
  { name: 'Tokyo, Japan', posts: 10892, emoji: '🗾' },
  { name: 'Bali, Indonesia', posts: 9876, emoji: '🌴' },
  { name: 'Santorini, Greece', posts: 8234, emoji: '🏛️' },
  { name: 'Iceland', posts: 7654, emoji: '🌋' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'following'>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved, saves: post.isSaved ? post.saves - 1 : post.saves + 1 }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Travel Community</h1>
                <p className="text-indigo-200 mt-1">Share experiences, discover inspiration</p>
              </div>
            </div>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search trips, destinations, travelers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
              {(['feed', 'trending', 'following'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'trending' && <TrendingUp className="w-4 h-4 inline mr-2" />}
                  {tab}
                </button>
              ))}
              <div className="flex-1" />
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Create Post Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <input
                  type="text"
                  placeholder="Share your travel experience..."
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                    Photo
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Location
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Plane className="w-5 h-5 text-blue-500" />
                    Trip
                  </button>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-violet-600 transition-all">
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Author Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                          {post.author.level}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500">{post.createdAt}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Trip Card */}
                  <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {post.trip.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {post.trip.destinations.join(' → ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.trip.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          {post.trip.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="px-4 text-slate-700 dark:text-slate-300 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Images */}
                  {post.images.length > 0 && (
                    <div className={`mt-4 grid gap-1 ${
                      post.images.length === 1 ? 'grid-cols-1' :
                      post.images.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {post.images.slice(0, 3).map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-video bg-slate-200 dark:bg-slate-700"
                        >
                          {i === 2 && post.images.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">
                                +{post.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="px-4 mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.isSaved
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/30'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Trending Destinations */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Trending Destinations
              </h2>
              <div className="space-y-3">
                {TRENDING_DESTINATIONS.map((dest, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dest.emoji}</span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{dest.name}</p>
                        <p className="text-xs text-slate-500">{dest.posts.toLocaleString()} posts</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-400">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Travelers */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Travelers to Follow
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Alex Rivera', location: 'Digital Nomad', trips: 45 },
                  { name: 'Yuki Tanaka', location: 'Tokyo, Japan', trips: 32 },
                  { name: 'James Wilson', location: 'London, UK', trips: 28 },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.trips} trips</p>
                      </div>
                    </div>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl shadow-sm p-4 text-white">
              <h2 className="font-semibold mb-4">Your Community Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-indigo-100">Followers</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-indigo-100">Following</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-indigo-100">Posts</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-sm text-indigo-100">Likes</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
