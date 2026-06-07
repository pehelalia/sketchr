# Clerk Webhook Setup Guide

This guide walks you through setting up Clerk webhooks to automatically sync user creation and deletion events with your Prisma PostgreSQL database.

## Architecture

```
Clerk User Signs Up
         ↓
    Webhook Triggered
         ↓
POST /api/webhooks/clerk
         ↓
    Verify Signature (svix)
         ↓
    Create User in Database
```

## Prerequisites

- Clerk account and application set up
- PostgreSQL database running
- Node.js 18+ installed

## Step 1: Set Up PostgreSQL

### Option A: PostgreSQL Locally (Windows)

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, set a password for the `postgres` user
3. Start PostgreSQL service (should start automatically)
4. Create a new database:
   ```bash
   psql -U postgres
   CREATE DATABASE sketchr;
   \q
   ```

### Option B: PostgreSQL via Docker

```bash
docker run -d \
  --name sketchr-postgres \
  -e POSTGRES_DB=sketchr \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:latest
```

### Option C: Cloud Managed Database

- **Render**: https://render.com (free tier available)
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com (MySQL, but similar)

Get your connection string from the provider.

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your database connection:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sketchr
   ```

   Replace:
   - `postgres` = database username
   - `password` = your PostgreSQL password
   - `localhost:5432` = database host:port
   - `sketchr` = database name

3. Add your Clerk keys (you should already have these from earlier setup):
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. Webhook secret (leave empty for now, you'll fill this in after configuring Clerk webhooks):
   ```
   CLERK_WEBHOOK_SECRET=your_webhook_secret_here
   ```

## Step 3: Install Dependencies and Generate Prisma Client

```bash
npm install
```

This installs:
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI (dev dependency)
- `svix` - For webhook signature verification

## Step 4: Create Database Tables

Initialize the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
1. Apply the Prisma schema to your database
2. Generate the Prisma client
3. Create the `User` table with the defined schema

You should see:
```
Your database is now in sync with your schema.
```

Verify the User table was created:
```bash
psql -U postgres -d sketchr -c "\dt"
```

You should see the `User` table listed.

## Step 5: Configure Clerk Webhooks

### 5.1 Get Your Webhook Secret

1. Go to https://dashboard.clerk.com
2. Navigate to **Webhooks** (usually under Integrations or Developer settings)
3. Click **Add Endpoint**
4. For now, enter a placeholder URL: `http://localhost:3000/api/webhooks/clerk`
5. Select events:
   - ✅ `user.created`
   - ✅ `user.updated` (optional, for profile sync)
   - ✅ `user.deleted`
6. Click **Create**
7. You'll see a **Signing Secret** - copy it

### 5.2 Add Webhook Secret to Environment

Update `.env.local`:
```
CLERK_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

## Step 6: Test the Webhook Locally

### 6.1 Start Your Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 6.2 Use Ngrok for Local Tunneling (RECOMMENDED)

To test webhooks locally, you need a public URL. Use ngrok:

1. Install ngrok from https://ngrok.com
2. Run:
   ```bash
   ngrok http 3000
   ```
3. You'll get a URL like: `https://abc123.ngrok.io`

### 6.3 Update Webhook Endpoint in Clerk

1. Go back to Clerk Webhooks
2. Edit the endpoint you created
3. Update URL to: `https://abc123.ngrok.io/api/webhooks/clerk`
4. Save

### 6.4 Test by Creating a User

1. Go to `http://localhost:3000/sign-up`
2. Create a new test account
3. Check your terminal for logs:
   ```
   User created in database: cm123xyz...
   ```
4. Verify in database:
   ```bash
   psql -U postgres -d sketchr -c "SELECT clerkId, username, displayName FROM \"User\";"
   ```

You should see your test user!

## Step 7: Deploy to Production

### 7.1 Environment Variables

Set these on your hosting platform:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

### 7.2 Update Clerk Webhook URL

1. In Clerk Dashboard → Webhooks
2. Edit endpoint
3. Update URL to your production domain:
   ```
   https://yourdomain.com/api/webhooks/clerk
   ```
4. Save

### 7.3 Run Migrations in Production

Before deploying, ensure your production database is set up:

```bash
npx prisma migrate deploy
```

Or add to your deployment script.

## Webhook Events Explained

### user.created

Triggered when a new user signs up in Clerk.

**Webhook Handler Actions:**
1. Extract user data (Clerk ID, email, name, avatar)
2. Create username from email
3. Create new `User` record in database
4. Set defaults: `isPublic=true`, `currentStreak=0`, `longestStreak=0`

