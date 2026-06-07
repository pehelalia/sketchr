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
