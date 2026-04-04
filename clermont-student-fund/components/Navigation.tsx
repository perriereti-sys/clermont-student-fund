'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',           label: 'Dashboard'  },
  { href: '/positions',  label: 'Positions'  },
  { href: '/mouvements', label: 'Mouvements' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600"
      style={{ background: 'rgba(11,28,44,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>

      {/* Top gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="max-w-8xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[64px]">

          {/* ── Brand ── */}
          <Link href="/" className="flex flex-col leading-none select-none">
            <span className="font-display font-700 text-sm tracking-[0.15em] text-gold">
              CSF
            </span>
            <span className="text-[10px] tracking-wider font-medium mt-0.5 hidden sm:block"
              style={{ color: '#4A6080' }}>
              Clermont Student Fund
            </span>
          </Link>

          {/* ── Nav items ── */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
