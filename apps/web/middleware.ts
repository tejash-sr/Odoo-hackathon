// Authentication Middleware - GlobeTrotter
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, setAuthCookies } from '@/lib/auth';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/explore',
  '/discover',
  '/community',
];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and api routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = false;
  let user = null;

  // Check access token
  if (accessToken) {
    user = await verifyAccessToken(accessToken);
    isAuthenticated = !!user;
  }

  // If access token invalid/expired, try refresh token
  if (!isAuthenticated && refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    
    if (refreshPayload) {
      // Generate new access token
      const newAccessToken = await generateAccessToken({
        id: refreshPayload.userId,
        email: refreshPayload.email,
        firstName: '',
        lastName: '',
      });

      const response = NextResponse.next();
      
      // Set new access token cookie
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });

      user = refreshPayload;
      isAuthenticated = true;

      // If trying to access auth routes while logged in, redirect to dashboard
      if (authRoutes.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/trips', request.url));
      }

      return response;
    }
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If accessing auth routes while authenticated, redirect to dashboard
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/trips', request.url));
  }

  // If accessing protected route without authentication
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add user info to headers for API routes
  const response = NextResponse.next();
  
  if (user) {
    response.headers.set('x-user-id', user.userId);
    response.headers.set('x-user-email', user.email);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
