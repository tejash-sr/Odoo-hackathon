// JWT Authentication Library - GlobeTrotter
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'globetrotter-super-secret-key-change-in-production'
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'globetrotter-refresh-secret-change-in-production'
);

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  exp?: number;
  iat?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

// Generate Access Token
export async function generateAccessToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

// Generate Refresh Token
export async function generateRefreshToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_SECRET);
}

// Generate both tokens
export async function generateTokens(user: AuthUser) {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  return { accessToken, refreshToken };
}

// Verify Access Token
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// Verify Refresh Token
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// Set auth cookies (httpOnly, secure)
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}

// Clear auth cookies
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<TokenPayload | null> {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    return null;
  }

  return verifyAccessToken(accessToken);
}

// Get user from cookies (server component)
export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return null;
  }

  return verifyAccessToken(accessToken);
}

// Check if access token needs refresh (less than 5 minutes remaining)
export async function shouldRefreshToken(token: string): Promise<boolean> {
  try {
    const payload = await verifyAccessToken(token);
    if (!payload || !payload.exp) return true;

    const expiresAt = payload.exp * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return expiresAt - now < fiveMinutes;
  } catch {
    return true;
  }
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

// Get user ID from token in request
export async function getUserFromToken(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    return null;
  }

  const payload = await verifyAccessToken(accessToken);
  return payload?.userId || null;
}
