import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/trips/[id] - Get a single trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const trip = await prisma.trip.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
      include: {
        destinations: {
          orderBy: { orderIndex: 'asc' },
        },
        budget: true,
        expenses: {
          orderBy: { date: 'desc' },
        },
        checklists: {
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Calculate readiness score
    const readinessScore = calculateReadinessScore(trip);

    return NextResponse.json({
      ...trip,
      readinessScore,
    });
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
}

// PUT /api/trips/[id] - Update a trip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    // Check ownership
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found or access denied' },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      startDate,
      endDate,
      coverImage,
      status,
      visibility,
    } = body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(coverImage && { coverImage }),
        ...(status && { status }),
        ...(visibility && { visibility }),
      },
      include: {
        destinations: true,
        budget: true,
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id] - Delete a trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check ownership (only owner can delete)
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found or access denied' },
        { status: 404 }
      );
    }

    // Delete trip (cascades to related records)
    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}

// Helper function to calculate readiness score
function calculateReadinessScore(trip: {
  destinations?: { id: string }[];
  budget?: { id: string } | null;
  checklists?: { items: { isCompleted: boolean }[] }[];
}): number {
  let score = 30; // Base score for having a trip

  // Check destinations
  if (trip.destinations && trip.destinations.length > 0) {
    score += 20;
  }

  // Check budget
  if (trip.budget) {
    score += 15;
  }

  // Check checklist items
  if (trip.checklists && trip.checklists.length > 0) {
    const allItems = trip.checklists.flatMap(cl => cl.items);
    const completedItems = allItems.filter(item => item.isCompleted);
    if (allItems.length > 0) {
      score += Math.round((completedItems.length / allItems.length) * 35);
    }
  }

  return Math.min(score, 100);
}
