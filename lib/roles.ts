'use client';

import { UserResource } from "@clerk/types";

export type UserRole = 'artist' | 'admin';

/**
 * Get the user's role from Clerk publicMetadata
 */
export function getUserRole(user: UserResource | null): UserRole {
  if (!user) return 'artist';
  
  const role = (user.publicMetadata as any)?.role as UserRole;
  return role && ['artist', 'admin'].includes(role) ? role : 'artist';
}

/**
 * Check if user has required role
 */
export function hasRole(user: UserResource | null, requiredRole: UserRole): boolean {
  const userRole = getUserRole(user);
  
  if (requiredRole === 'admin') {
    return userRole === 'admin';
  }
  
  // artist role or above can access artist resources
  return userRole === 'artist' || userRole === 'admin';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: UserResource | null): boolean {
  return getUserRole(user) === 'admin';
}

/**
 * Check if user is artist
 */
export function isArtist(user: UserResource | null): boolean {
  return getUserRole(user) === 'artist' || isAdmin(user);
}
