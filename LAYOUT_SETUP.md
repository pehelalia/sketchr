# Sketchlog Layout System - Complete Setup

This document shows every file created and modified for the Sketchlog layout system with Tailwind CSS, responsive sidebar/header, and mobile navigation drawer.

## 📁 Complete File Structure

```
sketchr/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx                 ✅ Dashboard layout with Sidebar/Header/MobileNav
│   │   ├── dashboard/
│   │   │   └── page.tsx               ✅ Dashboard home page
│   │   ├── gallery/
│   │   │   └── page.tsx               ✅ Gallery page
│   │   ├── entries/
│   │   │   └── new/
│   │   │       └── page.tsx           ✅ New entry form page
│   │   ├── recaps/
│   │   │   └── page.tsx               ✅ Progress recap page
│   │   ├── discover/
│   │   │   └── page.tsx               ✅ Discover artists page
│   │   └── settings/
│   │       └── page.tsx               ✅ User settings page
│   ├── (marketing)/
│   │   └── page.tsx                   ✅ Landing page
│   ├── layout.tsx                     ✅ UPDATED - Added Inter font
│   └── globals.css                    ✅ UPDATED - Tailwind directives
├── components/
│   └── layout/
│       ├── Sidebar.tsx                ✅ Fixed sidebar navigation
│       ├── Header.tsx                 ✅ Sticky header with page title
│       └── MobileNav.tsx              ✅ Mobile drawer navigation
├── tailwind.config.ts                 ✅ Tailwind CSS configuration
├── postcss.config.js                  ✅ PostCSS configuration
├── package.json                       ✅ UPDATED - Added dependencies
└── tsconfig.json                      (existing)
```

---

## 📦 Dependencies Added

**package.json** includes:
- `lucide-react: ^0.294.0` - Icon library for nav icons
- `tailwindcss: ^3.3.0` - Tailwind CSS framework
- `postcss: ^8.4.31` - CSS processor
- `autoprefixer: ^10.4.16` - Autoprefixer for CSS

## 🎯 Complete File Contents

### 1. Root Configuration Files

#### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}
export default config
```

**Purpose:** Configures Tailwind CSS with:
- Content scanning for app and components
- Inter font as default sans font
- Extends default theme

#### `postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Purpose:** Enables Tailwind CSS and autoprefixer during CSS build

#### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-stone-50 text-stone-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 border border-stone-200 text-stone-900 rounded-md font-medium hover:bg-stone-50 transition-colors;
  }

  .nav-link {
    @apply px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors;
  }

  .nav-link-active {
    @apply px-4 py-2 bg-stone-900 text-white rounded-md font-medium;
  }
}
```

**Purpose:**
- Injects Tailwind directives (base, components, utilities)
- Sets global body styles (stone-50 background, stone-900 text)
- Defines reusable component classes (.btn-primary, .nav-link-active, etc.)

#### `app/layout.tsx` (UPDATED)
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sketchlog - Artist Progress Journal",
  description: "Track your artistic growth and document your creative journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

**Changes:**
- Imported Inter font from next/font/google
- Added font variable: `--font-inter`
- Applied font to body via `className={inter.variable}`
- Updated metadata to "Sketchlog - Artist Progress Journal"

---

### 2. Layout Components

#### `components/layout/Sidebar.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image,
  Plus,
  BarChart3,
  Compass,
  Settings,
  LogOut,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gallery', label: 'Gallery', icon: Image },
  { href: '/entries/new', label: 'New Entry', icon: Plus },
  { href: '/recaps', label: 'Recaps', icon: BarChart3 },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 bg-white border-r border-stone-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-stone-200 px-4">
        <Link href="/dashboard" className="font-bold text-xl text-stone-900">
          Sketchlog
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                active
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="border-t border-stone-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 truncate">
              Artist
            </p>
            <p className="text-xs text-stone-500 truncate">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

**Features:**
- ✅ Fixed position on desktop, hidden on mobile (md: breakpoint)
- ✅ 256px (w-64) wide
- ✅ Navigation items with lucide-react icons
- ✅ Active route detection using usePathname()
- ✅ Active links highlighted with stone-900 background
- ✅ User card at bottom with Clerk UserButton
- ✅ Scrollable nav area (overflow-y-auto)

#### `components/layout/Header.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

const pathTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/gallery': 'Gallery',
  '/entries/new': 'New Entry',
  '/recaps': 'Recaps',
  '/discover': 'Discover',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  return pathTitles[pathname] || 'Dashboard';
}

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getPageTitle(pathname));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-stone-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Page Title */}
        <div className="flex-1 md:flex-none">
          <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/entries/new"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Entry</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

**Features:**
- ✅ Sticky to top (sticky, top-0, z-40)
- ✅ 64px height (h-16)
- ✅ Hamburger button shown only on mobile (md:hidden)
- ✅ Dynamic page title based on current route
- ✅ "+ New Entry" button that links to /entries/new
- ✅ Button text hidden on small screens (hidden sm:inline)
- ✅ Proper z-index layering

#### `components/layout/MobileNav.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import {
  LayoutDashboard,
  Image,
  Plus,
  BarChart3,
  Compass,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gallery', label: 'Gallery', icon: Image },
  { href: '/entries/new', label: 'New Entry', icon: Plus },
  { href: '/recaps', label: 'Recaps', icon: BarChart3 },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-stone-200 md:hidden z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between h-16 border-b border-stone-200 px-4">
          <h2 className="font-bold text-xl text-stone-900">Sketchlog</h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
```

**Features:**
- ✅ Hidden on desktop (md:hidden on both backdrop and drawer)
- ✅ Dark backdrop overlay that closes drawer when clicked
- ✅ Slide-in animation from left (-translate-x-full to translate-x-0)
- ✅ 300ms smooth transition (transition-transform duration-300)
- ✅ Close button (X icon) in header
- ✅ Links auto-close drawer (onClick={onClose})
- ✅ Same nav items as sidebar with active state detection

---

### 3. Dashboard Layout

#### `app/(dashboard)/layout.tsx` (UPDATED)
```typescript
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col">
        {/* Header */}
        <Header onMobileMenuOpen={() => setMobileNavOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Structure:**
- Manages mobile nav open/close state
- Renders Sidebar (hidden on mobile)
- Renders MobileNav (hidden on desktop)
- Main content area with md:ml-64 (sidebar offset on desktop)
- Header controls mobile nav toggle
- Responsive padding: p-4 mobile, md:p-6, lg:p-8

---

### 4. Dashboard Pages

#### `app/(dashboard)/dashboard/page.tsx`
Dashboard home with stats cards showing:
- Total Entries: 0
- Current Streak: 0
- This Month: 0

#### `app/(dashboard)/gallery/page.tsx`
Gallery page with:
- Heading and description
- Empty state with "Create Entry" button
- Grid-based layout ready for future sketches

#### `app/(dashboard)/entries/new/page.tsx`
New entry form with:
- Title input
- Description textarea (8 rows)
- File upload for artwork
- Save and Cancel buttons

#### `app/(dashboard)/recaps/page.tsx`
Progress recap page with:
- This Month stats (Entries Created, Days Active, Streak Days)
- All Time stats (Total Entries, Longest Streak, Member Since)
- Activity Chart placeholder

#### `app/(dashboard)/discover/page.tsx`
Discover page with:
- Description and empty state message
- Grid of 6 artist cards (placeholder)
- Profile info and latest entry date per card

#### `app/(dashboard)/settings/page.tsx`
Settings page with:
- Profile Settings (Display Name, Bio)
- Privacy (Make Profile Public toggle)
- Notifications (Email digest, Streak reminders)
- Save/Cancel buttons
- Danger Zone (Delete Account)

#### `app/(marketing)/page.tsx`
Landing page with:
- Header with Sketchlog logo and auth links
- Hero section with CTA buttons
- Features section (Create Entries, Track Progress, Discover Others)
- Final CTA section
- Footer
- Conditional rendering for SignedIn/SignedOut users

---

## 🎨 Color Palette & Design System

### Stone Color Palette
- **Background**: `stone-50` (very light stone)
- **Borders**: `stone-200` (light border)
- **Text (Secondary)**: `stone-600` (medium gray)
- **Text (Primary)**: `stone-900` (dark stone)
- **Hover States**: `stone-100` (light hover)
- **Active/Buttons**: `stone-900` (dark stone)
- **Hover Buttons**: `stone-800` (darker stone)

### Responsive Breakpoints
- **Mobile First**: All styles are mobile by default
- **Tablet (md)**: `md:` prefix for 768px+ 
  - Sidebar visible
  - Full navigation menu
  - Wider padding
- **Desktop (lg)**: `lg:` prefix for 1024px+
  - Extra padding
  - Larger spacing

### Typography
- **Font**: Inter (from next/font/google)
- **Font Variable**: `--font-inter`
- **Heading**: `font-bold` or `font-semibold`
- **Body**: Regular weight

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

This installs:
- lucide-react (icons)
- tailwindcss (CSS framework)
- postcss (CSS processor)
- autoprefixer (vendor prefixes)

### 2. Run Development Server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 3. Test Routes
- **Landing**: http://localhost:3000/ (public, no auth needed)
- **Dashboard**: http://localhost:3000/dashboard (protected by Clerk)
- **Gallery**: http://localhost:3000/gallery
- **New Entry**: http://localhost:3000/entries/new
- **Recaps**: http://localhost:3000/recaps
- **Discover**: http://localhost:3000/discover
- **Settings**: http://localhost:3000/settings

### 4. Test Responsive Design
- Desktop: Sidebar visible, hamburger hidden
- Tablet (769px+): Sidebar visible, hamburger hidden
- Mobile: Sidebar hidden, hamburger menu visible

---

## 📱 Responsive Behavior

### Desktop (md+)
```
┌─────────────────────────────────────┐
│ Sidebar (w-64)  │    Header (h-16)  │
│                 ├───────────────────┤
│                 │                   │
│                 │   Main Content    │
│                 │                   │
└─────────────────────────────────────┘
```

### Mobile
```
┌─────────────────────────┐
│ [≡]      Header (h-16)  │
├─────────────────────────┤
│                         │
│   Main Content          │
│                         │
└─────────────────────────┘

[≡] = Hamburger, opens drawer
```

---

## 🔧 Customization

### Change Colors
Edit `tailwind.config.ts` theme.extend:
```typescript
theme: {
  extend: {
    colors: {
      'brand': '#your-color',
    },
  },
},
```

### Add Navigation Items
Edit `navItems` array in both Sidebar and MobileNav:
```typescript
const navItems = [
  { href: '/new-route', label: 'New Item', icon: IconName },
  // ...
];
```

### Update Page Titles
Edit `pathTitles` in Header.tsx:
```typescript
const pathTitles: Record<string, string> = {
  '/your-route': 'Your Title',
  // ...
};
```

---

## ✅ Checklist

Verify all files are in place:

- [x] `tailwind.config.ts` - Tailwind configuration
- [x] `postcss.config.js` - PostCSS configuration
- [x] `app/globals.css` - Updated with Tailwind directives
- [x] `app/layout.tsx` - Updated with Inter font
- [x] `components/layout/Sidebar.tsx` - Fixed sidebar
- [x] `components/layout/Header.tsx` - Sticky header
- [x] `components/layout/MobileNav.tsx` - Mobile drawer
- [x] `app/(dashboard)/layout.tsx` - Dashboard layout
- [x] `app/(dashboard)/dashboard/page.tsx` - Dashboard page
- [x] `app/(dashboard)/gallery/page.tsx` - Gallery page
- [x] `app/(dashboard)/entries/new/page.tsx` - New entry form
- [x] `app/(dashboard)/recaps/page.tsx` - Recaps page
- [x] `app/(dashboard)/discover/page.tsx` - Discover page
- [x] `app/(dashboard)/settings/page.tsx` - Settings page
- [x] `app/(marketing)/page.tsx` - Landing page
- [x] `package.json` - Dependencies added

---

## 🎯 Key Features Summary

✅ **Responsive Layout**
- Sidebar hidden on mobile, visible on desktop
- Header hamburger button on mobile, hidden on desktop
- Mobile drawer slides in from left with backdrop

✅ **Navigation**
- Active route detection with usePathname()
- Active links highlighted with stone-900 background
- Same navigation in sidebar and mobile drawer

✅ **Design**
- Stone color palette (editorial, minimal)
- Inter font for clean typography
- Consistent spacing and sizing
- Smooth transitions and hover states

✅ **User Experience**
- Dynamic page titles in header
- Mobile drawer auto-closes on link click
- Sticky header for quick access to "+ New Entry"
- User card with profile info in sidebar

---

## 📞 Support

For issues:
1. Check that all files are created in correct locations
2. Verify `npm install` completed successfully
3. Restart dev server: `npm run dev`
4. Check console for TypeScript errors
5. Verify Tailwind CSS is loaded (inspect elements, look for Tailwind classes)

---

**Last Updated:** 2026-06-08  
**Status:** Complete - Ready to use
