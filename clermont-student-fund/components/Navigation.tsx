'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ── SVG Bull Logo ────────────────────────────────────────────────── */
function BullIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Horns */}
      <path d="M22 18 C14 10 10 20 16 26 C18 28 22 30 26 30" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M44 16 C52 8 58 18 52 24 C50 26 46 28 42 29" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Head */}
      <ellipse cx="33" cy="36" rx="15" ry="13" fill="#D4AF37"/>
      {/* Snout */}
      <ellipse cx="26" cy="42" rx="9" ry="7" fill="#D4AF37"/>
      {/* Nostrils */}
      <circle cx="23" cy="44" r="1.8" fill="#0B1C2C"/>
      <circle cx="29" cy="44" r="1.8" fill="#0B1C2C"/>
      {/* Eye */}
      <circle cx="28" cy="31" r="3" fill="#0B1C2C"/>
      <circle cx="29" cy="30" r="1" fill="#D4AF37"/>
      {/* Body */}
      <ellipse cx="52" cy="50" rx="20" ry="14" fill="#D4AF37"/>
      {/* Neck */}
      <path d="M34 38 C38 42 42 46 44 50 C46 54 42 58 36 56 C30 54 26 48 30 42 Z" fill="#D4AF37"/>
      {/* Front legs */}
      <rect x="36" y="60" width="7" height="16" rx="3.5" fill="#D4AF37"/>
      <rect x="46" y="62" width="7" height="14" rx="3.5" fill="#D4AF37"/>
      {/* Back legs */}
      <rect x="57" y="60" width="7" height="16" rx="3.5" fill="#D4AF37"/>
      <rect x="65" y="58" width="6" height="18" rx="3" fill="#D4AF37"/>
      {/* Tail */}
      <path d="M72 42 C78 34 76 24 70 22" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

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

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy-700 border border-navy-600 group-hover:border-gold/30 transition-all duration-200" style={{ boxShadow: '0 0 0 0 rgba(212,175,55,0)' }}>
              <BullIcon size={26} />
            </div>
            <div className="flex flex-col leading-none hidden sm:flex">
              <span className="font-display font-700 text-sm tracking-[0.15em] text-gold">
                CSF
              </span>
              <span className="text-[10px] text-navy-500 tracking-wider font-medium mt-0.5"
                style={{ color: '#4A6080' }}>
                Clermont Student Fund
              </span>
            </div>
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
