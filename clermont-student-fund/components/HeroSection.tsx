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
        style={{ opacity: 0.10, width: 'min(88vw, 860px)', height: 'auto' }}
        viewBox="0 0 860 310"
        aria-hidden
      >
        {/* Chaîne des Puys — secondary volcanic cones creating depth */}
        <path
          fill="#1A2540"
          opacity="0.38"
          d="M 0 310 L 0 278
             C 38 274 72 268 108 262
             C 142 256 168 246 192 235
             C 214 225 232 211 248 200
             Q 259 191 270 192
             Q 281 193 292 203
             C 308 216 326 235 355 246
             C 388 257 427 262 470 264
             C 510 266 552 265 593 262
             C 630 259 666 253 700 245
             Q 715 241 730 242
             Q 745 243 760 250
             C 782 261 806 275 835 284
             C 848 288 856 290 860 291
             L 860 310 Z"
        />

        {/* Main Puy de Dôme — broad rounded dome, characteristic shield shape */}
        <path
          fill="#1A2540"
          d="M 0 310 L 0 296
             C 40 292 78 286 115 278
             C 160 269 200 255 238 239
             C 274 223 306 203 334 180
             C 360 158 378 131 390 103
             C 400 79 404 56 406 37
             C 407 24 408 13 409 7
             Q 410 2 414 0
             Q 418 -1 422 2
             Q 426 6 427 14
             C 429 26 431 42 434 62
             C 438 86 444 114 456 143
             C 469 174 489 204 515 228
             C 542 253 574 270 612 280
             C 648 290 688 294 730 296
             C 768 298 808 298 845 297
             L 860 297
             L 860 310 Z"
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
          Un fonds d'investissement étudiant piloté par des passionnés de marchés
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
