import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  stats: {
    trips: number;
    countries: number;
    photos: number;
    reviews: number;
  };
  preferences: {
    travelStyle: string[];
    notifications: boolean;
    currency: string;
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@globetrotter_auth';

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'Alex Thompson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  memberSince: '2023-01-15',
  stats: {
    trips: 12,
    countries: 8,
    photos: 156,
    reviews: 24,
  },
  preferences: {
    travelStyle: ['Adventure', 'Cultural'],
    notifications: true,
    currency: 'USD',
    language: 'en',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, validate against your API
    if (email && password) {
      const loggedInUser = { ...mockUser, email };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      ...mockUser,
      id: Date.now().toString(),
      name,
      email,
      memberSince: new Date().toISOString().split('T')[0],
      stats: {
        trips: 0,
        countries: 0,
        photos: 0,
        reviews: 0,
      },
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
