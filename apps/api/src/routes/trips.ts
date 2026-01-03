import { Router, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateTrip, validatePagination } from '../middleware/validators.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// In-memory trip store
const trips = new Map<string, {
  id: string;
  userId: string;
  title: string;
  destination: string;
  destinationCountry: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'planned' | 'ongoing' | 'completed' | 'cancelled';
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  travelers: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'owner' | 'editor' | 'viewer';
  }>;
  itinerary: Array<{
    day: number;
    date: string;
    title: string;
    activities: Array<{
      id: string;
      time: string;
      title: string;
      description?: string;
      type: string;
      location?: {
        name: string;
        lat: number;
        lng: number;
      };
      cost?: number;
      duration?: number;
      notes?: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}>();

// Get all trips for user
router.get('/', authenticate, validatePagination, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    let userTrips = Array.from(trips.values())
      .filter(trip => trip.userId === userId);

    // Filter by status
    if (status && typeof status === 'string') {
      userTrips = userTrips.filter(trip => trip.status === status);
    }

    // Sort by start date descending
    userTrips.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTrips = userTrips.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedTrips,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: userTrips.length,
        totalPages: Math.ceil(userTrips.length / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single trip
router.get('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const trip = trips.get(id);

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    // Check if user has access
    if (trip.userId !== req.user!.id && !trip.travelers.some(t => t.id === req.user!.id)) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
});

// Create new trip
router.post('/', authenticate, validateTrip, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400, errors.array());
    }

    const userId = req.user!.id;
    const { title, destination, destinationCountry, coverImage, startDate, endDate, budget } = req.body;

    const trip = {
      id: uuidv4(),
      userId,
      title,
      destination,
      destinationCountry: destinationCountry || '',
      coverImage,
      startDate,
      endDate,
      status: 'planned' as const,
      budget: {
        total: budget?.total || 0,
        spent: 0,
        currency: budget?.currency || 'USD',
      },
      travelers: [{
        id: userId,
        name: req.user!.name,
        email: req.user!.email,
        role: 'owner' as const,
      }],
      itinerary: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trips.set(trip.id, trip);

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
});

// Update trip
router.put('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trip = trips.get(id);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    // Check ownership
    if (trip.userId !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'destination', 'destinationCountry', 'coverImage', 'startDate', 'endDate', 'status', 'budget', 'itinerary'];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (trip as any)[key] = updates[key];
      }
    });

    trip.updatedAt = new Date().toISOString();
    trips.set(id, trip);

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
});

// Delete trip
router.delete('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const trip = trips.get(id);

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    trips.delete(id);

    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Add traveler to trip
router.post('/:id/travelers', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;

    const trip = trips.get(id);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== req.user!.id) {
      throw new AppError('Only the owner can add travelers', 403);
    }

    const newTraveler = {
      id: uuidv4(),
      name,
      email,
      role: role || 'viewer',
    };

    trip.travelers.push(newTraveler);
    trip.updatedAt = new Date().toISOString();
    trips.set(id, trip);

    res.status(201).json({
      success: true,
      data: trip.travelers,
    });
  } catch (error) {
    next(error);
  }
});

// Add activity to itinerary
router.post('/:id/itinerary/:day/activities', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id, day } = req.params;
    const activityData = req.body;

    const trip = trips.get(id);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const dayNum = parseInt(day);
    let dayItinerary = trip.itinerary.find(d => d.day === dayNum);

    if (!dayItinerary) {
      // Create day if doesn't exist
      const startDate = new Date(trip.startDate);
      startDate.setDate(startDate.getDate() + dayNum - 1);
      
      dayItinerary = {
        day: dayNum,
        date: startDate.toISOString().split('T')[0],
        title: `Day ${dayNum}`,
        activities: [],
      };
      trip.itinerary.push(dayItinerary);
      trip.itinerary.sort((a, b) => a.day - b.day);
    }

    const activity = {
      id: uuidv4(),
      ...activityData,
    };

    dayItinerary.activities.push(activity);
    trip.updatedAt = new Date().toISOString();
    trips.set(id, trip);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
