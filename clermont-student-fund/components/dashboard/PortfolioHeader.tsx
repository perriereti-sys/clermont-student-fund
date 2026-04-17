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

  const time = new Date(lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="rounded-2xl px-5 sm:px-8 py-6 sm:py-7 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A3352 0%, #112540 50%, #0E1F33 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Gold top accent */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)' }} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

        {/* Left — main value */}
        <div>
          <p className="section-label mb-2.5">Portfolio Value</p>
          <p className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white">
            {fmt(totalValue)}
          </p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className="text-base font-semibold font-mono"
              style={{ color: isPositive ? '#34D399' : '#F87171' }}
            >
              {isPositive ? '+' : ''}{fmt(totalPnL)}
            </span>
            <span className={`badge ${isPositive ? 'badge-gain' : 'badge-loss'}`}>
              {isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: '#5B7A9A' }}>since inception</span>
          </div>
        </div>

        {/* Right — meta */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div>
            <p className="section-label mb-1">Initial Capital</p>
            <p className="text-sm font-mono font-semibold" style={{ color: '#94A3B8' }}>{fmt(100_000)}</p>
          </div>
          <div className="w-px h-10 hidden sm:block" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <p className="section-label mb-1">Last Update</p>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <p className="text-sm font-mono font-semibold" style={{ color: '#94A3B8' }}>{time}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
