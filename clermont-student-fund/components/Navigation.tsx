'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/positions', label: 'Positions' },
  { href: '/mouvements', label: 'Mouvements' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CSF
            </div>
            <span className="font-semibold text-white hidden sm:block">
              Clermont Student Fund
            </span>
          </div>

          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-white hover:bg-surface-2'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
