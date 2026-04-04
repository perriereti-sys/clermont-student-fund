interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  valueColor?: string;
  accentColor: string; // top border color class
  icon: string;
}

function MetricCard({ label, value, description, valueColor, accentColor, icon }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card hover:shadow-card-hover hover:border-border-light transition-all duration-200 group">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentColor}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
          <span className="text-lg opacity-50 group-hover:opacity-80 transition-opacity">{icon}</span>
        </div>
        <p className={`text-2xl font-bold mb-1.5 font-mono tracking-tight ${valueColor ?? 'text-white'}`}>
          {value}
        </p>
        <p className="text-gray-600 text-[11px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface Props {
  sharpeRatio: number;
  beta: number;
  var95: number;
  maxDrawdown: number;
  totalValue: number;
}

export default function MetricsCards({
  sharpeRatio,
  beta,
  var95,
  maxDrawdown,
  totalValue,
}: Props) {
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const sharpeColor =
    sharpeRatio > 1 ? 'text-gain' : sharpeRatio > 0 ? 'text-yellow-400' : 'text-loss';

  const betaColor =
    beta < 0.8 ? 'text-blue-400' : beta < 1.2 ? 'text-white' : 'text-yellow-400';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Sharpe Ratio"
        value={sharpeRatio.toFixed(2)}
        description="Rendement ajusté du risque — cible > 1"
        valueColor={sharpeColor}
        accentColor="bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        icon="◈"
      />
      <MetricCard
        label="Beta"
        value={beta.toFixed(2)}
        description="Sensibilité vs MSCI World — neutre à 1"
        valueColor={betaColor}
        accentColor="bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        icon="β"
      />
      <MetricCard
        label="VaR 95 %"
        value={fmtUsd(var95)}
        description="Perte quotidienne max (95% confiance)"
        valueColor="text-amber-400"
        accentColor="bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
        icon="⚠"
      />
      <MetricCard
        label="Max Drawdown"
        value={`-${maxDrawdown.toFixed(1)}%`}
        description="Plus forte baisse depuis un sommet"
        valueColor="text-loss"
        accentColor="bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
        icon="↓"
      />
    </div>
  );
}
