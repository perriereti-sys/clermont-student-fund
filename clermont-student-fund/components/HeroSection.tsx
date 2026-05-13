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
      {/*
        Puy de Dôme — dôme trachytique (forme caractéristique : sommet LARGE et aplati,
        pentes en S-curve douces, très différent d'un cône ou d'un pic alpin).
        Chaîne des Puys visible sur les flancs avec des cônes volcaniques individuels.
        viewBox 860×310, SVG positionné bottom-0 right-0.
      */}
      <svg
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ opacity: 0.52, width: 'min(88vw, 860px)', height: 'auto' }}
        viewBox="0 0 860 310"
        aria-hidden
      >
        <defs>
          {/*
            Gradient vertical du sommet vers la base :
            basalte violet-indigo (trachyte foncé) → flancs terracotta (roche volcanique exposée)
            → ocre chaud (sol volcanique) → vert forestier (forêts du plateau).
          */}
          <linearGradient id="puydomeGrad" x1="0" y1="0" x2="0" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#242048" />
            <stop offset="16%"  stopColor="#5E3E72" />
            <stop offset="40%"  stopColor="#C26A42" />
            <stop offset="68%"  stopColor="#9A7B50" />
            <stop offset="100%" stopColor="#548848" />
          </linearGradient>

          {/* Halo atmosphérique au sommet : lumière rasante sur la roche trachytique */}
          <radialGradient id="summitHaze" cx="508" cy="4" r="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#C87050" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C87050" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/*
          CHAÎNE DES PUYS — cônes secondaires, second plan.
          Cônes distincts visibles sur le flanc gauche (x≈120 et x≈240) et droit (x≈705 et x≈810).
          Pics à y≈168-195 → clairement visibles au-dessus des pentes du dôme principal
          dans ces zones (pente gauche y≈270 à x=120, pente droite y≈254 à x=810).
          La partie centrale est naturellement masquée derrière le dôme principal.
        */}
        <path
          fill="#8090BC"
          opacity="0.52"
          d="
            M 0 310 L 0 278
            C 32 271 62 261 90 248
            C 104 239 115 212 122 192 C 124 184 126 178 127 175 C 128 174 130 174 131 175 C 133 179 136 190 142 205
            C 150 222 160 236 174 243
            C 188 249 204 252 218 249
            C 228 246 238 228 242 215 C 244 207 246 199 247 196 C 248 195 249 196 250 199 C 253 207 259 222 268 234
            C 278 244 294 250 316 251
            C 350 252 390 251 432 250
            C 468 250 504 251 536 251
            C 562 251 584 248 602 243 C 614 238 624 231 632 224
            C 642 217 652 211 660 208
            C 670 198 682 185 690 178 C 696 173 702 169 706 168 C 708 168 710 169 712 172 C 717 180 724 194 736 206
            C 748 218 764 226 782 228
            C 792 225 800 220 808 217 C 810 216 812 216 814 218 C 817 222 822 229 832 235
            C 840 239 850 241 860 241
            L 860 310 Z
          "
        />

        {/*
          PUY DE DÔME — dôme principal.
          Forme clé : sommet APLATI sur ~130px (x≈448 à x≈570, y≈2-10).
          Pentes gauche et droite en S-curve larges et douces (caractère bouclier).
          Le gradient vertical crée les strates géologiques visibles sur la silhouette.
        */}
        <path
          fill="url(#puydomeGrad)"
          d="
            M 0 310 L 0 292
            C 52 284 108 270 162 252
            C 212 234 256 210 296 184
            C 328 162 352 136 370 106
            C 384 82 392 60 402 42
            C 408 32 413 24 420 18
            C 426 13 433 9 442 7
            C 450 5 458 3 468 2
            C 478 1 488 1 498 1
            C 508 1 520 2 532 3
            C 544 5 556 7 564 11
            C 572 15 578 22 582 32
            C 588 46 594 64 606 86
            C 620 114 640 144 664 170
            C 688 196 716 218 748 234
            C 778 248 812 259 845 265
            L 860 268 L 860 310 Z
          "
        />

        {/* Halo chaud au sommet */}
        <ellipse cx="508" cy="12" rx="128" ry="56" fill="url(#summitHaze)" />
      </svg>

      <div className="relative z-10 px-8 sm:px-12 py-12 sm:py-16">

        <p
          className="text-xs font-semibold tracking-[0.15em] uppercase mb-6"
          style={{ color: '#8496B2' }}
        >
          Association étudiante · Clermont-Ferrand · Est. 2025
        </p>

        <h1
          className="font-display font-bold leading-[1.05] mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1A2540' }}
        >
          Clermont<br />
          <span style={{ color: '#B8963A' }}>Student Fund</span>
        </h1>

        <div className="flex items-center gap-2 mb-6">
          <div style={{ width: 48, height: 2, background: 'rgba(184,150,58,0.5)', borderRadius: 1 }} />
          <div style={{ width: 20, height: 2, background: 'rgba(26,37,64,0.18)', borderRadius: 1 }} />
        </div>

        <p
          className="text-base leading-relaxed mb-8 max-w-lg"
          style={{ color: '#5C6E8A' }}
        >
          Un fonds d'investissement étudiant piloté par des passionnés de marchés
          financiers. On analyse, on débat, on investit — ensemble.
        </p>

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
