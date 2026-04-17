interface CardProps {
  label: string;
  value: string;
  sub: string;
  description: string;
  valueColor?: string;
}

function MetricCard({ label, value, sub, description, valueColor }: CardProps) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 card"
    >
      <p className="section-label mb-3">{label}</p>
      <p className={`text-2xl font-bold font-mono ${valueColor ?? 'text-slate-100'}`}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#5B7A9A' }}>{sub}</p>
      <p className="text-xs leading-relaxed mt-3 pt-3 border-t" style={{ color: '#5B7A9A', borderColor: 'rgba(255,255,255,0.06)' }}>
        {description}
      </p>
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

export default function MetricsCards({ sharpeRatio, beta, var95, maxDrawdown }: Props) {
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Sharpe Ratio"
        value={sharpeRatio.toFixed(2)}
        sub={sharpeRatio > 1 ? 'Excellent' : sharpeRatio > 0 ? 'Correct' : 'Faible'}
        description="Rendement ajusté du risque — cible supérieure à 1"
        valueColor={sharpeRatio > 1 ? 'text-gain' : sharpeRatio > 0 ? 'text-slate-200' : 'text-loss'}
      />
      <MetricCard
        label="Bêta"
        value={beta.toFixed(2)}
        sub={beta < 0.8 ? 'Défensif' : beta < 1.2 ? 'Neutre' : 'Offensif'}
        description="Sensibilité vs MSCI World — neutre à 1,00"
        valueColor="text-slate-200"
      />
      <MetricCard
        label="VaR 95 %"
        value={fmtUsd(var95)}
        sub="Par jour"
        description="Perte maximale journalière avec 95 % de confiance"
        valueColor="text-slate-200"
      />
      <MetricCard
        label="Max Drawdown"
        value={`−${maxDrawdown.toFixed(1)} %`}
        sub="Pic → creux"
        description="Plus forte correction depuis un sommet historique"
        valueColor="text-loss"
      />
    </div>
  );
}
