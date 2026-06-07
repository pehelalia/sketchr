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
