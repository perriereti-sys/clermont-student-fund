interface Props {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  lastUpdated: string;
}

export default function PortfolioHeader({
  totalValue,
  totalPnL,
  totalPnLPercent,
  lastUpdated,
}: Props) {
  const isPositive = totalPnL >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const time = new Date(lastUpdated).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-header-gradient shadow-card">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Subtle radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

          {/* Main value block */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Valeur totale du portefeuille
            </p>
            <p className="text-[2.75rem] font-bold leading-none text-gold-gradient animate-value">
              {fmt(totalValue)}
            </p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span
                className={`text-base font-semibold ${
                  isPositive ? 'text-gain' : 'text-loss'
                }`}
              >
                {isPositive ? '+' : ''}
                {fmt(totalPnL)}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isPositive
                    ? 'bg-gain/10 text-gain border-gain/20'
                    : 'bg-loss/10 text-loss border-loss/20'
                }`}
              >
                {isPositive ? '+' : ''}
                {totalPnLPercent.toFixed(2)}%
              </span>
              <span className="text-gray-600 text-xs">depuis le début</span>
            </div>
          </div>

          {/* Right info block */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gain glow-dot animate-pulse" />
              Temps réel · {time}
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">Capital initial</p>
                <p className="text-sm font-medium text-gray-400">{fmt(100000)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">Performance</p>
                <p className={`text-sm font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom subtle separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light/40 to-transparent" />
    </div>
  );
}
