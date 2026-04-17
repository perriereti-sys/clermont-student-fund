'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/positions',
    label: 'Positions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 4 3 5-6" />
      </svg>
    ),
  },
  {
    href: '/mouvements',
    label: 'Mouvements',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Top header (all screens) ───────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-navy-600"
        style={{ background: 'rgba(11,28,44,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="max-w-8xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Brand */}
            <Link href="/" className="flex flex-col leading-none select-none">
              <span className="font-display font-bold text-sm tracking-[0.15em] text-gold">CSF</span>
              <span className="text-[10px] tracking-wider font-medium mt-0.5 hidden sm:block" style={{ color: '#4A6080' }}>
                Clermont Student Fund
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ─────────────────────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-navy-600"
        style={{ background: 'rgba(11,28,44,0.97)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] transition-colors duration-150"
                style={{ color: isActive ? '#D4AF37' : '#4A6080' }}
              >
                {item.icon}
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Bottom safe area for iOS */}
        <div className="h-safe-bottom" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </nav>
    </>
  );
}
