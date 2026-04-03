interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  color?: string;
}

function MetricCard({ label, value, description, color }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-1 ${color ?? 'text-white'}`}>{value}</p>
      <p className="text-gray-500 text-xs">{description}</p>
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Sharpe Ratio"
        value={sharpeRatio.toFixed(2)}
        description="Rendement ajusté du risque (> 1 = bon)"
        color={sharpeColor}
      />
      <MetricCard
        label="Beta"
        value={beta.toFixed(2)}
        description="Sensibilité vs MSCI World (1 = marché)"
        color={betaColor}
      />
      <MetricCard
        label="VaR 95%"
        value={fmtUsd(var95)}
        description="Perte max quotidienne (95% de confiance)"
        color="text-yellow-400"
      />
      <MetricCard
        label="Max Drawdown"
        value={`-${maxDrawdown.toFixed(1)}%`}
        description="Plus forte baisse depuis un sommet"
        color="text-loss"
      />
    </div>
  );
}