**Example Payload:**
```json
{
  "type": "user.created",
  "data": {
    "id": "user_2abc123",
    "email_addresses": [
      { "email_address": "artist@example.com", "id": "idn_abc" }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://...",
    "profile_image_url": "https://..."
  }
}
```

### user.updated (Optional)

Triggered when a user updates their profile in Clerk.

**Webhook Handler Actions:**
1. Find user by Clerk ID
2. Update `displayName` and `avatarUrl`
3. Sync profile changes

### user.deleted

Triggered when a user is deleted from Clerk (via Dashboard or API).

**Webhook Handler Actions:**
1. Find user by Clerk ID
2. Delete user record from database
3. (Optional: Delete related data like sketches, galleries, etc.)

## Security Considerations

### ✅ Webhook Signature Verification

The handler verifies webhooks using **svix** library:
- Checks `svix-id`, `svix-timestamp`, `svix-signature` headers
- Verifies signature against `CLERK_WEBHOOK_SECRET`
- Rejects unverified requests with 400 status

### ✅ Environment Secrets

- Never commit `.env.local` to version control
- `.gitignore` already includes `.env*`
- Use `.env.example` as template for others

### ✅ Idempotency

The webhook handler handles duplicate events:
- `user.created`: Checks for existing user (P2002 unique constraint)
- `user.deleted`: Gracefully handles already-deleted users (P2025 not found)

## Troubleshooting

### Issue: "CLERK_WEBHOOK_SECRET is not set"
- Verify `.env.local` has `CLERK_WEBHOOK_SECRET` set
- Restart development server
- Check ngrok is running (if testing locally)

### Issue: "Webhook verification failed"
- Verify webhook secret matches Clerk dashboard
- Check ngrok URL is updated in Clerk
- Ensure `svix-*` headers are being sent

### Issue: "User not found" on update/delete
- Webhook may be trying to delete a user that already deleted
- Handler gracefully returns 404, which is safe
- Check database has the user before webhook fires

### Issue: Database connection error
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running: `psql -U postgres`
- Test connection: `psql $DATABASE_URL`
- Check firewall/network accessibility

### Issue: Can't connect to database from production
- Verify DATABASE_URL has correct credentials
- Check IP whitelist/security groups
- Ensure database is accessible from your host

## Testing Manually

### Using Clerk Dashboard

1. Go to Users section
2. Create a user manually
3. Check database (webhook won't trigger for manual creation)

### Using Clerk CLI

```bash
npm install -g @clerk/cli

# List users
clerk users list

# Delete user (triggers webhook)
clerk users delete user_123abc
```

### Using Clerk API + curl

```bash
# Create user
curl -X POST https://api.clerk.com/v1/users \
  -H "Authorization: Bearer YOUR_CLERK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email_addresses": ["test@example.com"],
    "password": "Test123!"
  }'

# Delete user
curl -X DELETE https://api.clerk.com/v1/users/user_123abc \
  -H "Authorization: Bearer YOUR_CLERK_API_KEY"
```

## Database Schema

The `User` table has:

| Column | Type | Notes |
|--------|------|-------|
| `id` | String (CUID) | Primary key, auto-generated |
| `clerkId` | String | Unique, Clerk user ID |
| `username` | String | Unique, derived from email |
| `displayName` | String | User's full name or first name |
| `bio` | String | Optional user bio |
| `avatarUrl` | String | Optional avatar image URL |
| `isPublic` | Boolean | Defaults to true |
| `currentStreak` | Int | Current activity streak (0 by default) |
| `longestStreak` | Int | Longest streak achieved (0 by default) |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last profile update timestamp |

## Using the Database in Your App

### Import the user utilities:

```typescript
import { getUserByClerkId, updateStreak, incrementStreak } from '@/lib/users';

// Get current user's database record
const user = await getUserByClerkId(clerkId);

// Update streak
await incrementStreak(clerkId);

// Update profile
await updateUserProfile(clerkId, {
  displayName: 'New Name',
  bio: 'My bio',
});
```

### In Server Components:

```typescript
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/users';

export default async function ProfilePage() {
  const { userId } = auth();
  
  if (!userId) return <div>Not authenticated</div>;
  
  const user = await getUserByClerkId(userId);
  
  return <div>{user?.displayName}</div>;
}
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Configure environment variables
4. ✅ Run migrations
5. ✅ Configure Clerk webhook
6. ✅ Test locally with ngrok
7. ✅ Deploy to production
8. ⬜ Create API routes for fetching user data
9. ⬜ Update dashboard to show database user info
10. ⬜ Add streak tracking logic

## References

- [Clerk Webhooks Docs](https://clerk.com/docs/webhooks/overview)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Svix Library Docs](https://www.svix.com/docs/)
- [ngrok Documentation](https://ngrok.com/docs)
