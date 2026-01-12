import { Router, type Router as ExpressRouter } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router: ExpressRouter = Router();

// Mock user data
const userProfiles = new Map<string, {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
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
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
  }>;
}>();

// Get user profile
router.get('/profile', authenticate, (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    let profile = userProfiles.get(userId);

    // Create default profile if doesn't exist
    if (!profile) {
      profile = {
        id: userId,
        name: req.user!.name,
        email: req.user!.email,
        stats: {
          trips: 0,
          countries: 0,
          photos: 0,
          reviews: 0,
        },
        preferences: {
          travelStyle: ['Adventure'],
          notifications: true,
          currency: 'USD',
          language: 'en',
        },
        badges: [],
      };
      userProfiles.set(userId, profile);
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const updates = req.body;

    let profile = userProfiles.get(userId);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'bio', 'location', 'avatar', 'preferences'];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (profile as any)[key] = updates[key];
      }
    });

    userProfiles.set(userId, profile);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// Get user's travel stats
router.get('/stats', authenticate, (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const profile = userProfiles.get(userId);

    res.json({
      success: true,
      data: profile?.stats || {
        trips: 0,
        countries: 0,
        photos: 0,
        reviews: 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get user's badges
router.get('/badges', authenticate, (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const profile = userProfiles.get(userId);

    res.json({
      success: true,
      data: profile?.badges || [],
    });
  } catch (error) {
    next(error);
  }
});

// Update preferences
router.put('/preferences', authenticate, (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const preferences = req.body;

    let profile = userProfiles.get(userId);
    if (profile) {
      profile.preferences = { ...profile.preferences, ...preferences };
      userProfiles.set(userId, profile);
    }

    res.json({
      success: true,
      data: profile?.preferences,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
