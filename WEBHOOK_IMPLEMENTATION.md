# Clerk Webhook Integration - Complete Setup

This document outlines all files created/modified for Clerk webhook integration with Prisma PostgreSQL.

## Files Summary

### 📦 Package Configuration

#### `package.json` (MODIFIED)
Added dependencies:
- `@prisma/client` - Prisma ORM client library
- `prisma` - Prisma CLI (dev dependency)
- `svix` - Webhook signature verification library

```json
{
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "svix": "^1.15.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0"
  }
}
```

### 🗄️ Database & Prisma

#### `prisma/schema.prisma` (NEW)
Defines the Prisma schema with PostgreSQL datasource and User model.

**User Model Fields:**
- `id` (String) - Primary key, auto-generated CUID
- `clerkId` (String) - Unique identifier from Clerk
- `username` (String) - Unique username (derived from email)
- `displayName` (String) - User's display name
- `bio` (String) - Optional bio
- `avatarUrl` (String) - Optional avatar image URL
- `isPublic` (Boolean) - Whether profile is public (default: true)
- `currentStreak` (Int) - Current streak count (default: 0)
- `longestStreak` (Int) - Longest streak ever (default: 0)
- `createdAt` (DateTime) - Account creation time
- `updatedAt` (DateTime) - Last update time

#### `lib/prisma.ts` (NEW)
Prisma client singleton utility.

**Key Features:**
- Reuses single Prisma client instance in development
- Prevents multiple client connections
- Exports `prisma` instance for use throughout app

**Usage:**
```typescript
import { prisma } from '@/lib/prisma';
const user = await prisma.user.findUnique({ where: { clerkId } });
```

### 📡 Webhook Handler

#### `app/api/webhooks/clerk/route.ts` (NEW)
Main webhook endpoint for handling Clerk events.

**Features:**
- ✅ Webhook signature verification using svix
- ✅ Handles `user.created` events
- ✅ Handles `user.updated` events (optional profile sync)
- ✅ Handles `user.deleted` events
- ✅ Error handling for constraint violations
- ✅ Proper HTTP status codes (201, 200, 404, 409, 500)

**Endpoint:** `POST /api/webhooks/clerk`

**Handles Events:**
1. **user.created** (201)
   - Creates new User record in database
   - Derives username from email
   - Sets display name from first/last name
   - Stores avatar URL from Clerk
   - Initializes streak fields to 0

2. **user.updated** (200)
   - Updates displayName if changed
   - Updates avatarUrl if changed
   - Syncs profile changes from Clerk

3. **user.deleted** (200)
   - Deletes user record from database
   - Cascading deletes handled by Prisma

### 🛠️ Database Utilities

#### `lib/users.ts` (NEW)
Helper functions for user database operations.

**Available Functions:**
- `getUserByClerkId(clerkId)` - Fetch user by Clerk ID
- `getUserByUsername(username)` - Fetch user by username
- `getUserById(id)` - Fetch user by database ID
- `updateUserProfile(clerkId, data)` - Update profile fields
- `updateStreak(clerkId, data)` - Update streak values
- `resetCurrentStreak(clerkId)` - Reset current streak to 0
- `incrementStreak(clerkId)` - Increment streak and update longest
- `getPublicUsers(limit, offset)` - Get public users (discovery)
- `searchUsers(query, limit)` - Search users by name/username

### ⚙️ Environment Configuration

#### `.env.example` (MODIFIED)
Updated template with all required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Webhook signing secret
- `DATABASE_URL` - PostgreSQL connection string
- Optional: Custom Clerk URLs

#### `.env.local.example` (NEW)
Example of filled-in `.env.local` file showing correct format:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/sketchr
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

### 📚 Documentation

#### `WEBHOOK_SETUP.md` (NEW)
Comprehensive guide covering:
1. **Architecture** - How webhooks flow
2. **Prerequisites** - What you need
3. **PostgreSQL Setup** - Local, Docker, or Cloud options
4. **Environment Configuration** - Setting up `.env.local`
5. **Database Initialization** - Running migrations
6. **Clerk Webhook Configuration** - Getting webhook secret
7. **Local Testing** - Using ngrok for local development
8. **Production Deployment** - Deploying to live servers
9. **Event Details** - Explanation of each webhook event
10. **Security** - Verification and best practices
11. **Troubleshooting** - Common issues and solutions
12. **Testing Methods** - Manual testing approaches
13. **Database Schema** - Field explanations
14. **Usage Examples** - How to use in your app

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local with:
# - PostgreSQL connection string
# - Clerk webhook secret
```

### 3. Initialize Database
```bash
npx prisma migrate dev --name init
```

### 4. Configure Clerk Webhook
- Go to https://dashboard.clerk.com/webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
- Select events: `user.created`, `user.updated`, `user.deleted`
- Copy signing secret to `CLERK_WEBHOOK_SECRET`

### 5. Test Locally
```bash
# In terminal 1
npm run dev

# In terminal 2
ngrok http 3000

# In Clerk dashboard, update webhook URL to ngrok URL
# Create a test user to verify
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Clerk Auth Service                  │
│  (Sign up, Sign in, Delete user)            │
└────────────────┬────────────────────────────┘
                 │
                 │ Trigger Webhook Event
                 ▼
