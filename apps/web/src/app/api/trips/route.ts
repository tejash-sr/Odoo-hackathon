import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Types for trip-related entities
interface DestinationInput {
  name: string;
  country: string;
  city?: string;
}

// GET /api/trips - Get all trips for current user
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: { userId: string; status?: string } = {
      userId: payload.userId,
    };

    if (status && status !== 'all') {
      where.status = status.toLowerCase();
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          destinations: {
            orderBy: { orderIndex: 'asc' },
          },
          budget: true,
          checklists: {
            include: {
              items: true,
            },
          },
          _count: {
            select: {
              destinations: true,
              expenses: true,
              checklists: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.trip.count({ where }),
    ]);

    return NextResponse.json({
      trips,
      total,
      hasMore: offset + trips.length < total,
    });
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      name,
      description,
      startDate,
      endDate,
      destinations,
      budgetAmount,
      currency = 'USD',
      coverImage,
    } = body;

    // Validation
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Determine status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let status = 'planned';
    
    if (start <= now && end >= now) {
      status = 'active';
    } else if (end < now) {
      status = 'completed';
    }

    // Create trip with destinations and budget
    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverImage,
        status,
        userId: payload.userId,
        totalBudget: budgetAmount || 0,
        currency,
        destinations: destinations?.length > 0 ? {
          create: destinations.map((dest: DestinationInput, index: number) => ({
            name: dest.name,
            country: dest.country,
            city: dest.city || dest.name,
            orderIndex: index,
          })),
        } : undefined,
        budget: budgetAmount ? {
          create: {
            totalBudget: budgetAmount,
            currency,
          },
        } : undefined,
      },
      include: {
        destinations: true,
        budget: true,
      },
    });

    // Create default checklist
    await prisma.checklist.create({
      data: {
        tripId: trip.id,
        name: 'Pre-Trip Checklist',
        type: 'general',
        items: {
          create: [
            { text: 'Book flights', orderIndex: 0 },
            { text: 'Reserve accommodations', orderIndex: 1 },
            { text: 'Get travel insurance', orderIndex: 2 },
            { text: 'Check visa requirements', orderIndex: 3 },
            { text: 'Exchange currency', orderIndex: 4 },
            { text: 'Pack bags', orderIndex: 5 },
          ],
        },
      },
    });

    // Award XP for creating a trip
    await prisma.user.update({
      where: { id: payload.userId },
      data: { xp: { increment: 50 } },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Failed to create trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
