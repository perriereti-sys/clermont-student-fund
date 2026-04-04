interface Props {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  lastUpdated: string;
}

export default function PortfolioHeader({ totalValue, totalPnL, totalPnLPercent, lastUpdated }: Props) {
  const isPositive = totalPnL >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const time = new Date(lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-600 animate-fade-up"
      style={{ background: 'linear-gradient(135deg, #0F2235 0%, #0B1C2C 60%, #0F2235 100%)' }}>

      {/* Gold shimmer line on top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* Decorative gold glow - top right */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />

      <div className="relative px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          {/* ── Left: main value ── */}
          <div>
            <p className="section-label mb-3">Valeur totale du portefeuille</p>

            <div className="text-gold-gradient font-display font-bold leading-none"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)' }}>
              {fmt(totalValue)}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`text-base font-semibold font-mono ${isPositive ? 'text-gain' : 'text-loss'}`}>
                {isPositive ? '+' : ''}{fmt(totalPnL)}
              </span>

              <span className={`badge ${isPositive ? 'badge-gain' : 'badge-loss'} text-xs`}>
                {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
              </span>

              <span className="text-navy-500 text-xs" style={{ color: '#4A6080' }}>
                depuis le début
              </span>
            </div>
          </div>

          {/* ── Right: meta ── */}
          <div className="flex flex-wrap gap-8 lg:text-right">
            {/* Live indicator */}
            <div className="flex lg:flex-col items-center lg:items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-xs text-gain font-medium">En direct</span>
              </div>
              <span className="text-xs" style={{ color: '#4A6080' }}>{time}</span>
            </div>

            {/* Separator */}
            <div className="hidden lg:block w-px bg-navy-600 self-stretch" />

            {/* Capital stats */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <div>
                <p className="section-label mb-1">Capital initial</p>
                <p className="text-slate-300 font-semibold font-mono text-sm">{fmt(100_000)}</p>
              </div>
              <div>
                <p className="section-label mb-1">Performance</p>
                <p className={`font-semibold font-mono text-sm ${isPositive ? 'text-gain' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-navy-600 to-transparent" />
    </div>
  );
}
