# Clerk Authentication Setup - Complete Reference

## Summary of All Files Created/Modified

### 1. Configuration Files

#### `package.json`
- Defines project dependencies and scripts
- Key dependencies: `@clerk/nextjs`, `next`, `react`, `react-dom`
- Scripts for development, build, and production

#### `tsconfig.json`
- TypeScript configuration
- Enables strict mode
- Path aliases configured (`@/*`)

#### `next.config.js`
- Next.js configuration
- React strict mode enabled

#### `.env.example`
- Template for environment variables
- Copy to `.env.local` and fill in your Clerk credentials

#### `.gitignore`
- Excludes files from version control
- Ignores node_modules, .env files, .next build directory

#### `middleware.ts` ⭐
- **CRITICAL FILE** for protecting routes
- Uses `clerkMiddleware()` to protect `/dashboard/*` routes
- Automatic redirects for unauthenticated users

---

### 2. Core Application Files

#### `app/layout.tsx` ⭐
- **ROOT LAYOUT** - wraps entire application
- Provides `ClerkProvider` from `@clerk/nextjs`
- All Clerk features depend on this being present
- Sets up metadata and HTML structure

#### `app/globals.css`
- Global styling for the entire application
- Defines button, link, card, and container styles
- Basic responsive layout styles

#### `app/page.tsx`
- Home page (public route)
- Shows different content for signed-in vs signed-out users
- Links to sign-in, sign-up, and dashboard

---

### 3. Authentication Routes (`app/(auth)/`)

Group route using parentheses - doesn't affect URL structure

#### `app/(auth)/layout.tsx`
- Layout wrapper for all auth pages
- Centered auth container styling

#### `app/(auth)/sign-in/page.tsx`
- Sign-in page (public)
- Uses `<SignIn />` component from Clerk
- Automatically redirects to `/dashboard` on success

#### `app/(auth)/sign-up/page.tsx`
- Sign-up page (public)
- Uses `<SignUp />` component from Clerk
- Automatically redirects to `/dashboard` on success

---

### 4. Dashboard Routes (`app/(dashboard)/`)

Group route using parentheses - doesn't affect URL structure

#### `app/(dashboard)/layout.tsx` ⭐
- **PROTECTED LAYOUT** for all dashboard routes
- Shows user's role in header
- Provides `<UserButton />` with sign-out redirect to `/`
- Client component that checks user authentication

#### `app/(dashboard)/dashboard/page.tsx`
- Dashboard home/main page
- Shows user profile information
- Displays available sections
- Admin users see special admin access card

#### `app/(dashboard)/dashboard/gallery/page.tsx`
- Artist gallery page
- Example of protected artist route
- Shows message to upload first sketch

#### `app/(dashboard)/dashboard/upload/page.tsx`
- Upload form for sketches
- Example of protected artist route
- Form fields for title, description, and file

#### `app/(dashboard)/dashboard/admin/page.tsx` ⭐
- **ADMIN-ONLY PAGE**
- Includes role check - redirects non-admins to dashboard
- Shows admin functions and features
- Only accessible to users with `role: "admin"` in publicMetadata

---

### 5. Utility Files

#### `lib/roles.ts` ⭐
- **CORE ROLE MANAGEMENT** utility
- Exports `UserRole` type: `'artist' | 'admin'`
- Key functions:
  - `getUserRole(user)` - Gets user's role
  - `isAdmin(user)` - Checks if user is admin
  - `isArtist(user)` - Checks if user is artist
  - `hasRole(user, requiredRole)` - Flexible role checking

Usage in components:
```typescript
import { useUser } from "@clerk/nextjs";
import { isAdmin, getUserRole } from "@/lib/roles";

export function MyComponent() {
  const { user } = useUser();
  
  if (isAdmin(user)) {
    // Show admin content
  }
}
```

---

## Configuration Steps Required

### Step 1: Set Up Clerk Account
1. Create account at https://clerk.com
2. Create new application
3. Enable "Email + Password" auth
4. Enable "Google" OAuth

