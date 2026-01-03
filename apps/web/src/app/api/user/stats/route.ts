import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Type definitions
interface Destination {
  id: string;
  name: string;
  country: string;
}

interface Budget {
  spentAmount: number;
}

interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  coverImage: string | null;
  readinessScore?: number;
  createdAt: Date;
  destinations: Destination[];
  budget: Budget | null;
}

interface UserBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    color: string;
    rarity: string;
  };
  earnedAt: Date;
}

interface UserAchievement {
  achievement: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    xpReward: number;
  };
  progress: number;
  earnedAt: Date | null;
}

interface UserWithRelations {
  id: string;
  email: string;
  xp: number;
  streak: number;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  badges: UserBadge[];
  achievements: UserAchievement[];
  trips: Trip[];
}

// GET /api/user/stats - Get user statistics and gamification data
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        badges: {
          include: {
            badge: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        trips: {
          include: {
            destinations: true,
            budget: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate statistics
    const stats = calculateUserStats(user);

    // Calculate level from XP
    const level = Math.floor(user.xp / 500) + 1;
    const currentLevelXP = user.xp % 500;
    const xpToNextLevel = 500 - currentLevelXP;

    // Get recent activity
    const recentTrips = user.trips
      .sort((a: Trip, b: Trip) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        xp: user.xp,
        level,
        currentLevelXP,
        xpToNextLevel,
        streak: user.streak,
      },
      stats,
      badges: user.badges.map((ub: UserBadge) => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
      })),
      achievements: user.achievements.map((ua: UserAchievement) => ({
        ...ua.achievement,
        progress: ua.progress,
        earnedAt: ua.earnedAt,
      })),
      recentTrips: recentTrips.map((trip: Trip) => ({
        id: trip.id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
        coverImage: trip.coverImage,
        destinations: trip.destinations.map((d: Destination) => d.name).join(', '),
      })),
    });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

function calculateUserStats(user: UserWithRelations) {
  const trips = user.trips || [];
  
  // Count trips by status
  const tripsByStatus = {
    planning: trips.filter((t: Trip) => t.status === 'PLANNING').length,
    upcoming: trips.filter((t: Trip) => t.status === 'UPCOMING').length,
    ongoing: trips.filter((t: Trip) => t.status === 'ONGOING').length,
    completed: trips.filter((t: Trip) => t.status === 'COMPLETED').length,
  };

  // Count unique countries
  const countriesVisited = new Set(
    trips
      .filter((t: Trip) => t.status === 'COMPLETED')
      .flatMap((t: Trip) => t.destinations.map((d: Destination) => d.country))
  ).size;

  // Total budget spent
  const totalSpent = trips.reduce((sum: number, trip: Trip) => {
    return sum + (trip.budget?.spentAmount || 0);
  }, 0);

  // Calculate average readiness for upcoming trips
  const upcomingTrips = trips.filter((t: Trip) => t.status === 'UPCOMING');
  const avgReadiness = upcomingTrips.length > 0
    ? Math.round(
        upcomingTrips.reduce((sum: number, t: Trip) => sum + (t.readinessScore || 70), 0) /
        upcomingTrips.length
      )
    : 0;

  // Days until next trip
  const nextTrip = trips
    .filter((t: Trip) => t.status === 'UPCOMING')
    .sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  
  const daysUntilNextTrip = nextTrip
    ? Math.ceil(
        (new Date(nextTrip.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    totalTrips: trips.length,
    tripsByStatus,
    countriesVisited,
    totalSpent,
    avgReadiness,
    daysUntilNextTrip,
    nextTripName: nextTrip?.name || null,
    badgesEarned: user.badges?.length || 0,
    achievementsCompleted: user.achievements?.filter((a: UserAchievement) => a.earnedAt).length || 0,
  };
}
