'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Search, Sun, Moon, Plus, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };
    fetchUser();

    // Listen for auth changes
    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Trip reminder',
      message: 'Your Japan trip starts in 3 days!',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Flight update',
      message: 'Flight AA123 is on time',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Achievement unlocked',
      message: 'You earned the "Early Bird" badge!',
      time: '1 day ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search trips, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 md:hidden"
        >
          {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* New Trip Button */}
          <Link
            href="/trips/new"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 sm:flex"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </Link>

          {/* Mobile New Trip */}
          <Link
            href="/trips/new"
            className="rounded-lg bg-gradient-to-r from-primary-600 to-violet-600 p-2 text-white shadow-lg shadow-primary-500/25 sm:hidden"
          >
            <Plus className="h-5 w-5" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-2 flex items-center justify-between px-3 py-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Mark all read
                  </button>
                </div>
                <div className="space-y-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`rounded-xl p-3 transition-colors ${
                        notif.unread
                          ? 'bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {notif.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {notif.message}
                          </p>
                        </div>
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary-500" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/notifications"
                  className="mt-2 block rounded-xl px-3 py-2 text-center text-sm text-primary-600 transition-colors hover:bg-slate-50 dark:text-primary-400 dark:hover:bg-slate-700"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* User Menu */}
          <Link href="/profile" className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.profile?.currentTitle || 'Explorer'}
              </p>
            </div>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-violet-500">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.firstName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search trips, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      )}
    </header>
  );
}