┌─────────────────────────────────────────────┐
│    POST /api/webhooks/clerk                 │
│  (Route handler in Next.js)                 │
└────────────────┬────────────────────────────┘
                 │
                 ├─ Verify Signature (svix)
                 │
                 ├─ Parse Event Type
                 │
                 └─► user.created    ──► Create User in DB
                 └─► user.updated    ──► Update User Profile
                 └─► user.deleted    ──► Delete User from DB
                      │
                      ▼
              ┌──────────────────┐
              │  Prisma Client   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   PostgreSQL     │
              │   Database       │
              └──────────────────┘
```

---

## Event Flow Examples

### User Signs Up

```
1. User fills sign-up form
2. Clerk processes sign-up
3. User created in Clerk
4. Webhook: POST /api/webhooks/clerk
   {
     "type": "user.created",
     "data": { "id": "user_xyz", "email_addresses": [...], ... }
   }
5. Handler verifies signature
6. Handler creates User record:
   {
     clerkId: "user_xyz",
     username: "john.doe",
     displayName: "John Doe",
     avatarUrl: "https://...",
     isPublic: true,
     currentStreak: 0,
     longestStreak: 0
   }
7. User appears in database
```

### User Updates Profile

```
1. User updates name/avatar in Clerk profile
2. Webhook: POST /api/webhooks/clerk
   {
     "type": "user.updated",
     "data": { "id": "user_xyz", "first_name": "Johnny", ... }
   }
3. Handler verifies signature
4. Handler updates User record:
   {
     displayName: "Johnny Doe",
     avatarUrl: "https://..."
   }
```

### User is Deleted

```
1. Admin or user deletes account in Clerk
2. Webhook: POST /api/webhooks/clerk
   {
     "type": "user.deleted",
     "data": { "id": "user_xyz" }
   }
3. Handler verifies signature
4. Handler deletes User record from database
5. User data removed from your system
```

---

## Security Features

### ✅ Webhook Signature Verification
- Uses `svix` library to verify HMAC-SHA256 signatures
- Checks `svix-id`, `svix-timestamp`, `svix-signature` headers
- Rejects unverified requests with 400 status
- Prevents spoofed webhook events

### ✅ Secret Management
- `CLERK_WEBHOOK_SECRET` stored only in `.env.local`
- Never committed to version control
- Required to start the application

### ✅ Error Handling
- Graceful handling of duplicate events
- Safe handling of missing/already-deleted users
- Proper HTTP status codes for debugging
- Comprehensive logging

### ✅ Database Constraints
- `clerkId` is unique (prevents duplicate users)
- `username` is unique (prevents conflicts)
- Foreign key relationships (if added later)

---

## Database Migrations

### Create Initial Schema
```bash
npx prisma migrate dev --name init
```

### Create New Migration
```bash
# After changing schema.prisma
npx prisma migrate dev --name your_migration_name
```

### View Database
```bash
npx prisma studio
# Opens web UI showing all database records
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
# WARNING: Deletes all data
```

---

## Using Database Functions in Your App

### In Server Components
```typescript
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/users';

export default async function MyComponent() {
  const { userId } = auth();
  
  if (!userId) return <div>Sign in required</div>;
  
  const user = await getUserByClerkId(userId);
  
  return <div>Welcome, {user?.displayName}!</div>;
}
```

### In API Routes
```typescript
import { auth } from '@clerk/nextjs/server';
import { incrementStreak } from '@/lib/users';

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const user = await incrementStreak(userId);
  
  return new Response(JSON.stringify(user));
}
```

### In Client Components
```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function UserProfile() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState(null);
  
  useEffect(() => {
    if (isLoaded && user) {
      // Fetch from your API
      fetch(`/api/users/${user.id}`)
        .then(r => r.json())
        .then(setDbUser);
    }
  }, [isLoaded, user]);
  
  return <div>{dbUser?.displayName}</div>;
}
```

---

## Deployment Checklist

- [ ] PostgreSQL database provisioned (Render, Railway, Supabase, etc.)
- [ ] `DATABASE_URL` set in hosting platform
- [ ] `CLERK_WEBHOOK_SECRET` set in hosting platform
- [ ] Other Clerk env vars set (`CLERK_SECRET_KEY`, etc.)
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Webhook endpoint updated in Clerk dashboard
- [ ] Test webhook in production by creating a user
- [ ] Monitor logs for errors

---

## Files Checklist

- [x] `package.json` - Updated with dependencies
- [x] `prisma/schema.prisma` - User model defined
- [x] `lib/prisma.ts` - Prisma singleton
- [x] `lib/users.ts` - Database helper functions
- [x] `app/api/webhooks/clerk/route.ts` - Webhook handler
- [x] `.env.example` - Updated with new env vars
- [x] `.env.local.example` - Example filled-in env file
- [x] `WEBHOOK_SETUP.md` - Detailed setup guide
- [x] `WEBHOOK_IMPLEMENTATION.md` - This file

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Set up PostgreSQL**: Local, Docker, or cloud database
3. **Configure `.env.local`**: Add DATABASE_URL and CLERK_WEBHOOK_SECRET
4. **Run migrations**: `npx prisma migrate dev --name init`
5. **Get webhook secret**: From Clerk Dashboard
6. **Configure webhook**: Add endpoint in Clerk Dashboard
7. **Test locally**: Use ngrok for tunneling
8. **Deploy to production**: Update DATABASE_URL and webhook URL
9. **Create API routes**: Build endpoints to fetch/update user data
10. **Update components**: Use user data in your app

---

## Support & References

- **Clerk Documentation**: https://clerk.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs/
- **Svix Documentation**: https://www.svix.com/docs/
- **Webhook Best Practices**: https://www.svix.com/learning-center/webhooks/

