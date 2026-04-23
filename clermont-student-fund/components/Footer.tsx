export default function Footer() {
  return (
    <footer
      className="relative mt-16 border-t overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, transparent 0%, rgba(20,32,55,0.6) 100%)' }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="px-4 sm:px-8 pt-10 pb-6 sm:pb-10" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="font-display font-bold text-2xl text-shimmer mb-1">CSF</p>
            <p className="text-xs font-medium" style={{ color: '#7A96B8' }}>Clermont Student Fund</p>
            <p className="text-xs mt-1" style={{ color: '#4A6080' }}>Association étudiante · Clermont-Ferrand · Est. 2025</p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a
              href="https://fr.linkedin.com/company/csf-clermont-student-fund"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.25)', color: '#60a5fa' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm font-semibold">LinkedIn</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            <a
              href="mailto:perrier.eti@gmail.com"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-sm font-semibold">Contact</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: '#4A6080' }}>© 2026 Clermont Student Fund — Tous droits réservés</p>
          <p className="text-xs" style={{ color: '#4A6080' }}>Portefeuille fictif à des fins pédagogiques</p>
        </div>
      </div>

      {/* Mobile bottom nav spacer — 72px nav + safe area */}
      <div className="sm:hidden" style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} />
    </footer>
  );
}
