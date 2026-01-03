// Logout API Route - GlobeTrotter
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Simply clear the auth cookies to logout
    // JWT tokens are stateless, so no database cleanup needed
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    return clearAuthCookies(response);

  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if there's an error
    const response = NextResponse.json(
      { success: true, message: 'Logged out' },
      { status: 200 }
    );
    return clearAuthCookies(response);
  }
}
