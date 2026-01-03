import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        const { accessToken } = response.data.data;
        await SecureStore.setItemAsync('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

// Trips API
export const tripsApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/trips', { params }),
  get: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  addTraveler: (id: string, data: { email: string; name: string; role?: string }) =>
    api.post(`/trips/${id}/travelers`, data),
  addActivity: (tripId: string, day: number, data: any) =>
    api.post(`/trips/${tripId}/itinerary/${day}/activities`, data),
};

// Destinations API
export const destinationsApi = {
  list: (params?: { category?: string; search?: string; page?: number }) =>
    api.get('/destinations', { params }),
  get: (id: string) => api.get(`/destinations/${id}`),
  popular: () => api.get('/destinations/featured/popular'),
  byCategory: (category: string) => api.get(`/destinations/category/${category}`),
  nearby: (lat: number, lng: number) => api.get(`/destinations/nearby/${lat}/${lng}`),
};

// Expenses API
export const expensesApi = {
  listByTrip: (tripId: string, params?: { category?: string; page?: number }) =>
    api.get(`/expenses/trip/${tripId}`, { params }),
  get: (id: string) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post('/expenses', data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  summary: (tripId: string) => api.get(`/expenses/trip/${tripId}/summary`),
  settlements: (tripId: string) => api.get(`/expenses/trip/${tripId}/settlements`),
};

// AI API
export const aiApi = {
  planTrip: (data: {
    destination: string;
    startDate: string;
    endDate: string;
    budget?: string;
    travelers?: number;
    interests?: string[];
    tripType?: string;
  }) => api.post('/ai/plan-trip', data),
  chat: (data: { message: string; context?: any }) =>
    api.post('/ai/chat', data),
  recommendDestinations: (data: {
    preferences?: string[];
    budget?: string;
    duration?: string;
    season?: string;
  }) => api.post('/ai/recommend-destinations', data),
  suggestActivities: (data: {
    destination: string;
    date?: string;
    existingActivities?: string[];
    preferences?: string[];
  }) => api.post('/ai/suggest-activities', data),
  packingList: (data: {
    destination: string;
    startDate: string;
    endDate: string;
    activities?: string[];
    climate?: string;
  }) => api.post('/ai/packing-list', data),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats'),
  getBadges: () => api.get('/users/badges'),
  updatePreferences: (data: any) => api.put('/users/preferences', data),
};

export default api;
