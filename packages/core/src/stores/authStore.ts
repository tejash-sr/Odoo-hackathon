import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserPreferences } from '@globetrotter/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            // API call would go here
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
              throw new Error('Invalid credentials');
            }
            
            const user = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false 
            });
          }
        },

        register: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Registration failed');
            }
            
            const user = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Registration failed',
              isLoading: false 
            });
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
            set({ user: null, isAuthenticated: false, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
          }
        },

        updateProfile: async (data) => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/user/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Update failed');
            }
            
            const updatedUser = await response.json();
            set({ user: { ...user, ...updatedUser }, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Update failed',
              isLoading: false 
            });
          }
        },

        updatePreferences: async (preferences) => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/user/preferences', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(preferences),
            });
            
            if (!response.ok) {
              throw new Error('Update failed');
            }
            
            set({ 
              user: { ...user, preferences },
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Update failed',
              isLoading: false 
            });
          }
        },
      }),
      {
        name: 'globetrotter-auth',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'auth-store' }
  )
);
