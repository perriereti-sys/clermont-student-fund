'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// CSF Bull SVG — gold charging bull matching the association logo
function BullLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horns */}
      <path d="M18 14 Q10 6 14 16 Q16 20 20 22" strokeLinecap="round" />
      <path d="M34 12 Q44 4 40 16 Q38 20 34 22" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="27" cy="26" rx="11" ry="10" />
      {/* Snout */}
      <ellipse cx="22" cy="30" rx="6" ry="5" />
      {/* Nostril */}
      <circle cx="20" cy="31" r="1.2" fill="#0d1425" />
      <circle cx="24" cy="31" r="1.2" fill="#0d1425" />
      {/* Body */}
      <ellipse cx="40" cy="38" rx="16" ry="12" />
      {/* Neck connector */}
      <path d="M28 28 Q32 30 34 34 Q36 38 32 40 Q28 42 24 36 Q20 30 28 28Z" />
      {/* Front legs */}
      <rect x="28" y="48" width="6" height="14" rx="3" />
      <rect x="38" y="50" width="6" height="12" rx="3" />
      {/* Back legs */}
      <rect x="48" y="47" width="6" height="15" rx="3" />
      <rect x="55" y="46" width="5" height="16" rx="2.5" />
      {/* Tail */}
      <path d="M56 32 Q64 26 62 20 Q60 16 58 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="22" cy="23" r="1.8" fill="#0d1425" />
      <circle cx="22.6" cy="22.4" r="0.6" fill="currentColor" />
    </svg>
  );
}

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/positions', label: 'Positions' },
  { href: '/mouvements', label: 'Mouvements' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="relative bg-surface border-b border-border">
      {/* Subtle gold line at very top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gold-muted border border-gold/20 group-hover:border-gold/40 transition-all duration-200">
              <BullLogo className="w-6 h-6 text-gold" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                CSF
              </span>
              <span className="text-[11px] text-gray-500 tracking-wide">
                Clermont Student Fund
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md mx-0.5 ${
                    isActive
                      ? 'text-gold'
                      : 'text-gray-400 hover:text-white hover:bg-surface-2'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
    </nav>
  );
}
