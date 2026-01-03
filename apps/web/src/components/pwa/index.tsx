'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { PWAStatus } from './PWAStatus';
import { InstallPWA } from './InstallPWA';

interface PWAContextType {
  isOnline: boolean;
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  updateServiceWorker: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: ReactNode }) {
  const sw = useServiceWorker();

  return (
    <PWAContext.Provider value={sw}>
      {children}
      <PWAStatus />
      <InstallPWA />
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}

export { PWAStatus } from './PWAStatus';
export { InstallPWA } from './InstallPWA';
