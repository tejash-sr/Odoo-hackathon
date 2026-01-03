'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function PWAStatus() {
  const { isOnline, isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setShowOfflineBanner(!isOnline);
  }, [isOnline]);

  useEffect(() => {
    if (isUpdateAvailable && !dismissed) {
      setShowUpdateBanner(true);
    }
  }, [isUpdateAvailable, dismissed]);

  const handleDismissUpdate = () => {
    setShowUpdateBanner(false);
    setDismissed(true);
  };

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-3 shadow-lg"
          >
            <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-3">
              <WifiOff className="w-5 h-5 animate-pulse" />
              <span className="font-medium">
                You&apos;re offline. Some features may be limited.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Toast */}
      <AnimatePresence>
        {isOnline && !showOfflineBanner && (
          <OnlineToast />
        )}
      </AnimatePresence>

      {/* Update Available Banner */}
      <AnimatePresence>
        {showUpdateBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Update Available</h3>
                  <p className="text-sm text-indigo-100 mt-1">
                    A new version of GlobeTrotter is ready. Refresh to update.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={updateServiceWorker}
                      className="px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Refresh Now
                    </button>
                    <button
                      onClick={handleDismissUpdate}
                      className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDismissUpdate}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function OnlineToast() {
  const [show, setShow] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Only show if we were previously offline
    const checkPrevious = sessionStorage.getItem('wasOffline');
    if (checkPrevious === 'true') {
      setWasOffline(true);
      setShow(true);
      sessionStorage.removeItem('wasOffline');
      
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Track offline state
  useEffect(() => {
    const handleOffline = () => {
      sessionStorage.setItem('wasOffline', 'true');
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  if (!show || !wasOffline) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Wifi className="w-4 h-4" />
        <span className="font-medium text-sm">Back online</span>
      </div>
    </motion.div>
  );
}
