'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 4 3 5-6" />
      </svg>
    ),
  },
  {
    href: '/mouvements',
    label: 'Mouvements',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    href: '/rapports',
    label: 'Rapports',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Top header ───────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(26,37,64,0.13)',
          boxShadow: '0 1px 0 0 rgba(26,37,64,0.06), 0 2px 10px rgba(26,37,64,0.05)',
        }}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Brand */}
            <Link href="/" className="flex items-baseline gap-2.5 select-none">
              <span
                className="font-display font-bold text-base tracking-[0.12em]"
                style={{ color: '#B8963A' }}
              >
                CSF
              </span>
              <span
                className="hidden sm:block text-xs font-medium tracking-wide"
                style={{ color: '#8496B2' }}
              >
                Clermont Student Fund
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(26,37,64,0.08)',
        }}
      >
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[58px] transition-colors duration-150 relative"
                style={{ color: isActive ? '#B8963A' : '#8496B2' }}
              >
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                    style={{ width: 28, height: 3, background: '#1A2540', opacity: 0.25 }}
                  />
                )}
                {item.icon}
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)', background: 'rgba(255,255,255,0.98)' }} />
      </nav>
    </>
  );
}
