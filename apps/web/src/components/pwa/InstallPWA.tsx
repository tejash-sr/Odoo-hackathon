'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Globe, Zap, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < dayInMs * 7) {
        return; // Don't show for a week after dismissal
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-violet-500 p-6 pb-16">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">GlobeTrotter</h2>
                  <p className="text-indigo-100 text-sm">Travel Readiness Platform</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="relative -mt-8 mx-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Install for the best experience
                </h3>
                <div className="space-y-3">
                  <Feature
                    icon={<Smartphone className="w-4 h-4" />}
                    color="indigo"
                    text="Works like a native app"
                  />
                  <Feature
                    icon={<WifiOff className="w-4 h-4" />}
                    color="emerald"
                    text="Access trips offline"
                  />
                  <Feature
                    icon={<Zap className="w-4 h-4" />}
                    color="orange"
                    text="Faster load times"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
              <button
                onClick={handleInstall}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <Download className="w-5 h-5" />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3 px-4 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feature({ 
  icon, 
  color, 
  text 
}: { 
  icon: React.ReactNode; 
  color: 'indigo' | 'emerald' | 'orange';
  text: string;
}) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        {icon}
      </div>
      <span className="text-sm text-slate-700 dark:text-slate-300">{text}</span>
    </div>
  );
}
