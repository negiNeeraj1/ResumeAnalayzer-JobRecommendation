import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * Verify JWT token from cookies
 * Use this in server components and API routes
 */
export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { authenticated: false, user: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return {
      authenticated: true,
      user: {
        userId: decoded.userId,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, user: null };
  }
}

/**
 * Get current user from localStorage (client-side only)
 * Use this in client components
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Clear user session (client-side)
 */
export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}

