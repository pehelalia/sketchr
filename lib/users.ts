import { prisma } from './prisma';

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

/**
 * Get user by database ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  clerkId: string,
  data: {
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string | null;
    isPublic?: boolean;
  }
) {
  return prisma.user.update({
    where: { clerkId },
    data,
  });
}

/**
 * Update streak
 */
export async function updateStreak(
  clerkId: string,
  data: { currentStreak?: number; longestStreak?: number }
) {
  return prisma.user.update({
    where: { clerkId },
    data,
  });
}

/**
 * Reset current streak
 */
export async function resetCurrentStreak(clerkId: string) {
  return prisma.user.update({
    where: { clerkId },
    data: { currentStreak: 0 },
  });
}

/**
 * Increment current streak
 */
export async function incrementStreak(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { currentStreak: true, longestStreak: true },
  });

  if (!user) return null;

  const newCurrentStreak = user.currentStreak + 1;
  const newLongestStreak = Math.max(user.longestStreak, newCurrentStreak);

  return prisma.user.update({
    where: { clerkId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
    },
  });
}

/**
 * Get all public users (for discovery/gallery)
 */
export async function getPublicUsers(limit: number = 10, offset: number = 0) {
  return prisma.user.findMany({
    where: { isPublic: true },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Search users by username or displayName
 */
export async function searchUsers(query: string, limit: number = 10) {
  return prisma.user.findMany({
    where: {
      isPublic: true,
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: limit,
  });
}
