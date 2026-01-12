// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  preferences: UserPreferences;
  loyaltyPrograms: LoyaltyProgram[];
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  currency: string;
  language: string;
  distanceUnit: 'km' | 'miles';
  temperatureUnit: 'celsius' | 'fahrenheit';
  travelStyle: TravelStyle;
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  budgetRange: BudgetRange;
  preferredAirlines: string[];
  preferredHotelChains: string[];
  notificationSettings: NotificationSettings;
}

export type TravelStyle = 
  | 'budget' 
  | 'mid-range' 
  | 'luxury' 
  | 'adventure' 
  | 'family' 
  | 'business' 
  | 'solo' 
  | 'romantic';

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface LoyaltyProgram {
  id: string;
  provider: string;
  programName: string;
  membershipId: string;
  tier?: string;
  points?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  flightAlerts: boolean;
  priceAlerts: boolean;
  weatherAlerts: boolean;
  tripReminders: boolean;
  marketingEmails: boolean;
}

// Trip & Itinerary Types
export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  status: TripStatus;
  visibility: 'private' | 'shared' | 'public';
  startDate: Date;
  endDate: Date;
  destinations: TripDestination[];
  itinerary: ItineraryDay[];
  travelers: TripTraveler[];
  budget: TripBudget;
  documents: TravelDocument[];
  notes: TripNote[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TripStatus = 
  | 'planning' 
  | 'booked' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled';

export interface TripDestination {
  id: string;
  placeId: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: Coordinates;
  arrivalDate: Date;
  departureDate: Date;
  accommodation?: Accommodation;
  transportation?: Transportation;
  order: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  date: Date;
  dayNumber: number;
  title?: string;
  activities: Activity[];
  meals: Meal[];
  notes?: string;
  weather?: WeatherForecast;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  type: ActivityType;
  location: Location;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  price?: Price;
  bookingReference?: string;
  bookingUrl?: string;
  status: 'planned' | 'booked' | 'completed' | 'cancelled';
  photos: string[];
  notes?: string;
  rating?: number;
  tips?: string[];
}

export type ActivityType = 
  | 'sightseeing' 
  | 'tour' 
  | 'museum' 
  | 'restaurant' 
  | 'shopping' 
  | 'entertainment' 
  | 'outdoor' 
  | 'wellness' 
  | 'nightlife' 
  | 'cultural' 
  | 'adventure' 
  | 'relaxation'
  | 'transportation'
  | 'accommodation'
  | 'other';

export interface Location {
  id: string;
  placeId?: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  phone?: string;
  website?: string;
  openingHours?: OpeningHours[];
  rating?: number;
  reviewCount?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  photos: string[];
  categories: string[];
}

export interface OpeningHours {
  day: number; // 0-6, Sunday-Saturday
  open: string;
  close: string;
  isOpen24Hours?: boolean;
  isClosed?: boolean;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant?: Location;
  isPlanned: boolean;
  notes?: string;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface TripTraveler {
  userId?: string;
  name: string;
  email?: string;
  role: 'organizer' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
}

export interface TripBudget {
  total: Price;
  spent: Price;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  allocated: Price;
  spent: Price;
  icon: string;
}

export interface TravelDocument {
  id: string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  expiryDate?: Date;
  notes?: string;
  uploadedAt: Date;
}

export type DocumentType = 
  | 'passport' 
  | 'visa' 
  | 'id-card' 
  | 'boarding-pass' 
  | 'hotel-confirmation' 
  | 'car-rental' 
  | 'insurance' 
  | 'vaccination' 
  | 'receipt' 
  | 'other';

export interface TripNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Accommodation Types
export interface Accommodation {
  id: string;
  type: AccommodationType;
  name: string;
  location: Location;
  checkIn: Date;
  checkOut: Date;
  checkInTime: string;
  checkOutTime: string;
  confirmationNumber?: string;
  price: Price;
  roomType?: string;
  amenities: string[];
  photos: string[];
  rating?: number;
  reviewCount?: number;
  policies?: AccommodationPolicies;
  contact?: ContactInfo;
}

export type AccommodationType = 
  | 'hotel' 
  | 'hostel' 
  | 'apartment' 
  | 'villa' 
  | 'resort' 
  | 'bnb' 
  | 'camping' 
  | 'other';

export interface AccommodationPolicies {
  cancellationPolicy?: string;
  paymentPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
  childPolicy?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

// Transportation Types
export interface Transportation {
  id: string;
  type: TransportationType;
  provider?: string;
  departureLocation: Location;
  arrivalLocation: Location;
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // in minutes
  price?: Price;
  confirmationNumber?: string;
  details: TransportationDetails;
}

export type TransportationType = 
  | 'flight' 
  | 'train' 
  | 'bus' 
  | 'car-rental' 
  | 'ferry' 
  | 'taxi' 
  | 'rideshare' 
  | 'private-transfer';

export interface TransportationDetails {
  // Flight specific
  flightNumber?: string;
  airline?: string;
  aircraft?: string;
  seatNumber?: string;
  class?: 'economy' | 'premium-economy' | 'business' | 'first';
  terminal?: string;
  gate?: string;
  
  // Train specific
  trainNumber?: string;
  carriage?: string;
  
  // Car rental specific
  vehicleType?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  licensePlate?: string;
  
  // General
  notes?: string;
}

// Destination & Discovery Types
export interface Destination {
  id: string;
  placeId: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  coordinates: Coordinates;
  timezone: string;
  description: string;
  highlights: string[];
  photos: string[];
  coverImage: string;
  rating: number;
  reviewCount: number;
  bestTimeToVisit: BestTimeToVisit;
  weather: DestinationWeather;
  safety: SafetyInfo;
  visa: VisaInfo;
  currency: CurrencyInfo;
  language: LanguageInfo;
  culture: CultureInfo;
  transportation: LocalTransportation;
  attractions: Attraction[];
  neighborhoods: Neighborhood[];
  tags: string[];
  popularFor: string[];
}

export interface BestTimeToVisit {
  peak: string[];
  shoulder: string[];
  offPeak: string[];
  recommendation: string;
}

export interface DestinationWeather {
  current?: WeatherForecast;
  monthly: MonthlyWeather[];
}

export interface WeatherForecast {
  date: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  precipitation?: number;
  uvIndex?: number;
}

export interface MonthlyWeather {
  month: number;
  avgHigh: number;
  avgLow: number;
  rainfall: number;
  rainyDays: number;
  sunnyDays: number;
}

export interface SafetyInfo {
  level: 'safe' | 'moderate' | 'caution' | 'avoid';
  advisories: string[];
  emergencyNumbers: EmergencyNumbers;
  healthInfo: string[];
  commonScams: string[];
  safeAreas: string[];
  areasToAvoid: string[];
  lastUpdated: Date;
}

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
  touristPolice?: string;
  embassy?: string;
}

export interface VisaInfo {
  required: boolean;
  type?: string;
  duration?: string;
  cost?: Price;
  processingTime?: string;
  requirements: string[];
  exemptions: string[];
  onArrival: boolean;
  eVisa: boolean;
  notes?: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // to USD
  tipping: TippingInfo;
  paymentMethods: string[];
  atmAvailability: 'widespread' | 'common' | 'limited' | 'rare';
}

export interface TippingInfo {
  customary: boolean;
  percentage?: number;
  notes: string;
}

export interface LanguageInfo {
  official: string[];
  spoken: string[];
  englishProficiency: 'high' | 'moderate' | 'low' | 'very-low';
  usefulPhrases: Phrase[];
}

export interface Phrase {
  english: string;
  local: string;
  pronunciation?: string;
}

export interface CultureInfo {
  customs: string[];
  etiquette: string[];
  dressCode: string;
  religiousConsiderations: string[];
  publicHolidays: PublicHoliday[];
}

export interface PublicHoliday {
  name: string;
  date: string;
  description?: string;
}

export interface LocalTransportation {
  options: TransportOption[];
  tips: string[];
  apps: TransportApp[];
}

export interface TransportOption {
  type: string;
  description: string;
  cost: string;
  recommended: boolean;
}

export interface TransportApp {
  name: string;
  type: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export interface Attraction {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  location: Location;
  rating: number;
  reviewCount: number;
  price?: Price;
  duration: string;
  photos: string[];
  tips: string[];
  bestTime: string;
  accessibility: string[];
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  vibe: string[];
  bestFor: string[];
  safetyLevel: 'very-safe' | 'safe' | 'moderate' | 'caution';
  walkability: number; // 1-10
  photos: string[];
}

// Road Trip & Navigation Types
export interface Route {
  id: string;
  origin: Location;
  destination: Location;
  waypoints: Waypoint[];
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
  steps: RouteStep[];
  alternatives: Route[];
  tollInfo?: TollInfo;
  fuelEstimate?: FuelEstimate;
}

export interface Waypoint {
  location: Location;
  stopDuration?: number;
  type: WaypointType;
}

export type WaypointType = 
  | 'gas-station' 
  | 'rest-area' 
  | 'restaurant' 
  | 'hotel' 
  | 'attraction' 
  | 'ev-charging' 
  | 'parking' 
  | 'custom';

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
  maneuver?: string;
}

export interface TollInfo {
  hasTolls: boolean;
  estimatedCost: Price;
  tollPoints: TollPoint[];
}

export interface TollPoint {
  name: string;
  location: Coordinates;
  cost: Price;
}

export interface FuelEstimate {
  liters: number;
  cost: Price;
  fuelType: string;
}

// Nearby Services Types
export interface NearbyService {
  id: string;
  type: ServiceType;
  name: string;
  location: Location;
  distance: number;
  duration: number;
  isOpen: boolean;
  rating?: number;
  details: ServiceDetails;
}

export type ServiceType = 
  | 'gas-station' 
  | 'ev-charging' 
  | 'rest-area' 
  | 'parking' 
  | 'restaurant' 
  | 'cafe' 
  | 'hotel' 
  | 'hospital' 
  | 'pharmacy' 
  | 'atm' 
  | 'bank' 
  | 'police' 
  | 'restroom';

export interface ServiceDetails {
  // Gas station specific
  fuelPrices?: FuelPrice[];
  fuelTypes?: string[];
  hasConvenienceStore?: boolean;
  
  // EV charging specific
  chargerTypes?: string[];
  availableChargers?: number;
  totalChargers?: number;
  chargingSpeed?: string;
  
  // Restaurant specific
  cuisine?: string[];
  priceLevel?: number;
  
  // General
  amenities?: string[];
  paymentMethods?: string[];
}

export interface FuelPrice {
  type: string;
  price: Price;
  unit: 'liter' | 'gallon';
}

// Expense Tracking Types
export interface Expense {
  id: string;
  tripId: string;
  userId: string;
  category: ExpenseCategory;
  amount: Price;
  convertedAmount?: Price;
  description: string;
  date: Date;
  location?: string;
  receipt?: string;
  paymentMethod?: string;
  splitWith?: ExpenseSplit[];
  tags?: string[];
  createdAt: Date;
}

export type ExpenseCategory = 
  | 'accommodation' 
  | 'transportation' 
  | 'food' 
  | 'activities' 
  | 'shopping' 
  | 'entertainment' 
  | 'health' 
  | 'communication' 
  | 'tips' 
  | 'other';

export interface ExpenseSplit {
  userId: string;
  name: string;
  amount: Price;
  isPaid: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  type: BookingType;
  provider: string;
  status: BookingStatus;
  confirmationNumber: string;
  price: Price;
  details: BookingDetails;
  cancellationPolicy?: string;
  createdAt: Date;
}

export type BookingType = 
  | 'flight' 
  | 'hotel' 
  | 'car-rental' 
  | 'activity' 
  | 'transfer' 
  | 'insurance';

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export interface BookingDetails {
  // Flight
  flights?: FlightBooking[];
  passengers?: Passenger[];
  
  // Hotel
  hotel?: Accommodation;
  guests?: number;
  
  // Car rental
  vehicle?: VehicleBooking;
  driver?: DriverInfo;
  
  // Activity
  activity?: Activity;
  participants?: number;
}

export interface FlightBooking {
  flightNumber: string;
  airline: string;
  departure: FlightPoint;
  arrival: FlightPoint;
  class: string;
  status: FlightStatus;
}

export interface FlightPoint {
  airport: string;
  airportCode: string;
  terminal?: string;
  gate?: string;
  dateTime: Date;
}

export type FlightStatus = 
  | 'scheduled' 
  | 'delayed' 
  | 'boarding' 
  | 'departed' 
  | 'arrived' 
  | 'cancelled';

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  seatNumber?: string;
  frequentFlyerNumber?: string;
}

export interface VehicleBooking {
  type: string;
  make?: string;
  model?: string;
  features: string[];
  pickup: RentalPoint;
  dropoff: RentalPoint;
}

export interface RentalPoint {
  location: Location;
  dateTime: Date;
}

export interface DriverInfo {
  name: string;
  licenseNumber: string;
  licenseCountry: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'flight-update' 
  | 'booking-confirmation' 
  | 'price-alert' 
  | 'weather-alert' 
  | 'trip-reminder' 
  | 'check-in-reminder' 
  | 'document-expiry' 
  | 'social' 
  | 'system';

// Search & Filter Types
export interface SearchFilters {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  travelers?: number;
  budget?: BudgetRange;
  activityTypes?: ActivityType[];
  accommodationTypes?: AccommodationType[];
  rating?: number;
  amenities?: string[];
  sortBy?: SortOption;
}

export type SortOption = 
  | 'relevance' 
  | 'price-low' 
  | 'price-high' 
  | 'rating' 
  | 'distance' 
  | 'popularity';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
