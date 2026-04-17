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
    <div className="rounded-xl border border-navy-600 px-4 sm:px-7 py-5 sm:py-6"
      style={{ background: '#0F2235' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">

        {/* Left */}
        <div>
          <p className="section-label mb-2">Valeur du portefeuille</p>
          <p className="text-3xl font-semibold text-slate-100 font-mono tracking-tight">
            {fmt(totalValue)}
          </p>
          <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
            <span className={`text-sm font-medium font-mono ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isPositive ? '+' : ''}{fmt(totalPnL)}
            </span>
            <span className={`badge text-xs ${isPositive ? 'badge-gain' : 'badge-loss'}`}>
              {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: '#4A6080' }}>depuis le début</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 sm:text-right">
          <div>
            <p className="section-label mb-1">Capital initial</p>
            <p className="text-sm font-mono text-slate-400">{fmt(100_000)}</p>
          </div>
          <div className="w-px h-8 bg-navy-600 hidden sm:block" />
          <div>
            <p className="section-label mb-1">Mise à jour</p>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <p className="text-sm font-mono text-slate-400">{time}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
