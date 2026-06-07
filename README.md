# Sketchr - Next.js 14 with Clerk Authentication

A modern creative platform built with Next.js 14 and Clerk authentication, featuring email/password sign-up, Google OAuth, role-based access control, and protected dashboard routes.

## Features

✅ **Authentication**
- Email + password sign up/sign in
- Google OAuth integration
- Persistent session management
- Sign out with redirect to home

✅ **Protected Routes**
- Dashboard routes protected by Clerk middleware
- Admin-only pages with role verification
- Automatic redirects for unauthorized access

✅ **Role-Based Access Control (RBAC)**
- Artist role (default)
- Admin role
- Roles stored in Clerk `publicMetadata`
- Role utilities for easy permission checking

✅ **User Experience**
- Automatic redirect to `/dashboard` after sign up
- Automatic redirect to `/` after sign out
- User profile information display
- Clean, responsive UI

## Project Structure

```
sketchr/
├── app/
│   ├── (auth)/                    # Authentication routes (group)
│   │   ├── layout.tsx             # Auth layout wrapper
│   │   ├── sign-in/
│   │   │   └── page.tsx           # Sign-in page
│   │   └── sign-up/
│   │       └── page.tsx           # Sign-up page
│   ├── (dashboard)/               # Protected dashboard routes (group)
│   │   ├── layout.tsx             # Dashboard layout with role display
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx       # Artist gallery
│   │   │   ├── upload/
│   │   │   │   └── page.tsx       # Upload sketch page
│   │   │   └── admin/
│   │   │       └── page.tsx       # Admin-only panel
│   ├── layout.tsx                 # Root layout with ClerkProvider
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── lib/
│   └── roles.ts                   # Role checking utilities
├── middleware.ts                  # Clerk middleware for route protection
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── next.config.js                 # Next.js configuration
└── README.md                      # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm/yarn/pnpm installed
- A Clerk account (free at https://clerk.com)

### 2. Create Clerk Application

1. Go to https://dashboard.clerk.com
2. Create a new application
3. Choose "Email + Password" and "Google" as authentication methods
4. Copy your `Publishable Key` and `Secret Key`

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Clerk keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

3. (Optional) Configure redirect URLs in `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

### 4. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit http://localhost:3000 to see your application.

## Google OAuth Setup

1. In your Clerk dashboard, go to **Integrations**
2. Click on **Google**
3. Add your OAuth credentials:
   - Go to Google Cloud Console (https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk dashboard
4. Copy the Client ID and Client Secret to Clerk

## Role Management

### Setting User Roles

To assign roles to users, use the Clerk Dashboard or API:

**Via Clerk Dashboard:**
1. Go to Users
2. Select a user
3. In the "User Metadata" section, set `publicMetadata`:
   ```json
   {
     "role": "admin"
   }
   ```

**Via API (Node.js):**
```javascript
const { clerkClient } = require("@clerk/clerk-sdk-node");

await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: "admin" // or "artist"
  }
});
```

### Role Utilities

Use the role utilities in `lib/roles.ts`:

```typescript
import { getUserRole, isAdmin, isArtist, hasRole } from "@/lib/roles";
import { useUser } from "@clerk/nextjs";

export function MyComponent() {
  const { user } = useUser();
  
  const role = getUserRole(user);           // "artist" or "admin"
  const isUserAdmin = isAdmin(user);        // boolean
  const isUserArtist = isArtist(user);      // boolean
  const hasAdminRole = hasRole(user, "admin"); // boolean
}
```

## Routes Overview

### Public Routes
- `/` - Home page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes (Require Authentication)
- `/dashboard` - Dashboard home
- `/dashboard/gallery` - Artist gallery
- `/dashboard/upload` - Upload sketch
- `/dashboard/admin` - Admin panel (admin only)

## Middleware Configuration

The `middleware.ts` file protects `/dashboard` routes:

```typescript
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);
```

Add more routes to the `createRouteMatcher` array to protect additional paths.

## Building for Production

```bash
npm run build
npm start
```

## Customization

### Add More OAuth Providers

In Clerk dashboard, enable additional OAuth providers (GitHub, Microsoft, Apple, etc.) and they will automatically appear in the sign-in/sign-up forms.

### Add More Roles

Update `UserRole` type in `lib/roles.ts`:

```typescript
export type UserRole = 'artist' | 'admin' | 'moderator';
```

### Customize UI

- Edit styles in `app/globals.css`
- Customize Clerk components in sign-in/sign-up pages using the `appearance` prop
- Update user profile display in `app/(dashboard)/layout.tsx`

## Troubleshooting

### "Failed to load Clerk"
- Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Ensure `.env.local` file exists in project root
- Restart development server

### "Not authenticated" redirect loop
- Verify Clerk middleware is configured correctly in `middleware.ts`
- Check protected routes configuration
- Ensure cookies are enabled in your browser

### Google OAuth not working
- Verify OAuth credentials in Clerk dashboard
- Check redirect URIs match your development/production URLs
- Ensure Google+ API is enabled in Google Cloud Console

## Useful Links

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Role-based Access Control](https://clerk.com/docs/organizations/roles)

## License

MIT
