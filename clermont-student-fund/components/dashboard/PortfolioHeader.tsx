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
    <div
      className="rounded-xl px-5 sm:px-8 py-6 sm:py-7 card-static relative overflow-hidden"
    >
      {/* Navy top accent bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 3, background: 'linear-gradient(90deg, rgba(26,37,64,0.30) 0%, rgba(26,37,64,0.10) 60%, transparent 100%)' }}
      />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

        {/* Left — main value */}
        <div>
          <p className="section-label mb-3">Valeur du portefeuille</p>
          <p
            className="font-bold font-mono tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: '#1A2540', lineHeight: 1 }}
          >
            {fmt(totalValue)}
          </p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className="text-sm font-semibold font-mono"
              style={{ color: isPositive ? '#0A8E62' : '#C93048' }}
            >
              {isPositive ? '+' : ''}{fmt(totalPnL)}
            </span>
            <span className={`badge ${isPositive ? 'badge-gain' : 'badge-loss'}`}>
              {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: '#8496B2' }}>depuis l'origine</span>
          </div>
        </div>

        {/* Right — meta */}
        <div
          className="flex items-center gap-6 sm:gap-8 pb-1"
          style={{ borderLeft: '1px solid rgba(26,37,64,0.08)', paddingLeft: '1.5rem' }}
        >
          <div>
            <p className="section-label mb-1.5">Capital initial</p>
            <p className="text-sm font-mono font-medium" style={{ color: '#8496B2' }}>{fmt(100_000)}</p>
          </div>
          <div>
            <p className="section-label mb-1.5">Mise à jour</p>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <p className="text-sm font-mono font-medium" style={{ color: '#8496B2' }}>{time}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
