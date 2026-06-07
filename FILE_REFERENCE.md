# Clerk Webhook + Prisma Integration - Complete File Reference

## 📋 Complete File List

All files created or modified for Clerk webhook integration with Prisma PostgreSQL database.

---

## 📝 Configuration Files (Modified)

### [package.json](package.json)
**Status:** MODIFIED  
**Changes:**
- Added `@prisma/client: ^5.7.0` - Prisma ORM runtime
- Added `svix: ^1.15.0` - Webhook signature verification
- Added `prisma: ^5.7.0` (devDependency) - Prisma CLI

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

### [.env.example](.env.example)
**Status:** MODIFIED  
**Changes:**
- Added `CLERK_WEBHOOK_SECRET` - Webhook signing secret
- Added `DATABASE_URL` - PostgreSQL connection string
- Added explanatory comments

**New Variables:**
```
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
DATABASE_URL=postgresql://user:password@localhost:5432/sketchr
```

---

## 🆕 New Configuration Files

### [.env.local.example](.env.local.example)
**Status:** NEW  
**Purpose:** Template showing how `.env.local` should look after setup

**Content:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
CLERK_WEBHOOK_SECRET=whsec_xxxxx
DATABASE_URL=postgresql://postgres:password@localhost:5432/sketchr
```

---

## 🗄️ Database Files (New)

### [prisma/schema.prisma](prisma/schema.prisma)
**Status:** NEW  
**Purpose:** Prisma schema defining database structure

**Features:**
- PostgreSQL datasource configuration
- User model with all required fields
- Timestamps (createdAt, updatedAt)
- Indexes on unique fields (clerkId, username)

**User Model Fields:**
```prisma
model User {
  id            String   @id @default(cuid())    // Primary key
  clerkId       String   @unique                  // Clerk ID (unique)
  username      String   @unique                  // Username (unique)
  displayName   String?                           // Full name/display name
  bio           String?                           // User bio
  avatarUrl     String?                           // Avatar image URL
  isPublic      Boolean  @default(true)           // Public profile flag
  currentStreak Int      @default(0)              // Current streak
  longestStreak Int      @default(0)              // Longest streak
  createdAt     DateTime @default(now())          // Created at
  updatedAt     DateTime @updatedAt               // Updated at
}
```

---

## 🛠️ Utility & Library Files (New)

### [lib/prisma.ts](lib/prisma.ts)
**Status:** NEW  
**Purpose:** Prisma client singleton for safe usage in development

**Key Features:**
- Reuses single client instance in dev mode
- Prevents connection pool exhaustion
- Exports ready-to-use `prisma` instance

**Usage:**
```typescript
import { prisma } from '@/lib/prisma';
```

---

### [lib/users.ts](lib/users.ts)
**Status:** NEW  
**Purpose:** Helper functions for user database operations

**Available Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `getUserByClerkId(clerkId)` | Get user by Clerk ID | User \| null |
| `getUserByUsername(username)` | Get user by username | User \| null |
| `getUserById(id)` | Get user by database ID | User \| null |
| `updateUserProfile(clerkId, data)` | Update profile info | User |
| `updateStreak(clerkId, data)` | Update streak values | User |
| `resetCurrentStreak(clerkId)` | Reset streak to 0 | User |
| `incrementStreak(clerkId)` | Increment streak | User |
| `getPublicUsers(limit, offset)` | Get public users | User[] |
| `searchUsers(query, limit)` | Search users | User[] |

**Usage:**
```typescript
import { 
  getUserByClerkId, 
  incrementStreak, 
  updateUserProfile 
} from '@/lib/users';

const user = await getUserByClerkId('user_123');
await incrementStreak('user_123');
```

---

### [lib/user-actions.ts](lib/user-actions.ts)
**Status:** NEW  
**Purpose:** Server actions for user operations

**Available Server Actions:**

| Function | Purpose | Auth Required |
|----------|---------|---|
| `getCurrentUserProfile()` | Get current user's DB profile | ✅ Yes |
| `updateCurrentUserProfile(data)` | Update current user profile | ✅ Yes |
| `getPublicUserProfile(username)` | Get public user by username | ❌ No |
| `incrementCurrentUserStreak()` | Increment current user's streak | ✅ Yes |
| `getDiscoveryFeed(limit, offset)` | Get public users feed | ❌ No |
| `searchForUsers(query, limit)` | Search public users | ❌ No |
| `getUserPublicProfile(userId)` | Get user's public profile | ❌ No |

**Usage in Client Components:**
```typescript
'use client';

import { getCurrentUserProfile } from '@/lib/user-actions';

