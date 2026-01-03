// Refresh Token API Route - GlobeTrotter
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { 
  verifyRefreshToken, 
  generateTokens, 
  setAuthCookies,
  clearAuthCookies 
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    
    if (!payload) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
      return clearAuthCookies(response);
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      const response = NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 401 }
      );
      return clearAuthCookies(response);
    }

    // Generate new tokens
    const tokens = await generateTokens({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    });

    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        profile: user.profile ? {
          currentTitle: user.profile.currentTitle,
        } : null,
      },
    };

    const response = NextResponse.json(responseData, { status: 200 });
    return setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

  } catch (error) {
    console.error('Token refresh error:', error);
    const response = NextResponse.json(
      { success: false, error: 'An error occurred during token refresh' },
      { status: 500 }
    );
    return clearAuthCookies(response);
  }
}
