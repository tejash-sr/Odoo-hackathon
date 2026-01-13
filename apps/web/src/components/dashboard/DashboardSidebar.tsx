'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@globetrotter/ui';
import {
  Plane,
  LayoutDashboard,
  MapPin,
  Calendar,
  Wallet,
  FileText,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Compass,
  Users,
  Bell,
  Map,
  Cloud,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', href: '/trips', icon: MapPin },
  { name: 'Route Planner', href: '/route-planner', icon: Map },
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Documents', href: '/documents', icon: FileText },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Community', href: '/community', icon: Users },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/support', icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Only visible on large screens */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col',
          collapsed ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/25">
                <Plane className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  GlobeTrotter
                </span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform',
                  collapsed && 'rotate-180'
                )}
              />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/10 to-violet-500/10 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive
                          ? 'text-primary-500'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                    {isActive && !collapsed && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Secondary Navigation */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Explore
                </h3>
              )}
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/10 to-violet-500/10 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {[navigation[0], navigation[1], navigation[2], navigation[4], secondaryNavigation[0]].map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary-500')} />
                <span>{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