export function MyComponent() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getCurrentUserProfile().then(setUser);
  }, []);
  
  return <div>{user?.displayName}</div>;
}
```

---

## 📡 API Endpoints (New)

### [app/api/webhooks/clerk/route.ts](app/api/webhooks/clerk/route.ts)
**Status:** NEW  
**Purpose:** Handle Clerk webhook events

**Endpoint:** `POST /api/webhooks/clerk`

**Features:**
- ✅ Signature verification using svix
- ✅ Handles user.created events
- ✅ Handles user.updated events
- ✅ Handles user.deleted events
- ✅ Error handling with proper HTTP codes
- ✅ Logging for debugging

**Response Codes:**
| Status | Meaning |
|--------|---------|
| 201 | User created successfully |
| 200 | Event processed successfully |
| 400 | Bad request / invalid signature |
| 404 | User not found |
| 409 | Conflict (duplicate user) |
| 500 | Server error |

**Event Handling:**

**1. user.created → 201 Created**
```typescript
// When webhook is triggered:
// 1. Verify signature
// 2. Extract user data
// 3. Create username from email
// 4. Create User record in database
// 5. Return 201

// Example webhook payload:
{
  "type": "user.created",
  "data": {
    "id": "user_2abc123",
    "email_addresses": [
      { "email_address": "artist@example.com" }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://..."
  }
}

// Result in database:
{
  clerkId: "user_2abc123",
  username: "artist",
  displayName: "John Doe",
  avatarUrl: "https://...",
  isPublic: true,
  currentStreak: 0,
  longestStreak: 0
}
```

**2. user.updated → 200 OK**
```typescript
// When profile updated:
// 1. Find user by clerkId
// 2. Update displayName if changed
// 3. Update avatarUrl if changed
// 4. Return 200
```

**3. user.deleted → 200 OK**
```typescript
// When user deleted:
// 1. Find user by clerkId
// 2. Delete from database
// 3. Return 200
```

---

## 📚 Documentation Files (New)

### [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md)
**Status:** NEW  
**Length:** ~800 lines  
**Purpose:** Complete setup guide for webhooks

**Sections:**
1. Architecture overview
2. PostgreSQL setup (Local, Docker, Cloud)
3. Environment configuration
4. Dependency installation
5. Database migration
6. Clerk webhook configuration
7. Local testing with ngrok
8. Production deployment
9. Event explanations
10. Security considerations
11. Troubleshooting guide
12. Manual testing methods
13. Database schema reference
14. Usage examples in app
15. Next steps

**Key Topics Covered:**
- PostgreSQL installation and setup
- Creating Clerk webhooks
- Getting webhook signing secret
- Running Prisma migrations
- Testing webhooks locally with ngrok
- Deploying to production
- Handling webhook events
- Error troubleshooting

---

### [WEBHOOK_IMPLEMENTATION.md](WEBHOOK_IMPLEMENTATION.md)
**Status:** NEW  
**Length:** ~600 lines  
**Purpose:** File-by-file implementation reference

**Sections:**
1. Files summary with descriptions
2. Quick start guide
3. Architecture overview with diagram
4. Event flow examples
5. Security features explanation
6. Database migration commands
7. Using database functions
8. Deployment checklist
9. Files checklist
10. Next steps
11. Support & references

**Includes:**
- File-by-file breakdown
- Event flow diagrams
- Code examples
- Security details
- Deployment steps

---

## 🔄 Updated Files

### [SETUP_GUIDE.md](SETUP_GUIDE.md)
**Status:** Pre-existing  
**Note:** Original Clerk auth setup guide - still valid, webhook setup supplements this

---

## 📦 Project Structure After Setup

```
sketchr/
├── prisma/
│   └── schema.prisma                    ✅ NEW
├── lib/
│   ├── prisma.ts                        ✅ NEW
│   ├── users.ts                         ✅ NEW
│   ├── user-actions.ts                  ✅ NEW
│   └── roles.ts                         (existing)
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts             ✅ NEW
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── .env.example                         ✅ MODIFIED
├── .env.local.example                   ✅ NEW
├── package.json                         ✅ MODIFIED
├── tsconfig.json
├── next.config.js
├── middleware.ts
├── SETUP_GUIDE.md                       (existing)
├── WEBHOOK_SETUP.md                     ✅ NEW
├── WEBHOOK_IMPLEMENTATION.md            ✅ NEW
├── README.md                            (existing)
├── .gitignore                           (existing)
└── .git/
```

---

## 🚀 Quick Start Steps

### 1. Install Dependencies
```bash
npm install
```
Installs:
- `@prisma/client`
- `@prisma/studio` (included)
- `prisma`
- `svix`

### 2. Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit with your values:
# - Database URL
# - Clerk webhook secret
```

### 3. Initialize Database
```bash
# Create/update database schema
npx prisma migrate dev --name init

# This will:
# 1. Create User table
# 2. Generate Prisma client
# 3. Ask if you want to generate example data (select 'y')
```

### 4. Configure Clerk Webhooks
1. Go to https://dashboard.clerk.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events:
   - ✅ `user.created`
   - ✅ `user.updated` (optional)
   - ✅ `user.deleted`
4. Copy signing secret to `CLERK_WEBHOOK_SECRET`

### 5. Test Locally
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok tunnel
ngrok http 3000

# Terminal 3: Update webhook in Clerk dashboard with ngrok URL
# Create test user to verify
```

---

## 📊 Database Operations

### View Database UI
```bash
npx prisma studio
```
Opens http://localhost:5555 - visual database management

### Create Migration
```bash
npx prisma migrate dev --name add_feature
```

### Reset Database (Dev Only)
```bash
npx prisma migrate reset
```

---

## 🔐 Security Checklist

- [x] Webhook signature verification (svix)
- [x] Secret management (.env.local)
- [x] Error handling for edge cases
- [x] Unique constraints on clerkId and username
- [x] Permission checks in server actions
- [x] Proper HTTP status codes
- [x] Logging for debugging

---

## 🧪 Testing Webhook Locally

### Using Clerk Dashboard
1. Create user at http://localhost:3000/sign-up
2. Check database: `SELECT * FROM "User";`
3. Delete user in Clerk dashboard
4. Verify deletion in database

### Using ngrok
1. Run: `ngrok http 3000`
2. Get URL: `https://abc123.ngrok.io`
3. Update webhook in Clerk: `https://abc123.ngrok.io/api/webhooks/clerk`
4. Create/update/delete user to trigger webhook
5. Watch terminal for logs

### Using Clerk API
```bash
# Get API key from Clerk dashboard

# Create user
curl -X POST https://api.clerk.com/v1/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_addresses": ["test@example.com"], "password": "Test123!"}'

# List users
curl -X GET https://api.clerk.com/v1/users \
  -H "Authorization: Bearer YOUR_API_KEY"

# Delete user
curl -X DELETE https://api.clerk.com/v1/users/user_123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 📋 Setup Verification Checklist

After completing all steps, verify:

- [ ] `npm install` completed without errors
- [ ] `.env.local` created with all variables
- [ ] `DATABASE_URL` points to valid PostgreSQL
- [ ] `npx prisma migrate dev --name init` successful
- [ ] User table created in database
- [ ] `CLERK_WEBHOOK_SECRET` obtained from Clerk
- [ ] Webhook endpoint added to Clerk dashboard
- [ ] Webhook events selected (user.created, user.deleted, etc.)
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads successfully
- [ ] Webhook tested with test user creation
- [ ] User appears in database after webhook fires
- [ ] `npx prisma studio` shows User record

---

## 🔗 Related Files

**Previous setup (still needed):**
- `SETUP_GUIDE.md` - Initial Clerk auth setup
- `middleware.ts` - Route protection
- `lib/roles.ts` - Role management

**New webhook integration:**
- `WEBHOOK_SETUP.md` - Detailed webhook guide
- `WEBHOOK_IMPLEMENTATION.md` - Implementation details
- `prisma/schema.prisma` - Database schema
- `app/api/webhooks/clerk/route.ts` - Webhook handler

---

## ❓ Common Questions

**Q: Do I need to manually create users in database?**  
A: No! Webhooks create them automatically when users sign up in Clerk.

**Q: What if a webhook event fails?**  
A: Check logs for error details. Webhooks can be retried in Clerk dashboard.

**Q: Can I test webhooks without ngrok?**  
A: For local testing, ngrok is recommended. Alternatively, use `prisma studio` to manually test database operations.

**Q: What fields are required in .env.local?**  
A: `DATABASE_URL` and `CLERK_WEBHOOK_SECRET` are required for webhooks to work.

**Q: How do I know a webhook was successful?**  
A: Check the terminal logs and verify user appears in `npx prisma studio`.

---

## 📞 Support

For issues:
1. Check `WEBHOOK_SETUP.md` troubleshooting section
2. Review webhook logs in Clerk dashboard
3. Check `npm run dev` terminal for errors
4. Verify `.env.local` has correct values
5. Ensure PostgreSQL is running
6. Check webhook signature matches (if using custom verification)

---

## ✅ Completion Status

**All files created/modified:**
- ✅ package.json - Dependencies added
- ✅ .env.example - Variables documented
- ✅ .env.local.example - Example filled values
- ✅ prisma/schema.prisma - Database schema
- ✅ lib/prisma.ts - Prisma client singleton
- ✅ lib/users.ts - Database helper functions
- ✅ lib/user-actions.ts - Server actions
- ✅ app/api/webhooks/clerk/route.ts - Webhook handler
- ✅ WEBHOOK_SETUP.md - Setup guide
- ✅ WEBHOOK_IMPLEMENTATION.md - Implementation guide

**Next steps:**
1. Run `npm install`
2. Set up `.env.local`
3. Run `npx prisma migrate dev --name init`
4. Configure Clerk webhooks
5. Test the integration

---

**Last Updated:** 2026-06-07  
**Status:** Ready for implementation
