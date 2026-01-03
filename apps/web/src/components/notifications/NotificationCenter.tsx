'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Plane,
  Calendar,
  AlertTriangle,
  Gift,
  MessageSquare,
  CreditCard,
  Cloud,
  Map,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: Record<string, any>;
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  trip_reminder: <Plane className="w-5 h-5" />,
  trip_update: <Calendar className="w-5 h-5" />,
  weather_alert: <Cloud className="w-5 h-5" />,
  price_alert: <CreditCard className="w-5 h-5" />,
  achievement: <Gift className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  location: <Map className="w-5 h-5" />,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  trip_reminder: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  trip_update: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  weather_alert: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400',
  price_alert: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
  achievement: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
  message: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
  warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
  location: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
};

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'trip_reminder',
          title: 'Trip to Paris starts in 3 days!',
          message: 'Make sure you have all your documents ready.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          actionUrl: '/trips/paris-2024',
        },
        {
          id: '2',
          type: 'weather_alert',
          title: 'Weather Alert for Tokyo',
          message: 'Heavy rain expected during your visit. Pack accordingly!',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          actionUrl: '/weather?city=tokyo',
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Achievement Unlocked! 🎉',
          message: 'You earned the "Road Warrior" badge for planning 5 trips.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          actionUrl: '/profile#achievements',
        },
        {
          id: '4',
          type: 'price_alert',
          title: 'Flight Price Drop',
          message: 'NYC to London flights dropped 23%! Book now to save.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
        {
          id: '5',
          type: 'message',
          title: 'New message from Sarah',
          message: 'Hey! Are we still on for the Barcelona trip?',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Unread
        </button>
        <div className="flex-1" />
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-2 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-medium">No notifications</p>
            <p className="text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`group relative p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    NOTIFICATION_COLORS[notification.type] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {NOTIFICATION_ICONS[notification.type] || <Bell className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Actions (shown on hover) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={clearAll}
            className="w-full py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}

// Notification Bell Button Component
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock data

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              <NotificationCenter onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
