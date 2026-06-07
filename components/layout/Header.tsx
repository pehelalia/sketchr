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
