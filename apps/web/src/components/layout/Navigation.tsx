'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, Map, Compass, Calendar, User } from 'lucide-react';

const mainNavItems = [
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/trips', label: 'My Trips', icon: Calendar },
  { href: '/dashboard', label: 'Dashboard', icon: Map },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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

    // Listen for login/logout events
    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';
  const navBg = isScrolled || !isHomePage ? 'bg-white/95 shadow-sm backdrop-blur-lg dark:bg-slate-900/95' : 'bg-transparent';
  const textColor = isScrolled || !isHomePage ? 'text-slate-900 dark:text-white' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${textColor}`}>GlobeTrotter</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${pathname === item.href ? 'text-blue-600 dark:text-blue-400' : textColor}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-violet-500">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                      {user.firstName?.[0]}{user.lastName?.[0] || ''}
                    </div>
                  )}
                </div>
                <span className={`font-medium ${textColor}`}>{user.firstName}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className={`font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${textColor}`}>Sign In</Link>
                <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden ${textColor}`} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-4">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${pathname === item.href ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                {user ? (
                  <Link href="/profile" className="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-violet-500">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                          {user.firstName?.[0]}{user.lastName?.[0] || ''}
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{user.firstName}</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="rounded-lg px-4 py-2 text-center font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Sign In</Link>
                    <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
