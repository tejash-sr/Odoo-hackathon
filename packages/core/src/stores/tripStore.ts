import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Trip, TripDestination, ItineraryDay, Activity } from '@globetrotter/types';

export interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  
  // Trip CRUD
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  fetchTrips: () => Promise<void>;
  fetchTrip: (tripId: string) => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  updateTrip: (tripId: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  
  // Destination management
  addDestination: (tripId: string, destination: TripDestination) => Promise<void>;
  updateDestination: (tripId: string, destinationIndex: number, data: Partial<TripDestination>) => Promise<void>;
  removeDestination: (tripId: string, destinationIndex: number) => Promise<void>;
  reorderDestinations: (tripId: string, sourceIndex: number, destinationIndex: number) => Promise<void>;
  
  // Itinerary management
  addItineraryDay: (tripId: string, day: ItineraryDay) => Promise<void>;
  updateItineraryDay: (tripId: string, dayIndex: number, data: Partial<ItineraryDay>) => Promise<void>;
  removeItineraryDay: (tripId: string, dayIndex: number) => Promise<void>;
  
  // Activity management
  addActivity: (tripId: string, dayIndex: number, activity: Activity) => Promise<void>;
  updateActivity: (tripId: string, dayIndex: number, activityIndex: number, data: Partial<Activity>) => Promise<void>;
  removeActivity: (tripId: string, dayIndex: number, activityIndex: number) => Promise<void>;
  reorderActivities: (tripId: string, dayIndex: number, sourceIndex: number, destIndex: number) => Promise<void>;
}

export const useTripStore = create<TripState>()(
  devtools(
    (set, get) => ({
      trips: [],
      currentTrip: null,
      isLoading: false,
      error: null,

      setTrips: (trips) => set({ trips }),
      setCurrentTrip: (trip) => set({ currentTrip: trip }),

      fetchTrips: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/trips');
          if (!response.ok) throw new Error('Failed to fetch trips');
          const trips = await response.json();
          set({ trips, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trips',
            isLoading: false 
          });
        }
      },

      fetchTrip: async (tripId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/trips/${tripId}`);
          if (!response.ok) throw new Error('Failed to fetch trip');
          const trip = await response.json();
          set({ currentTrip: trip, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trip',
            isLoading: false 
          });
        }
      },

      createTrip: async (tripData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData),
          });
          if (!response.ok) throw new Error('Failed to create trip');
          const trip = await response.json();
          set((state) => ({ 
            trips: [...state.trips, trip],
            currentTrip: trip,
            isLoading: false 
          }));
          return trip;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create trip',
            isLoading: false 
          });
          throw error;
        }
      },

      updateTrip: async (tripId, data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/trips/${tripId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error('Failed to update trip');
          const updatedTrip = await response.json();
          set((state) => ({
            trips: state.trips.map((t) => t.id === tripId ? updatedTrip : t),
            currentTrip: state.currentTrip?.id === tripId ? updatedTrip : state.currentTrip,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update trip',
            isLoading: false 
          });
        }
      },

      deleteTrip: async (tripId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Failed to delete trip');
          set((state) => ({
            trips: state.trips.filter((t) => t.id !== tripId),
            currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete trip',
            isLoading: false 
          });
        }
      },

      addDestination: async (tripId, destination) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedDestinations = [...currentTrip.destinations, destination];
        await get().updateTrip(tripId, { destinations: updatedDestinations });
      },

      updateDestination: async (tripId, destinationIndex, data) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedDestinations = currentTrip.destinations.map((d, i) =>
          i === destinationIndex ? { ...d, ...data } : d
        );
        await get().updateTrip(tripId, { destinations: updatedDestinations });
      },

      removeDestination: async (tripId, destinationIndex) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedDestinations = currentTrip.destinations.filter((_, i) => i !== destinationIndex);
        await get().updateTrip(tripId, { destinations: updatedDestinations });
      },

      reorderDestinations: async (tripId, sourceIndex, destIndex) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedDestinations = [...currentTrip.destinations];
        const [removed] = updatedDestinations.splice(sourceIndex, 1);
        updatedDestinations.splice(destIndex, 0, removed);
        await get().updateTrip(tripId, { destinations: updatedDestinations });
      },

      addItineraryDay: async (tripId, day) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = [...currentTrip.itinerary, day];
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      updateItineraryDay: async (tripId, dayIndex, data) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.map((d, i) =>
          i === dayIndex ? { ...d, ...data } : d
        );
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      removeItineraryDay: async (tripId, dayIndex) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.filter((_, i) => i !== dayIndex);
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      addActivity: async (tripId, dayIndex, activity) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.map((day, i) =>
          i === dayIndex
            ? { ...day, activities: [...day.activities, activity] }
            : day
        );
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      updateActivity: async (tripId, dayIndex, activityIndex, data) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.map((day, i) =>
          i === dayIndex
            ? {
                ...day,
                activities: day.activities.map((a, j) =>
                  j === activityIndex ? { ...a, ...data } : a
                ),
              }
            : day
        );
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      removeActivity: async (tripId, dayIndex, activityIndex) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.map((day, i) =>
          i === dayIndex
            ? { ...day, activities: day.activities.filter((_, j) => j !== activityIndex) }
            : day
        );
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },

      reorderActivities: async (tripId, dayIndex, sourceIndex, destIndex) => {
        const { currentTrip } = get();
        if (!currentTrip || currentTrip.id !== tripId) return;

        const updatedItinerary = currentTrip.itinerary.map((day, i) => {
          if (i !== dayIndex) return day;
          const activities = [...day.activities];
          const [removed] = activities.splice(sourceIndex, 1);
          activities.splice(destIndex, 0, removed);
          return { ...day, activities };
        });
        await get().updateTrip(tripId, { itinerary: updatedItinerary });
      },
    }),
    { name: 'trip-store' }
  )
);
