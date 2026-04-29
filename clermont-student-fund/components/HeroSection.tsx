export default function HeroSection() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F5FB 100%)',
        border: '1px solid rgba(26,37,64,0.10)',
        borderLeft: '4px solid rgba(26,37,64,0.25)',
        boxShadow: '0 2px 12px rgba(26,37,64,0.07)',
      }}
    >
      {/* Puy de Dôme silhouette — clin d'œil à Clermont */}
      <svg
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        width="420" height="160" viewBox="0 0 420 160"
        style={{ opacity: 0.065 }}
        aria-hidden
      >
        <path
          d="M0 160 L60 160 L80 130 L100 110 L115 95 L130 100 L145 80 L155 55 L162 35 L168 45 L175 30 L182 20 L190 28 L200 10 L210 22 L220 15 L228 30 L235 25 L242 40 L252 60 L265 75 L280 90 L295 100 L315 105 L335 115 L360 130 L390 145 L420 155 L420 160 Z"
          fill="#1A2540"
        />
        <path
          d="M195 10 Q200 0 205 8 L210 4 Q215 -2 220 6 L225 2"
          fill="none" stroke="#1A2540" strokeWidth="4" strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 px-8 sm:px-12 py-12 sm:py-16">

        {/* Label */}
        <p
          className="text-xs font-semibold tracking-[0.15em] uppercase mb-6"
          style={{ color: '#8496B2' }}
        >
          Association étudiante · Clermont-Ferrand · Est. 2025
        </p>

        {/* Heading */}
        <h1
          className="font-display font-bold leading-[1.05] mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1A2540' }}
        >
          Clermont<br />
          <span style={{ color: '#B8963A' }}>Student Fund</span>
        </h1>

        {/* Separator */}
        <div className="flex items-center gap-2 mb-6">
          <div style={{ width: 48, height: 2, background: 'rgba(184,150,58,0.5)', borderRadius: 1 }} />
          <div style={{ width: 20, height: 2, background: 'rgba(26,37,64,0.18)', borderRadius: 1 }} />
        </div>

        {/* Description */}
        <p
          className="text-base leading-relaxed mb-8 max-w-lg"
          style={{ color: '#5C6E8A' }}
        >
          Un fond d'investissement étudiant piloté par des passionnés de marchés
          financiers. On analyse, on débat, on investit — ensemble.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <a
            href="#portfolio"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#B8963A', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(184,150,58,0.30)' }}
          >
            Voir le portefeuille
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
          <a
            href="#rejoindre"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-surface-3 active:scale-95"
            style={{ color: '#5C6E8A', border: '1px solid rgba(26,37,64,0.15)' }}
          >
            Nous rejoindre
          </a>
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8"
          style={{ borderTop: '2px solid rgba(26,37,64,0.10)' }}
        >
          {[
            { value: '$100 000', label: 'Capital initial' },
            { value: '10',       label: 'Actifs en portefeuille' },
            { value: 'Multi-actifs', label: 'Stratégie' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display font-bold text-lg" style={{ color: '#1A2540' }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