### Step 2: Configure Environment Variables
Create `.env.local` in project root:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
```

Get these from Clerk Dashboard > API Keys section

### Step 3: Configure Google OAuth (Optional)
1. In Clerk dashboard: Go to Integrations > Google
2. In Google Cloud Console:
   - Create OAuth 2.0 credentials
   - Add redirect URIs from Clerk
3. Copy Client ID and Secret to Clerk

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Set User Roles
Via Clerk Dashboard:
1. Go to Users section
2. Click user
3. Scroll to "User Metadata"
4. Set `publicMetadata`:
   ```json
   {
     "role": "admin"
   }
   ```

---

## Route Protection Strategy

### Protected Routes
All routes under `/dashboard` are protected by `middleware.ts`:

```
/dashboard                    ✅ Protected
/dashboard/gallery           ✅ Protected
/dashboard/upload            ✅ Protected
/dashboard/admin             ✅ Protected (+ admin-only check)
```

### Public Routes
```
/                             🔓 Public
/sign-in                      🔓 Public
/sign-up                      🔓 Public
```

### Redirection Flow
- **After Sign Up:** `/sign-up` → `/dashboard`
- **After Sign In:** `/sign-in` → `/dashboard`
- **After Sign Out:** anywhere → `/`
- **Unauthenticated /dashboard access:** → `/sign-in`

---

## Authentication Flow

### Sign Up Flow
1. User visits `/sign-up`
2. Fills form (email, password, optional Google OAuth)
3. Clerk creates user account
4. User redirected to `/dashboard`
5. User role defaults to "artist" (set in `lib/roles.ts`)
6. Admin can change role via Clerk dashboard

### Sign In Flow
1. User visits `/sign-in`
2. Fills form (email/password or Google)
3. Clerk authenticates user
4. User redirected to `/dashboard`

### Sign Out Flow
1. User clicks UserButton
2. Clicks "Sign out"
3. Clerk clears session
4. User redirected to `/`

---

## Key Features Implementation

### ✅ Email + Password Auth
- Enabled by default in Clerk
- Sign-in and Sign-up components handle UI
- No additional code needed

### ✅ Google OAuth
- Enabled in Clerk dashboard
- Google button auto-appears in sign-in/sign-up forms
- No additional code needed

### ✅ Protected Routes
- `middleware.ts` protects `/dashboard/*`
- `app/(dashboard)/layout.tsx` verifies authentication
- Automatic redirects for unauthorized access

### ✅ Role-Based Access
- Roles stored in `publicMetadata.role`
- `lib/roles.ts` provides utility functions
- `/dashboard/admin` has additional role check

### ✅ Post Sign-Up Redirect
- Configured in Clerk Dashboard > User & Authentication
- Set: After sign-up URL → `/dashboard`
- Or use `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` env var

### ✅ Post Sign-Out Redirect
- Set in `<UserButton afterSignOutUrl="/" />`
- User redirected to `/` after clicking sign out

---

## Development Tips

### Testing Different Roles
1. Create multiple test users
2. Set different roles for each via Clerk dashboard
3. Sign in as each user to test role-based features

### Adding New Protected Routes
1. Create route under `/app/(dashboard)/`
2. Add role check if needed:
   ```typescript
   if (!isAdmin(user)) {
     redirect("/dashboard");
   }
   ```
3. Middleware automatically protects it

### Adding New OAuth Providers
1. Go to Clerk Dashboard > Integrations
2. Click provider (GitHub, Microsoft, Apple, etc.)
3. Add credentials
4. Provider automatically appears in sign-in/sign-up forms

### Custom Styling
- Edit `app/globals.css` for global styles
- Use `appearance` prop on Clerk components:
  ```typescript
  <SignIn appearance={{ elements: { card: "my-card" } }} />
  ```

---

## Troubleshooting

### Issue: "Clerk is not loaded"
- Check `ClerkProvider` is in `app/layout.tsx`
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Restart dev server

### Issue: "Cannot access /dashboard"
- Check middleware.ts is present
- Check user is signed in
- Check Clerk keys are correct

### Issue: "Admin page shows non-admin users"
- Check role check in `app/(dashboard)/dashboard/admin/page.tsx`
- Verify user has `role: "admin"` in Clerk publicMetadata
- Clear browser cache/cookies

---

## File Checklist

Use this to verify all files are created:

- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `next.config.js`
- [ ] `middleware.ts`
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `app/layout.tsx`
- [ ] `app/globals.css`
- [ ] `app/page.tsx`
- [ ] `app/(auth)/layout.tsx`
- [ ] `app/(auth)/sign-in/page.tsx`
- [ ] `app/(auth)/sign-up/page.tsx`
- [ ] `app/(dashboard)/layout.tsx`
- [ ] `app/(dashboard)/dashboard/page.tsx`
- [ ] `app/(dashboard)/dashboard/gallery/page.tsx`
- [ ] `app/(dashboard)/dashboard/upload/page.tsx`
- [ ] `app/(dashboard)/dashboard/admin/page.tsx`
- [ ] `lib/roles.ts`

---

## What's Next?

1. ✅ **All files created** - Project structure ready
2. ⬜ Create `.env.local` with Clerk keys
3. ⬜ Run `npm install`
4. ⬜ Run `npm run dev`
5. ⬜ Set user roles in Clerk dashboard
6. ⬜ Customize components and styles as needed
7. ⬜ Add additional features (database, file upload, etc.)

