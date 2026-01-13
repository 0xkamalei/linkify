import { Context, Next } from 'hono';
import { adminAuth } from '../../../server/lib/firebaseAdmin';

/**
 * Middleware to verify Firebase JWT token and extract user ID
 * Adds userId to context for use in route handlers
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Add userId to context
    c.set('userId', decodedToken.uid);
    c.set('userEmail', decodedToken.email);

    await next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);

    if (error.code === 'auth/id-token-expired') {
      return c.json({ error: 'Token expired' }, 401);
    }

    if (error.code === 'auth/argument-error') {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 * Useful for public endpoints that can optionally use auth
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decodedToken = await adminAuth.verifyIdToken(token);

      c.set('userId', decodedToken.uid);
      c.set('userEmail', decodedToken.email);
    }

    await next();
  } catch (error) {
    // Silently fail - continue without auth
    await next();
  }
}

/**
 * Helper to get userId from context (throws if not authenticated)
 */
export function getUserId(c: Context): string {
  const userId = c.get('userId');

  if (!userId) {
    throw new Error('User not authenticated');
  }

  return userId;
}

/**
 * Helper to get userId from context (returns null if not authenticated)
 */
export function getOptionalUserId(c: Context): string | null {
  return c.get('userId') || null;
}

/**
 * Middleware to check resource ownership
 * Verifies that the authenticated user owns the resource
 */
export async function checkOwnership(resourceUserId: string, c: Context): Promise<boolean> {
  const userId = getUserId(c);
  return userId === resourceUserId;
}
