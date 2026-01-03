// Register API Route - GlobeTrotter
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { 
  hashPassword, 
  generateTokens, 
  setAuthCookies 
} from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with profile and preferences
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        isVerified: false,
        isActive: true,
        xp: 0,
        level: 1,
        streak: 0,
        profile: {
          create: {
            bio: null,
            currentTitle: 'Novice Explorer',
            totalTrips: 0,
            totalCountries: 0,
            totalDistance: 0,
            theme: 'default',
            accentColor: '#4F46E5',
          },
        },
        preferences: {
          create: {
            currency: 'USD',
            language: 'en',
            distanceUnit: 'km',
            temperatureUnit: 'celsius',
            travelStyle: 'mid-range',
            pushEnabled: true,
            emailEnabled: true,
            flightAlerts: true,
            priceAlerts: true,
            weatherAlerts: true,
            tripReminders: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Award "Welcome" badge (if exists)
    const welcomeBadge = await prisma.badge.findFirst({
      where: { name: 'Welcome' },
    });

    if (welcomeBadge && user.profile) {
      await prisma.userBadge.create({
        data: {
          profileId: user.profile.id,
          badgeId: welcomeBadge.id,
          userId: user.id,
        },
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    });

    // Create response
    const responseData = {
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        xp: user.xp,
        level: user.level,
        profile: user.profile ? {
          currentTitle: user.profile.currentTitle,
        } : null,
      },
    };

    const response = NextResponse.json(responseData, { status: 201 });
    
    // Set httpOnly cookies
    return setAuthCookies(response, accessToken, refreshToken);

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
