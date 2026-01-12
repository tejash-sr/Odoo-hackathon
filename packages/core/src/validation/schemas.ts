import { z } from 'zod';

// User Validation
export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
});

export const userPreferencesSchema = z.object({
  travelStyle: z.array(z.enum(['adventure', 'relaxation', 'cultural', 'luxury', 'budget', 'eco-friendly'])),
  interests: z.array(z.string()),
  dietaryRestrictions: z.array(z.string()).optional(),
  accessibilityNeeds: z.array(z.string()).optional(),
  preferredAccommodation: z.enum(['hotel', 'hostel', 'apartment', 'resort', 'camping', 'any']).optional(),
  budgetRange: z.object({
    min: z.number().min(0),
    max: z.number().positive(),
    currency: z.string().default('USD'),
  }).optional(),
});

// Trip Validation
export const createTripSchema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  startDate: z.date().refine((date) => date >= new Date(), 'Start date must be in the future'),
  endDate: z.date(),
  destinations: z.array(z.object({
    placeId: z.string(),
    name: z.string(),
    country: z.string(),
    arrivalDate: z.date(),
    departureDate: z.date(),
  })).min(1, 'At least one destination is required'),
  budget: z.object({
    total: z.number().positive(),
    currency: z.string().default('USD'),
  }).optional(),
  visibility: z.enum(['private', 'friends', 'public']).default('private'),
  travelCompanions: z.array(z.string()).optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Activity Validation
export const activitySchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum([
    'sightseeing', 'dining', 'entertainment', 'shopping', 'outdoor',
    'cultural', 'nightlife', 'relaxation', 'transportation', 'accommodation', 'other'
  ]),
  startTime: z.date(),
  endTime: z.date(),
  location: z.object({
    name: z.string(),
    address: z.string().optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  }),
  cost: z.object({
    amount: z.number().min(0),
    currency: z.string().default('USD'),
  }).optional(),
  bookingRequired: z.boolean().default(false),
  bookingReference: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

// Expense Validation
export const expenseSchema = z.object({
  title: z.string().min(2).max(200),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  category: z.enum([
    'accommodation', 'transportation', 'food', 'activities',
    'shopping', 'entertainment', 'other'
  ]),
  date: z.date(),
  paidBy: z.string(),
  splitWith: z.array(z.string()).optional(),
  splitMethod: z.enum(['equal', 'percentage', 'custom']).default('equal'),
  receipt: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

// Booking Validation
export const bookingSchema = z.object({
  type: z.enum(['flight', 'hotel', 'car', 'activity', 'restaurant', 'other']),
  provider: z.string(),
  confirmationNumber: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  checkIn: z.date(),
  checkOut: z.date().optional(),
  totalCost: z.object({
    amount: z.number().min(0),
    currency: z.string().default('USD'),
  }),
  details: z.record(z.any()).optional(),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).optional(),
});

// Search Validation
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  destinations: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().positive(),
  }).optional(),
  rating: z.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  sortBy: z.enum(['relevance', 'price', 'rating', 'distance']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports from schemas
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type CreateTrip = z.infer<typeof createTripSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
