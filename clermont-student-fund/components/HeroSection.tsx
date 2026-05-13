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
        Vue depuis Clermont-Ferrand en direction de la Chaîne des Puys, lumière de fin d'après-midi.

        Couches (arrière → avant) :
          1. Puy de Sancy — massif alpin lointain, silhouette découpée, bleu-gris atmosphérique
          2. Puy de Côme — masse irrégulière de dômes fusionnés
          3. Puy de Pariou — cône presque parfait avec cratère circulaire creusé au sommet
          4. Puy de la Vache + Puy de Lassolas — deux cônes sombres abrupts (scories)
          5. Puy de Dôme — grand dôme trachytique, sommet APLATI et allongé (pas un pic)
          6. Antenne et bâtiments scientifiques au sommet
          7. Voile de brume à la base

        viewBox 860×310, SVG positionné bottom-0 right-0.
        Sommet du dôme : plateau plat y=28, de x=425 à x=498 (73 px larges).
      */}
      <svg
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ opacity: 0.54, width: 'min(88vw, 860px)', height: 'auto' }}
        viewBox="0 0 860 310"
        aria-hidden
      >
        <defs>
          {/* Gradient principal dôme : basalte violet → roche volcanique orange → ocre solaire → vert forestier */}
          <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2A244E" />
            <stop offset="20%"  stopColor="#5C3C60" />
            <stop offset="46%"  stopColor="#BE5E3A" />
            <stop offset="72%"  stopColor="#967240" />
            <stop offset="100%" stopColor="#4C7A3A" />
          </linearGradient>

          {/* Lumière dorée de coucher de soleil sur le flanc droit */}
          <radialGradient id="sunsetGlow" cx="620" cy="100" r="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#F0A040" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#F0A040" stopOpacity="0"   />
          </radialGradient>

          {/* Brume légère à la base */}
          <linearGradient id="mistGrad" x1="0" y1="255" x2="0" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#EEF2F8" stopOpacity="0"   />
            <stop offset="100%" stopColor="#EEF2F8" stopOpacity="0.60" />
          </linearGradient>
        </defs>

        {/* ══════════════════════════════════════════════════
            COUCHE 1 — Puy de Sancy (massif alpin lointain)
            Silhouette découpée et accidentée, arêtes agressives,
            couleur bleu-gris très pâle (perspective atmosphérique).
        ══════════════════════════════════════════════════ */}
        <path
          fill="#9AAABB"
          opacity="0.34"
          d="
            M 0 310 L 0 260
            C 12 254 24 248 35 242
            C 39 238 43 235 46 234 C 49 233 52 234 55 238
            C 62 245 72 256 88 261
            C 104 265 120 262 134 255
            C 140 250 146 244 151 240 C 155 237 158 235 161 234 C 164 233 168 235 172 239
            C 180 248 194 260 214 263
            L 860 263 L 860 310 Z
          "
        />

        {/* ══════════════════════════════════════════════════
            COUCHE 2 — Puy de Côme (masse volcanique irrégulière)
            Plusieurs dômes fusionnés, bosses inégales, forme massive.
            Couleur : gris-brun volcanique chaud.
        ══════════════════════════════════════════════════ */}
        <path
          fill="#6C6452"
          opacity="0.60"
          d="
            M 0 310 L 0 280
            C 34 272 68 260 100 245
            C 114 237 128 222 136 208
            C 140 200 144 194 146 191 C 148 189 151 190 154 194
            C 158 202 164 216 174 226
            C 184 236 200 242 216 240
            C 226 237 234 226 240 212
            C 244 202 248 193 251 190 C 254 188 257 189 260 194
            C 266 206 274 222 288 232
            C 304 241 324 244 344 243
            L 860 243 L 860 310 Z
          "
        />

        {/* ══════════════════════════════════════════════════
            COUCHE 3 — Puy de Pariou (cône avec cratère)
            Cône quasi-parfait dont le sommet est CREUSÉ :
            deux lèvres de cratère avec un dip concave entre elles.
            Point clé : lèvres à y=148, fond de cratère à y=172.
        ══════════════════════════════════════════════════ */}
        <path
          fill="#6A8250"
          opacity="0.76"
          d="
            M 178 310 L 178 240
            C 192 230 208 212 220 194
            C 230 178 236 160 238 150
            C 238 148 238 148 238 148
            C 242 152 252 168 257 172
            C 262 168 270 152 276 150
            C 278 154 284 168 294 188
            C 304 206 320 228 342 238
            L 860 238 L 860 310 Z
          "
        />

        {/* ══════════════════════════════════════════════════
            COUCHE 4 — Puy de la Vache + Puy de Lassolas
            Deux cônes jumeaux sombres, formes abruptes,
            composés de scories rouges et noires.
            La Vache : pic à (648, 180). Lassolas : pic à (694, 178).
        ══════════════════════════════════════════════════ */}
        <path
          fill="#4A2E22"
          opacity="0.84"
          d="
            M 602 310 L 602 238
            C 616 228 632 210 640 194
            C 644 184 647 180 648 179
            C 649 180 652 188 660 202
            C 668 216 680 228 692 232
            C 694 228 694 216 694 202
            C 694 188 694 180 694 178
            C 695 179 698 188 704 202
            C 712 220 728 232 750 238
            L 860 238 L 860 310 Z
          "
        />

        {/* ══════════════════════════════════════════════════
            COUCHE 5 — Puy de Dôme (dôme trachytique principal)

            Forme essentielle : sommet LARGE et PLAT (pas un pic),
            pentes douces et régulières en S-curve, quasi-symétrique.
            Le plateau plat y=28 de x=425 à x=498 est la signature
            du dôme trachytique, à l'inverse d'un volcan explosif.
        ══════════════════════════════════════════════════ */}
        <path
          fill="url(#domeGrad)"
          d="
            M 0 310 L 0 290
            C 55 283 110 270 165 252
            C 215 234 256 210 294 182
            C 325 158 348 130 364 102
            C 378 78 388 58 396 44
            C 402 36 408 30 416 28
            C 420 27 423 27 425 28
            L 498 28
            C 500 28 504 30 510 36
            C 518 46 528 62 542 86
            C 560 118 582 152 610 180
            C 638 208 672 228 714 244
            C 746 256 784 264 822 268
            L 860 270 L 860 310 Z
          "
        />

        {/* Lumière de coucher de soleil sur le flanc droit du dôme */}
        <path
          fill="url(#sunsetGlow)"
          d="
            M 0 310 L 0 290
            C 55 283 110 270 165 252
            C 215 234 256 210 294 182
            C 325 158 348 130 364 102
            C 378 78 388 58 396 44
            C 402 36 408 30 416 28
            C 420 27 423 27 425 28
            L 498 28
            C 500 28 504 30 510 36
            C 518 46 528 62 542 86
            C 560 118 582 152 610 180
            C 638 208 672 228 714 244
            C 746 256 784 264 822 268
            L 860 270 L 860 310 Z
          "
        />

        {/* ══════════════════════════════════════════════════
            COUCHE 6 — Détails au sommet
            Antenne emblématique + bâtiments scientifiques discrets.
        ══════════════════════════════════════════════════ */}
        {/* Antenne fine et verticale */}
        <rect x="460" y="6" width="2" height="22" rx="1" fill="#2A2240" opacity="0.88" />
        {/* Bâtiment principal (observatoire) */}
        <rect x="443" y="24" width="14" height="5" rx="1" fill="#2A2240" opacity="0.82" />
        {/* Bâtiment secondaire */}
        <rect x="466" y="25" width="10" height="4" rx="0.5" fill="#2A2240" opacity="0.75" />

        {/* ══════════════════════════════════════════════════
            COUCHE 7 — Brume légère au pied des volcans
        ══════════════════════════════════════════════════ */}
        <rect x="0" y="0" width="860" height="310" fill="url(#mistGrad)" />
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
