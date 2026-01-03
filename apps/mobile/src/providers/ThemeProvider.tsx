import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#e0e7ff',
  background: '#f8fafc',
  card: '#ffffff',
  cardAlt: '#f1f5f9',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

const darkColors: ThemeColors = {
  primary: '#818cf8',
  primaryLight: '#312e81',
  primaryDark: '#6366f1',
  background: '#0f172a',
  card: '#1e293b',
  cardAlt: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: '#334155',
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
