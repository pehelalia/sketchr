'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  getUserByClerkId,
  getUserByUsername,
  updateUserProfile,
  updateStreak,
  incrementStreak,
  getPublicUsers,
  searchUsers,
} from '@/lib/users';

/**
 * Server action to get current user's profile from database
 */
export async function getCurrentUserProfile() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    throw new Error('User not found in database');
  }

  return user;
}

/**
 * Server action to update current user's profile
 */
export async function updateCurrentUserProfile(data: {
  username?: string;
  displayName?: string;
  bio?: string;
  isPublic?: boolean;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if new username is already taken
  if (data.username) {
    const existing = await getUserByUsername(data.username);
    if (existing && existing.clerkId !== userId) {
      throw new Error('Username already taken');
    }
  }

  const user = await updateUserProfile(userId, data);
  return user;
}

/**
 * Server action to get user's public profile
 */
export async function getPublicUserProfile(username: string) {
  const user = await getUserByUsername(username);

  if (!user || !user.isPublic) {
    return null;
  }

  return user;
}

/**
 * Server action to increment user's streak
 */
export async function incrementCurrentUserStreak() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const user = await incrementStreak(userId);
  return user;
}

/**
 * Server action to get discovery feed (public users)
 */
export async function getDiscoveryFeed(limit: number = 10, offset: number = 0) {
  const users = await getPublicUsers(limit, offset);
  return users;
}

/**
 * Server action to search for users
 */
export async function searchForUsers(query: string, limit: number = 10) {
  if (!query || query.length < 2) {
    return [];
  }

  const users = await searchUsers(query, limit);
  return users;
}

/**
 * Get user by ID (safe - returns only if public)
 */
export async function getUserPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      currentStreak: true,
      longestStreak: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
