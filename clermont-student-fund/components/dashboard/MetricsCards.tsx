interface CardProps {
  label: string;
  value: string;
  sub: string;
  description: string;
  valueColor?: string;
}

function MetricCard({ label, value, sub, description, valueColor }: CardProps) {
  return (
    <div className="rounded-2xl p-5 transition-all duration-200 card" style={{ borderLeft: '3px solid rgba(26,37,64,0.20)' }}>
      <p className="section-label mb-3">{label}</p>
      <p className={`text-2xl font-bold font-mono ${valueColor ?? 'text-navy'}`}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#8496B2' }}>{sub}</p>
      <p
        className="text-xs leading-relaxed mt-3 pt-3 border-t"
        style={{ color: '#8496B2', borderColor: 'rgba(26,37,64,0.07)' }}
      >
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
        valueColor={sharpeRatio > 1 ? 'text-gain' : sharpeRatio > 0 ? 'text-navy' : 'text-loss'}
      />
      <MetricCard
        label="Bêta"
        value={beta.toFixed(2)}
        sub={beta < 0.8 ? 'Défensif' : beta < 1.2 ? 'Neutre' : 'Offensif'}
        description="Sensibilité vs MSCI World — neutre à 1,00"
        valueColor="text-navy"
      />
      <MetricCard
        label="VaR 95 %"
        value={fmtUsd(var95)}
        sub="Par jour"
        description="Perte maximale journalière avec 95 % de confiance"
        valueColor="text-navy"
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
