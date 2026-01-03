// Get Current User API Route - GlobeTrotter
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Type definitions
interface UserBadgeWithBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    color: string;
  };
  awardedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const tokenUser = await getCurrentUser(request);

    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      include: {
        profile: {
          include: {
            badges: {
              include: {
                badge: true,
              },
              orderBy: { awardedAt: 'desc' },
              take: 5,
            },
          },
        },
        preferences: true,
        _count: {
          select: {
            trips: true,
            documents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate upcoming trips
    const upcomingTrips = await prisma.trip.count({
      where: {
        userId: user.id,
        status: { in: ['planned', 'booked'] },
        startDate: { gt: new Date() },
      },
    });

    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        nationality: user.nationality,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        profile: user.profile ? {
          xp: user.profile.xp,
          level: user.profile.level,
          currentTitle: user.profile.currentTitle,
          totalTrips: user.profile.totalTrips,
          totalCountries: user.profile.totalCountries,
          totalDistance: user.profile.totalDistance,
          theme: user.profile.theme,
          accentColor: user.profile.accentColor,
          badges: user.profile.badges.map((ub: UserBadgeWithBadge) => ({
            id: ub.badge.id,
            name: ub.badge.name,
            description: ub.badge.description,
            iconUrl: ub.badge.iconUrl,
            color: ub.badge.color,
            awardedAt: ub.awardedAt,
          })),
        } : null,
        preferences: user.preferences,
        stats: {
          totalTrips: user._count.trips,
          totalDocuments: user._count.documents,
          upcomingTrips,
        },
      },
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}
